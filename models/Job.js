// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  location: String,
  experienceLevel: String,
  education: String,
  employmentType: String,
  deadline: String,
  link: { type: String, unique: true },
  sector: String,
  salary: String,
  postedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);
