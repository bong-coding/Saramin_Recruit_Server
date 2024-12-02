# Saramin API

## 소개

이 프로젝트는 Node.js와 Express.js를 사용하여 만든 채용 정보 플랫폼의 RESTful API입니다. MongoDB를 데이터베이스로 사용하며, JWT를 통한 인증 및 Swagger를 통한 API 문서화를 제공합니다.

## 기능

- **사용자 관리**: 회원가입, 로그인, 회원 정보 수정, 회원 탈퇴, JWT를 이용한 인증
- **채용 공고**: 공고 목록 조회, 공고 상세 조회, Saramin 공고 데이터를 크롤링하여 데이터베이스에 저장
- **지원 관리**: 지원하기, 지원 내역 조회, 지원 취소
- **북마크**: 공고 북마크 추가/제거, 북마크 목록 조회
- **크롤링**: 사람인 웹사이트에서 채용 공고 크롤링하여 데이터베이스에 저장
- **Swagger 기반 API 문서 제공**: /api-docs 경로에서 API 문서 확인 가능
- **보안** : 보안헤더 설정


1. 사용자 인증
HTTP 메서드	경로	설명
POST	/auth/register	회원가입
POST	/auth/login	로그인
GET	/auth/profile	사용자 프로필 조회
PUT	/auth/profile	프로필 수정
DELETE	/auth/profile	회원 탈퇴
2. 채용 공고
HTTP 메서드	경로	설명
GET	/jobs	공고 목록 조회
GET	/jobs/:id	공고 상세 조회
3. 지원 관리
HTTP 메서드	경로	설명
POST	/applications	공고 지원
GET	/applications	지원 내역 조회
DELETE	/applications/:id	지원 취소
4. 북마크 관리
HTTP 메서드	경로	설명
POST	/bookmarks	북마크 추가/제거
GET	/bookmarks	북마크 목록 조회
5. Swagger API 문서
HTTP 메서드	경로	설명
GET	/api-docs	Swagger API 문서

## 설치 및 실행

### 사전 요구 사항
 - .env : JWT_SECRET=your_secret_key
        - MONGO_URI=mongodb://<JCloud-퍼블릭-IP>:3000/saramin
        - PORT=443

- Swagger 문서 확인
     - https://<JCloud-서버-IP>/api-docs

### 설치
- npm init -y
- npm install axios cheerio mongoose express jsonwebtoken bcryptjs dotenv swagger-ui-express winston


<<<<<<< HEAD
```bash
- npm install
- npm install express mongoose jsonwebtoken express-validator swagger-jsdoc swagger-ui-express cors helmet dotenv express-rate-limit axios cheerio

- express: Node.js 웹 서버 프레임워크
- mongoose: MongoDB와 상호작용하기 위한 ODM(Object Data Modeling) 라이브러리
- jsonwebtoken: JWT 생성 및 검증
- express-validator: 입력 데이터 유효성 검증
- swagger-jsdoc: Swagger 문서를 생성
- swagger-ui-express: Swagger UI를 제공
- cors: CORS 설정을 관리
- helmet: HTTP 보안 헤더 설정
- dotenv: 환경 변수 관리
- express-rate-limit: API 호출 제한 설정
- axios: HTTP 요청 라이브러리 (크롤링에 사용)
- cheerio: HTML 파싱 및 DOM 탐색 (크롤링에 사용)
=======
>>>>>>> bd1f3e3d05fad4ce14f2871f3a06989d05b9fc28
