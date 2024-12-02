// middlewares/errorHandler.js
module.exports = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  };
  