const Attendance = require('../models/Attendance');
const moment = require('moment');

// Mark attendance
// POST /api/attendance
// Private (Employee)
exports.markAttendance = async (req, res, next) => {
  try {
    const { date, status, remarks } = req.body;

    // Validate required fields
    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and attendance status'
      });
    }

    // Validate status
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Present or Absent'
      });
    }

    // Parse and validate date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the future
    if (attendanceDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for future dates'
      });
    }

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      employee: req.user.id,
      date: attendanceDate
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: `Attendance already marked for ${moment(attendanceDate).format('DD-MM-YYYY')}`
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      employee: req.user.id,
      date: attendanceDate,
      status,
      remarks
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('employee', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: populatedAttendance
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date'
      });
    }
    next(error);
  }
};

// Get my attendance records
// GET /api/attendance/my-attendance
// Private (Employee)
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, month, year } = req.query;

    // Build filter
    let filter = { employee: req.user.id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      filter.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'fullName email')
      .sort({ date: -1 });

    // Calculate statistics
    const totalPresent = attendance.filter(a => a.status === 'Present').length;
    const totalAbsent = attendance.filter(a => a.status === 'Absent').length;

    res.status(200).json({
      success: true,
      count: attendance.length,
      statistics: {
        totalRecords: attendance.length,
        totalPresent,
        totalAbsent,
        attendancePercentage: attendance.length > 0 
          ? ((totalPresent / attendance.length) * 100).toFixed(2) 
          : 0
      },
      attendance
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance by ID
// GET /api/attendance/:id
// Private
exports.getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee', 'fullName email');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check if user is authorized
    if (req.user.role !== 'admin' && attendance.employee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this attendance record'
      });
    }

    res.status(200).json({
      success: true,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

// Update attendance
// PUT /api/attendance/:id
// Private (Employee - own records only)
exports.updateAttendance = async (req, res, next) => {
  try {
    let attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check if attendance belongs to the user
    if (attendance.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this attendance record'
      });
    }

    const { status, remarks } = req.body;

    // Update fields if provided
    if (status) {
      if (!['Present', 'Absent'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be Present or Absent'
        });
      }
      attendance.status = status;
    }

    if (remarks !== undefined) {
      attendance.remarks = remarks;
    }

    await attendance.save();

    const updatedAttendance = await Attendance.findById(attendance._id)
      .populate('employee', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      attendance: updatedAttendance
    });
  } catch (error) {
    next(error);
  }
};

// Delete attendance
// DELETE /api/attendance/:id
// Private (Employee - own records only)
exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Check if attendance belongs to the user
    if (attendance.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this attendance record'
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all attendance records (Admin only)
// GET /api/attendance/admin/all
// Private (Admin)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, status, month, year } = req.query;

    // Build filter
    let filter = {};

    if (employeeId) {
      filter.employee = employeeId;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      filter.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'fullName email')
      .sort({ date: -1 });

    // Calculate statistics
    const totalPresent = attendance.filter(a => a.status === 'Present').length;
    const totalAbsent = attendance.filter(a => a.status === 'Absent').length;

    res.status(200).json({
      success: true,
      count: attendance.length,
      statistics: {
        totalRecords: attendance.length,
        totalPresent,
        totalAbsent,
        attendancePercentage: attendance.length > 0 
          ? ((totalPresent / attendance.length) * 100).toFixed(2) 
          : 0
      },
      attendance
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance summary for all employees
// GET /api/attendance/admin/summary
// Private (Admin)
exports.getAttendanceSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    let dateFilter = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      dateFilter = { date: { $gte: start, $lte: end } };
    }

    const summary = await Attendance.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$employee',
          totalPresent: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
          },
          totalRecords: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $project: {
          employeeId: '$_id',
          employeeName: '$employee.fullName',
          employeeEmail: '$employee.email',
          totalPresent: 1,
          totalAbsent: 1,
          totalRecords: 1,
          attendancePercentage: {
            $multiply: [
              { $divide: ['$totalPresent', '$totalRecords'] },
              100
            ]
          }
        }
      },
      { $sort: { employeeName: 1 } }
    ]);

    res.status(200).json({
      success: true,
      count: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};
