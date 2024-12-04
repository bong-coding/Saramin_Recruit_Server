// app.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const errorHandler = require('./middlewares/errorHandler');


const key = fs.readFileSync('/home/ubuntu/key.pem');
const cert = fs.readFileSync('/home/ubuntu/cert.pem');

// 라우트 임포트
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting 설정
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100,
});
app.use(limiter);

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Platform API',
      version: '1.0.0',
      description: 'Job Platform API 문서',
    },
    servers: [
      {
        url: `https://113.198.66.75:17119`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 에러 처리 미들웨어
app.use(errorHandler);

// 데이터베이스 연결 및 서버 시작
mongoose
  .connect(config.mongoURI)
  .then(() => {
   const server = https.createServer({ key, cert }, app);     
   server.listen(config.port, '0.0.0.0', () => console.log(`서버가 ${config.port}번 포트에서 실행 중입니다.`));
  })
  .catch((err) => console.error('MongoDB 연결 실패:', err));
