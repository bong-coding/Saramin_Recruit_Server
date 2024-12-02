# Job Platform API

## 소개

이 프로젝트는 Node.js와 Express.js를 사용하여 만든 채용 정보 플랫폼의 RESTful API입니다. MongoDB를 데이터베이스로 사용하며, JWT를 통한 인증 및 Swagger를 통한 API 문서화를 제공합니다.

## 기능

- **회원 관리**: 회원가입, 로그인, 회원 정보 수정, 회원 탈퇴
- **채용 공고**: 공고 목록 조회, 공고 상세 조회
- **지원 관리**: 지원하기, 지원 내역 조회, 지원 취소
- **북마크**: 공고 북마크 추가/제거, 북마크 목록 조회
- **크롤링**: 사람인 웹사이트에서 채용 공고 크롤링하여 데이터베이스에 저장
- **보안**: JWT 인증, 입력 데이터 검증, Rate Limiting, 보안 헤더 설정

## 설치 및 실행

### 사전 요구 사항

- Node.js (v14 이상)
- MongoDB 데이터베이스

### 설치

```bash
git clone https://github.com/your-repo/job-platform.git
cd job-platform
npm install
