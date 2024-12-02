// routes/auth.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require('../middlewares/validate');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원 관리 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원 가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post(
  '/register',
  [
    check('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
    check('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // 중복 회원 검사
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ status: 'error', message: '이미 가입된 이메일입니다.' });
      }

      user = new User({ email, password, name });
      await user.save();

      res.status(201).json({ status: 'success', message: '회원가입이 완료되었습니다.' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       400:
 *         description: 인증 실패
 */
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
    check('password').exists().withMessage('비밀번호를 입력하세요.'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // 사용자 인증
      const user = await User.findOne({ email });
      if (!user || !user.comparePassword(password)) {
        return res.status(400).json({ status: 'error', message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }

      // JWT 토큰 발급
      const payload = { id: user._id };
      const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

      res.json({ status: 'success', data: { accessToken, refreshToken } });
    } catch (err) {
      res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
    }
  }
);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 회원 정보 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회원 정보 수정 성공
 *       401:
 *         description: 인증 필요
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, password } = req.body;

    if (name) req.user.name = name;
    if (password) req.user.password = password; // 비밀번호 암호화는 모델에서 처리

    await req.user.save();

    res.json({ status: 'success', message: '회원 정보가 수정되었습니다.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 회원 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 정보 조회 성공
 *       401:
 *         description: 인증 필요
 */
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ status: 'success', data: req.user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
 *       401:
 *         description: 인증 필요
 */
router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ status: 'success', message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
