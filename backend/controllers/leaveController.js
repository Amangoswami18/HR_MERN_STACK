const Leave = require('../models/Leave');
const User = require('../models/User');

// Apply for leave
// POST /api/leaves
// Private (Employee)
exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leave type, start date, and end date'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Calculate total days
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Check leave balance
    const user = await User.findById(req.user.id);
    if (totalDays > user.leaveBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You have ${user.leaveBalance} days available`
      });
    }

    // Create leave request
    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason
    });

    const populatedLeave = await Leave.findById(leave._id).populate('employee', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave: populatedLeave
    });
  } catch (error) {
    next(error);
  }
};

// Get all leaves for logged-in employee
// GET /api/leaves/my-leaves
// Private (Employee)
exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id })
      .populate('employee', 'fullName email')
      .populate('actionBy', 'fullName')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/leaves/:id
// Private
// Get single leave by ID
exports.getLeaveById = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'fullName email')
      .populate('actionBy', 'fullName');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user is authorized to view this leave
    if (req.user.role !== 'admin' && leave.employee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this leave request'
      });
    }

    res.status(200).json({
      success: true,
      leave
    });
  } catch (error) {
    next(error);
  }
};

// Update leave (only pending leaves)
// PUT /api/leaves/:id
// Private (Employee - own leaves only)
exports.updateLeave = async (req, res, next) => {
  try {
    let leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if leave belongs to the user
    if (leave.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this leave request'
      });
    }

    // Only pending leaves can be updated
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${leave.status.toLowerCase()} leave request`
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Update fields if provided
    if (leaveType) leave.leaveType = leaveType;
    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (reason !== undefined) leave.reason = reason;

    // Validate dates if updated
    if (startDate || endDate) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be in the past'
        });
      }

      if (end < start) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }

      // Recalculate total days
      const timeDiff = end.getTime() - start.getTime();
      leave.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      // Check leave balance
      const user = await User.findById(req.user.id);
      if (leave.totalDays > user.leaveBalance) {
        return res.status(400).json({
          success: false,
          message: `Insufficient leave balance. You have ${user.leaveBalance} days available`
        });
      }
    }

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id).populate('employee', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Leave request updated successfully',
      leave: updatedLeave
    });
  } catch (error) {
    next(error);
  }
};

// Cancel leave (delete pending leave)
// DELETE /api/leaves/:id
// Private (Employee - own leaves only)
exports.cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if leave belongs to the user
    if (leave.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave request'
      });
    }

    // Only pending leaves can be cancelled
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${leave.status.toLowerCase()} leave request`
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all leave requests (Admin only)
// GET /api/leaves/admin/all
// Private (Admin)
exports.getAllLeaves = async (req, res, next) => {
  try {
    const { status, employeeId } = req.query;

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (employeeId) filter.employee = employeeId;

    const leaves = await Leave.find(filter)
      .populate('employee', 'fullName email')
      .populate('actionBy', 'fullName')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// Approve or reject leave (Admin only)
// PUT /api/leaves/admin/:id/status
// Private (Admin)
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status (Approved or Rejected)'
      });
    }

    const leave = await Leave.findById(req.params.id).populate('employee');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Only pending leaves can be approved/rejected
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This leave request has already been ${leave.status.toLowerCase()}`
      });
    }

    // Update leave status
    leave.status = status;
    leave.actionDate = new Date();
    leave.actionBy = req.user.id;

    if (status === 'Rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // Update employee leave balance if approved
    if (status === 'Approved') {
      const employee = await User.findById(leave.employee._id);
      employee.leaveBalance -= leave.totalDays;
      await employee.save();
    }

    const updatedLeave = await Leave.findById(leave._id)
      .populate('employee', 'fullName email')
      .populate('actionBy', 'fullName');

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave: updatedLeave
    });
  } catch (error) {
    next(error);
  }
};
