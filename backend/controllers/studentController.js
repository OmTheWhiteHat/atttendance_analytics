const Session = require('../models/Session');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// @desc    Join an attendance session using a QR code token
// @route   POST /api/student/sessions/join
// @access  Private (Student only)
const joinSession = async (req, res) => {
  const { qrCodeToken } = req.body;

  try {
    // Find the student profile for the logged-in user
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Find the session corresponding to the QR code token
    const session = await Session.findOne({ qrCodeToken, isActive: true });
    if (!session) {
      return res.status(404).json({ message: 'Active session not found or QR code is invalid' });
    }

    // Check if the student has already joined this session
    const alreadyJoined = await Attendance.findOne({ student: student._id, session: session._id });
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this session' });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      student: student._id,
      session: session._id,
    });

    const attendance = await newAttendance.save();

    // Add the attendance record to the student's profile
    student.attendance.push(attendance._id);
    // Here you can add logic to update gamification stats like score and streak
    student.attendanceScore += 10; // Example: +10 points per attendance
    await student.save();

    // Add the student to the session's list of present students
    session.studentsPresent.push(student._id);
    await session.save();

    res.status(201).json({ message: 'Successfully joined the session', attendance });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all attendance records for the logged-in student
// @route   GET /api/student/attendance
// @access  Private (Student only)
const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const attendanceRecords = await Attendance.find({ student: student._id })
      .populate('session', ['course', 'startTime'])
      .sort({ timestamp: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Complete student onboarding after Clerk registration
// @route   POST /api/student/onboard
// @access  Public (Called after Clerk registration)
const onboardStudent = async (req, res) => {
  const {
    clerkUserId,
    email,
    firstName,
    lastName,
    fullName,
    rollNumber,
    registrationNumber,
    year,
    branch,
    section,
    phoneNumber,
    parentPhoneNumber,
    address
  } = req.body;

  try {
    // Validate required fields
    if (!clerkUserId || !email || !firstName || !rollNumber || !registrationNumber || !year || !branch || !phoneNumber || !parentPhoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        required: ['clerkUserId', 'email', 'firstName', 'rollNumber', 'registrationNumber', 'year', 'branch', 'phoneNumber', 'parentPhoneNumber']
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [
        { clerkUserId },
        { email },
        { rollNumber },
        { registrationNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        success: false,
        message: 'Student with this Clerk ID, email, roll number, or registration number already exists'
      });
    }

    // Create new student record
    const newStudent = new Student({
      clerkUserId,
      email: email.toLowerCase(),
      firstName,
      lastName: lastName || '',
      fullName: fullName || `${firstName} ${lastName || ''}`.trim(),
      rollNumber: rollNumber.toUpperCase(),
      registrationNumber,
      year: parseInt(year),
      branch,
      section: section || '',
      phoneNumber,
      parentPhoneNumber,
      address: address || '',
      // Generate a unique student ID (for legacy compatibility)
      studentId: `STU_${Date.now()}_${rollNumber.replace(/\s+/g, '')}`
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student onboarding completed successfully',
      student: {
        _id: savedStudent._id,
        clerkUserId: savedStudent.clerkUserId,
        fullName: savedStudent.fullName,
        rollNumber: savedStudent.rollNumber,
        year: savedStudent.year,
        branch: savedStudent.branch,
        section: savedStudent.section
      }
    });
  } catch (error) {
    console.error('Student onboarding error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Student with this ${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during student onboarding',
      error: error.message
    });
  }
};

// @desc    Get student profile by Clerk User ID
// @route   GET /api/student/profile/:clerkUserId
// @access  Private
const getStudentByClerkId = async (req, res) => {
  const { clerkUserId } = req.params;
  
  try {
    const student = await Student.findOne({ clerkUserId })
      .populate('attendance')
      .select('-__v');
    
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student profile not found' 
      });
    }
    
    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student profile',
      error: error.message
    });
  }
};

module.exports = {
  joinSession,
  getStudentAttendance,
  onboardStudent,
  getStudentByClerkId,
};
