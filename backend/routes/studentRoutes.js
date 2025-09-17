const express = require('express');
const router = express.Router();
const { 
  joinSession, 
  getStudentAttendance, 
  onboardStudent, 
  getStudentByClerkId 
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes (for onboarding)
// @route   POST api/student/onboard
// @desc    Complete student onboarding after Clerk registration
// @access  Public
router.post('/onboard', onboardStudent);

// Protected routes - require authentication
// Routes that require traditional auth (JWT)
router.use(protect, authorize('student'));

// @route   POST api/student/sessions/join
// @desc    Join an attendance session using a QR code token
// @access  Private (Student only)
router.post('/sessions/join', joinSession);

// @route   GET api/student/attendance
// @desc    Get all attendance records for the logged-in student
// @access  Private (Student only)
router.get('/attendance', getStudentAttendance);

// Protected routes that don't require role middleware (can be accessed by any authenticated user)
const protectedRouter = express.Router();
protectedRouter.use(protect);

// @route   GET api/student/profile/:clerkUserId
// @desc    Get student profile by Clerk User ID
// @access  Private
protectedRouter.get('/profile/:clerkUserId', getStudentByClerkId);

// Mount the protected router
router.use('/', protectedRouter);

module.exports = router;
