// models/Bookmark.js
const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
