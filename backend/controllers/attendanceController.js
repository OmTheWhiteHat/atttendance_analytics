const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  const { studentId, sessionId } = req.body;
  try {
    const existing = await Attendance.findOne({ studentId, sessionId });
    if (existing) return res.status(400).json({ message: 'Attendance already marked' });

    const attendance = await Attendance.create({ studentId, sessionId, status: 'present' });
    res.json({ message: 'Attendance marked', attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
