const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAllAttendance,
  getAttendanceSummary
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/', protect, markAttendance);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/:id', protect, getAttendanceById);
router.put('/:id', protect, updateAttendance);
router.delete('/:id', protect, deleteAttendance);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllAttendance);
router.get('/admin/summary', protect, authorize('admin'), getAttendanceSummary);

module.exports = router;
