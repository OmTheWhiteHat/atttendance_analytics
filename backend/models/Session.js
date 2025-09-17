const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  course: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  qrCodeToken: {
    type: String,
    required: true,
    unique: true,
  },
  // Proximity data can be stored here (e.g., Wi-Fi SSID, Bluetooth signal)
  proximityData: {
    type: String,
  },
  studentsPresent: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',
  }],
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;