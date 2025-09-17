const express = require('express');
const router = express.Router();
const { createSession, getTeacherSessions, endSession } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes in this file are protected and restricted to teachers
router.use(protect, authorize('teacher'));

// @route   POST api/teacher/sessions
// @desc    Create a new attendance session
// @access  Private (Teacher only)
router.post('/sessions', createSession);

// @route   GET api/teacher/sessions
// @desc    Get all sessions for the logged-in teacher
// @access  Private (Teacher only)
router.get('/sessions', getTeacherSessions);

// @route   PUT api/teacher/sessions/:sessionId/end
// @desc    End an active attendance session
// @access  Private (Teacher only)
router.put('/sessions/:sessionId/end', endSession);

module.exports = router;