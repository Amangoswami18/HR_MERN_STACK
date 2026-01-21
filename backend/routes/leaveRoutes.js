const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getLeaveById,
  updateLeave,
  cancelLeave,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/:id', protect, getLeaveById);
router.put('/:id', protect, updateLeave);
router.delete('/:id', protect, cancelLeave);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllLeaves);
router.put('/admin/:id/status', protect, authorize('admin'), updateLeaveStatus);

module.exports = router;
