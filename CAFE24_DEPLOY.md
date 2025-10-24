# Cafe24 Node.js 서버 배포 가이드

## 🚀 배포 준비

### 1. 빌드 및 압축

```bash
# 프로덕션 빌드
npm run build

# 압축 파일 생성 (cafe24 업로드용)
tar -czf jeju-near.tar.gz .next server.js package.json next.config.js
```

### 2. Cafe24 Node.js 서버 설정

#### 서버 환경 설정

- **Node.js 버전**: 18.x 이상
- **포트**: 3000 (기본값)
- **시작 파일**: `server.js`

#### 환경 변수 설정

```bash
NODE_ENV=production
PORT=3000
```

### 3. SSL 인증서 설정 (HTTPS)

#### 자체 SSL 인증서 업로드

1. Cafe24 관리자 페이지 → SSL 인증서 관리
2. 인증서 파일 업로드:
   - `certificate.crt` (인증서 파일)
   - `private.key` (개인키 파일)
   - `ca_bundle.crt` (중간 인증서, 필요시)

#### Let's Encrypt 무료 SSL (권장)

1. Cafe24 관리자 페이지 → SSL 인증서 관리
2. "Let's Encrypt" 선택
3. 도메인 인증 후 자동 설치

### 4. 서버 시작 명령어

```bash
# 프로덕션 서버 시작
npm run start:server

# 또는 직접 실행
node server.js
```

## 🔒 보안 설정

### HTTPS 강제 리다이렉트

- HTTP → HTTPS 자동 리다이렉트
- HSTS 헤더 설정
- 보안 헤더 자동 적용

### 보안 헤더

- `Strict-Transport-Security`: HTTPS 강제
- `X-Frame-Options`: 클릭재킹 방지
- `X-Content-Type-Options`: MIME 타입 스니핑 방지
- `Referrer-Policy`: 리퍼러 정보 제한
- `Permissions-Policy`: 권한 정책 설정

## 📱 지역 감지 기능

### 자동 감지

- GPS 위치 기반 제주도 감지
- 위치 접근 불가 시 제주도 모드 기본 설정

### 모드 전환

- **제주도 모드**: 현재 위치 기반 서비스
- **현재 위치 모드**: 제주도 관광 정보 제공

## 🛠️ 트러블슈팅

### 위치 접근 오류

- HTTPS 필수 (HTTP에서는 위치 접근 불가)
- 브라우저 권한 설정 확인

### SSL 인증서 오류

- 인증서 유효성 확인
- 중간 인증서 포함 여부 확인

### 서버 시작 오류

- Node.js 버전 확인 (18.x 이상)
- 포트 충돌 확인
- 환경 변수 설정 확인

## 📞 지원

문제 발생 시 다음 정보와 함께 문의:

- 에러 로그
- 브라우저 콘솔 오류
- 서버 상태

