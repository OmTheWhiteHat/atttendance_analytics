const mongoose = require('mongoose');

const biometricSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, enum: ['face', 'fingerprint'], required: true },
  dataHash: Object, // Face descriptor array or fingerprint hash
}, { timestamps: true });

module.exports = mongoose.model('Biometric', biometricSchema);
