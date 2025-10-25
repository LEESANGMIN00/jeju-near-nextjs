# Vercel 배포 가이드

## ✅ 완료된 작업

- ✅ Neon 데이터베이스 연결
- ✅ 테이블 생성 및 데이터 입력 (2500개)
- ✅ API 라우트 설정

## 📋 Vercel 배포 단계

### 1단계: GitHub에 푸시

```bash
git add .
git commit -m "Add Neon database integration"
git push origin main
```

### 2단계: Vercel에 프로젝트 연결

1. https://vercel.com 접속
2. "Import Project" 클릭
3. GitHub 저장소 선택
4. "Import" 클릭

### 3단계: 환경 변수 설정

Vercel 대시보드에서:

1. Settings → Environment Variables 클릭
2. 다음 환경 변수 추가:

**Name:** `DATABASE_URL`
**Value:** Neon에서 복사한 Connection String

```
postgresql://neondb_owner:npg_BSq4aKCFgo8v@ep-flat-mode-ahj1jtml-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Name:** `NEXT_PUBLIC_KAKAO_API_KEY`
**Value:** `15bb41100fd43f80b4123f5ea31586d7`

3. Save 클릭

### 4단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 완료 대기 (약 2-3분)
3. 배포 완료 후 URL로 접속 테스트

### 5단계: 확인

배포된 URL에서:

- `https://your-app.vercel.app/api/facilities` 접속
- 데이터가 제대로 나오는지 확인

## 🐛 트러블슈팅

### 데이터베이스 연결 오류

- Vercel 환경 변수에 `DATABASE_URL`이 올바르게 설정되었는지 확인
- Neon Connection String에 공백이나 잘못된 문자가 없는지 확인

### 배포 실패

- 배포 로그 확인 (Vercel 대시보드)
- 환경 변수 누락 확인

## 📝 참고사항

- `.env.local` 파일은 Git에 커밋하지 말 것
- Neon 무료 플랜 제한 확인
- Vercel 무료 플랜 제한 확인
