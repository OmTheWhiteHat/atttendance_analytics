const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  // Clerk Integration
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Personal Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  
  // Academic Information
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  branch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  
  // Emergency Contact
  parentPhoneNumber: {
    type: String,
    required: true,
  },
  
  // Legacy field for backwards compatibility
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // For existing functionality
  studentId: {
    type: String,
  },
  
  // Attendance tracking
  attendance: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance',
  }],
  
  // Gamification stats
  attendanceScore: {
    type: Number,
    default: 0,
  },
  dailyStreak: {
    type: Number,
    default: 0,
  },
  
  // Onboarding status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre-save middleware to update timestamps
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
