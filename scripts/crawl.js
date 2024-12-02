// scripts/crawl.js
const mongoose = require('mongoose');
const config = require('../config');
const { crawlSaramin, saveJobsToDB } = require('../utils/crawler');

mongoose
  .connect(config.mongoURI)
  .then(async () => {
    console.log('데이터베이스에 연결되었습니다.');

   
    const keyword = '백엔드'; 
    const pages = 5; 
    const jobs = await crawlSaramin(keyword, pages);

    await saveJobsToDB(jobs);

    mongoose.disconnect();
    console.log('크롤링 및 데이터 저장이 완료되었습니다.');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });
