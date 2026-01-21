const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide attendance date']
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, 'Please specify attendance status']
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [200, 'Remarks cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Validation: Cannot mark attendance for future dates
attendanceSchema.pre('save', function(next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Time ko midnight pe set karo
  // 2024-01-20 00:00:00
  
  const attendanceDate = new Date(this.date);
  attendanceDate.setHours(0, 0, 0, 0);
  
  if (attendanceDate > today) {
     // error bhej do
    next(new Error('Cannot mark attendance for future dates'));
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
