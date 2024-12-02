// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관련 API
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 공고 목록 조회
 *     tags: [Jobs]
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
 *         description: 한 페이지당 공고 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역 필터
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *         description: 경력 필터
 *     responses:
 *       200:
 *         description: 공고 목록 조회 성공
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, location, experienceLevel } = req.query;

    const query = {};

    // 검색 기능
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // 필터링 기능
    if (location) query.location = location;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const jobs = await Job.find(query)
      .populate('company')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ postedAt: -1 });

    const totalItems = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      status: 'success',
      data: jobs,
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

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 공고 상세 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공고 ID
 *     responses:
 *       200:
 *         description: 공고 상세 조회 성공
 *       404:
 *         description: 공고를 찾을 수 없음
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({ status: 'error', message: '공고를 찾을 수 없습니다.' });
    }

    // 조회수 증가
    job.views += 1;
    await job.save();

    res.json({ status: 'success', data: job });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
