const User = require('../models/User');

// Get all employees
// GET /api/users
// Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    // Build filter
    let filter = {};
    if (role) {
      filter.role = role;
    }

    // Search by name or email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
// GET /api/users/:id
// Private (Admin)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user
// PUT /api/users/:id
// Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { fullName, email, role, leaveBalance, isActive } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (leaveBalance !== undefined) user.leaveBalance = leaveBalance;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
// DELETE /api/users/:id
// Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
// GET /api/users/stats/:id
// Private (Admin)
exports.getUserStats = async (req, res, next) => {
  try {
    const Leave = require('../models/Leave');
    const Attendance = require('../models/Attendance');

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get leave statistics
    const leaveStats = await Leave.aggregate([
      { $match: { employee: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    // Get attendance statistics
    const attendanceStats = await Attendance.aggregate([
      { $match: { employee: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      user,
      leaves: {
        total: leaveStats.reduce((acc, curr) => acc + curr.count, 0),
        pending: leaveStats.find(s => s._id === 'Pending')?.count || 0,
        approved: leaveStats.find(s => s._id === 'Approved')?.count || 0,
        rejected: leaveStats.find(s => s._id === 'Rejected')?.count || 0,
        totalDaysTaken: leaveStats.find(s => s._id === 'Approved')?.totalDays || 0
      },
      attendance: {
        total: attendanceStats.reduce((acc, curr) => acc + curr.count, 0),
        present: attendanceStats.find(s => s._id === 'Present')?.count || 0,
        absent: attendanceStats.find(s => s._id === 'Absent')?.count || 0,
        attendancePercentage: 0
      }
    };

    if (stats.attendance.total > 0) {
      stats.attendance.attendancePercentage = 
        ((stats.attendance.present / stats.attendance.total) * 100).toFixed(2);
    }

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};
