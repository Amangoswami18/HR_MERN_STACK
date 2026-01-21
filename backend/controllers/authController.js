const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register new user
// POST /api/auth/register
// Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user (admin role can only be set manually in DB or through seeding)
    const user = await User.create({
      fullName,
      email,
      password,
      role: role === 'admin' ? 'employee' : role // Prevent admin registration through API
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        leaveBalance: user.leaveBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
// POST /api/auth/login
// Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        leaveBalance: user.leaveBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
// GET /api/auth/profile
// Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        leaveBalance: user.leaveBalance,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
// PUT /api/auth/profile
// Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName } = req.body;

    const user = await User.findById(req.user.id);

    if (fullName) {
      user.fullName = fullName;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        leaveBalance: user.leaveBalance
      }
    });
  } catch (error) {
    next(error);
  }
};
