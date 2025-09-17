const Session = require('../models/Session');
const Teacher = require('../models/Teacher');
const crypto = require('crypto');

// @desc    Create a new attendance session
// @route   POST /api/teacher/sessions
// @access  Private (Teacher only)
const createSession = async (req, res) => {
  const { course, proximityData } = req.body;

  try {
    // Get the teacher from the authenticated user
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Generate a unique token for the QR code
    const qrCodeToken = crypto.randomBytes(20).toString('hex');

    const newSession = new Session({
      course,
      teacher: teacher._id,
      qrCodeToken,
      proximityData, // Optional: Wi-Fi SSID, Bluetooth ID, etc.
    });

    const session = await newSession.save();

    // Add session to teacher's list of sessions
    teacher.sessions.push(session._id);
    await teacher.save();

    res.status(201).json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all sessions for the logged-in teacher
// @route   GET /api/teacher/sessions
// @access  Private (Teacher only)
const getTeacherSessions = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const sessions = await Session.find({ teacher: teacher._id }).sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    End an active attendance session
// @route   PUT /api/teacher/sessions/:sessionId/end
// @access  Private (Teacher only)
const endSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Ensure the teacher owns the session
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (session.teacher.toString() !== teacher._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to end this session' });
    }

    session.isActive = false;
    session.endTime = Date.now();
    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createSession,
  getTeacherSessions,
  endSession,
};