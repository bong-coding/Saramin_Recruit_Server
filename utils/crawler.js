// utils/crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const Company = require('../models/Company');
const Job = require('../models/Job');

async function crawlSaramin(keyword = '', pages = 1) {
  const jobs = [];
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
  };

  for (let page = 1; page <= pages; page++) {
    const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchword=${encodeURIComponent(
      keyword
    )}&recruitPage=${page}`;

    try {
      const response = await axios.get(url, { headers });
      const $ = cheerio.load(response.data);

      // 채용공고 목록 가져오기
      const jobListings = $('.item_recruit');

      jobListings.each((index, element) => {
        try {
          const job = $(element);

          // 회사명
          const companyName = job.find('.corp_name a').text().trim();

          // 채용 제목
          const title = job.find('.job_tit a').text().trim();

          // 채용 링크
          const link =
            'https://www.saramin.co.kr' + job.find('.job_tit a').attr('href');

          // 지역, 경력, 학력, 고용형태
          const conditions = job.find('.job_condition span');
          const location = conditions.eq(0).text().trim() || '';
          const experience = conditions.eq(1).text().trim() || '';
          const education = conditions.eq(2).text().trim() || '';
          const employmentType = conditions.eq(3).text().trim() || '';

          // 마감일
          const deadline = job.find('.job_date .date').text().trim();

          // 직무 분야
          const sector = job.find('.job_sector').text().trim() || '';

          // 평균연봉 정보 (있는 경우)
          const salaryBadge = job.find('.area_badge .badge');
          const salary = salaryBadge.text().trim() || '';

          jobs.push({
            companyName,
            title,
            link,
            location,
            experience,
            education,
            employmentType,
            deadline,
            sector,
            salary,
          });
        } catch (err) {
          console.error(`항목 파싱 중 에러 발생: ${err.message}`);
        }
      });

      console.log(`${page}페이지 크롤링 완료`);
      // 서버 부하 방지를 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`페이지 요청 중 에러 발생: ${err.message}`);
    }
  }

  return jobs;
}

async function saveJobsToDB(jobs) {
  for (const jobData of jobs) {
    try {
      // 회사 정보 저장 또는 업데이트
      let company = await Company.findOne({ name: jobData.companyName });
      if (!company) {
        company = new Company({ name: jobData.companyName });
        await company.save();
        console.log(`새로운 회사 저장: ${company.name}`);
      }

      // 중복 공고 체크
      const existingJob = await Job.findOne({ link: jobData.link });
      if (existingJob) {
        console.log(`이미 존재하는 공고 스킵: ${jobData.title}`);
        continue;
      }

      const job = new Job({
        title: jobData.title,
        company: company._id,
        location: jobData.location,
        experienceLevel: jobData.experience,
        education: jobData.education,
        employmentType: jobData.employmentType,
        deadline: jobData.deadline,
        link: jobData.link,
        sector: jobData.sector,
        salary: jobData.salary,
      });

      await job.save();
      console.log(`새로운 공고 저장: ${job.title}`);
    } catch (err) {
      console.error('데이터베이스 저장 중 오류 발생:', err);
    }
  }
}

module.exports = { crawlSaramin, saveJobsToDB };
