// middlewares/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ status: 'error', message: '인증 토큰이 필요합니다.' });

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ status: 'error', message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: '유효하지 않은 토큰입니다.' });
  }
};
