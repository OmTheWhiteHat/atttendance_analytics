const Session = require('../models/Session');
const QRCode = require('qrcode');

exports.createSession = async (req, res) => {
  const { teacherId, networkInfo } = req.body;
  try {
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const session = await Session.create({ teacherId, sessionCode, startTime: new Date(), networkInfo });

    // Generate QR code URL
    const qrData = await QRCode.toDataURL(sessionCode);
    res.json({ session, qrData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
