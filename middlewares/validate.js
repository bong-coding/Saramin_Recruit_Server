// middlewares/validate.js
const { validationResult } = require('express-validator');

module.exports = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', message: '유효하지 않은 입력 데이터입니다.', errors: errors.array() });
  }
  next();
};
