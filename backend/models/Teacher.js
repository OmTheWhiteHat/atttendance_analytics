const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  sessions: [{
    type: Schema.Types.ObjectId,
    ref: 'Session',
  }],
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;