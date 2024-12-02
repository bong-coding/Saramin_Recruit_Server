// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

// 비밀번호 암호화 (Base64 Encoding)
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = Buffer.from(this.password).toString('base64');
  }
  next();
});

// 비밀번호 비교 메서드
UserSchema.methods.comparePassword = function (password) {
  const encodedPassword = Buffer.from(password).toString('base64');
  return this.password === encodedPassword;
};

module.exports = mongoose.model('User', UserSchema);
