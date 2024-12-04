// app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const errorHandler = require('./middlewares/errorHandler');

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
        url: `https://113.198.66.75:${config.port}/api-docs`,
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 에러 처리 미들웨어
app.use(errorHandler);

// 데이터베이스 연결 및 서버 시작
mongoose
  .connect(config.mongoURI)
  .then(() => {
    app.listen(config.port, () => console.log(`서버가 ${config.port}번 포트에서 실행 중입니다. /apidocs를 붙여서 확인해주세요.`));
  })
  .catch((err) => console.error('MongoDB 연결 실패:', err));
