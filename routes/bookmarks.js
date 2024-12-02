// routes/bookmarks.js
const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관련 API
 */

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 추가/제거
 *     tags: [Bookmarks]
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
 *                 description: 북마크할 공고의 ID
 *     responses:
 *       200:
 *         description: 북마크 추가 또는 제거 성공
 *       401:
 *         description: 인증 필요
 */
router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    const existingBookmark = await Bookmark.findOne({ user: req.user._id, job: jobId });
    if (existingBookmark) {
      // 북마크 제거
      await existingBookmark.remove();
      return res.json({ status: 'success', message: '북마크가 제거되었습니다.' });
    } else {
      // 북마크 추가
      const bookmark = new Bookmark({
        user: req.user._id,
        job: jobId,
      });
      await bookmark.save();
      return res.json({ status: 'success', message: '북마크가 추가되었습니다.', data: bookmark });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 북마크 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 한 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 북마크 목록 조회 성공
 *       401:
 *         description: 인증 필요
 */
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('job')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalItems = await Bookmark.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      status: 'success',
      data: bookmarks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
