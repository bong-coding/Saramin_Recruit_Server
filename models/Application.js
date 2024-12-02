// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  status: { type: String, enum: ['지원 완료', '지원 취소'], default: '지원 완료' },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
