// models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  industry: String,
  location: String,
  size: Number,
  description: String,
  website: String,
});

module.exports = mongoose.model('Company', CompanySchema);
