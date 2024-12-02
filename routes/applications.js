// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 관련 API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원하기
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 지원할 공고의 ID
 *     responses:
 *       201:
 *         description: 지원 성공
 *       400:
 *         description: 잘못된 요청 또는 중복 지원
 *       401:
 *         description: 인증 필요
 */
router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    // 중복 지원 체크
    const existingApplication = await Application.findOne({ user: req.user._id, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ status: 'error', message: '이미 지원한 공고입니다.' });
    }

    const application = new Application({
      user: req.user._id,
      job: jobId,
    });

    await application.save();
    res.status(201).json({ status: 'success', message: '지원이 완료되었습니다.', data: application });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 지원 내역 조회 성공
 *       401:
 *         description: 인증 필요
 */
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('job');
    res.json({ status: 'success', data: applications });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 취소
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 지원 ID
 *     responses:
 *       200:
 *         description: 지원 취소 성공
 *       400:
 *         description: 취소 불가
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 지원 내역을 찾을 수 없음
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application || application.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ status: 'error', message: '지원 내역을 찾을 수 없습니다.' });
    }

    // 취소 가능 여부 확인 (예: 이미 처리된 지원은 취소 불가)
    if (application.status !== '지원 완료') {
      return res.status(400).json({ status: 'error', message: '해당 지원은 취소할 수 없습니다.' });
    }

    application.status = '지원 취소';
    await application.save();

    res.json({ status: 'success', message: '지원이 취소되었습니다.', data: application });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
