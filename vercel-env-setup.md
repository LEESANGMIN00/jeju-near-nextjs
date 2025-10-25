# Vercel 환경 변수 설정

## 🔴 현재 문제

- API 500 에러
- Neon DB 연결 실패

## ✅ 해결 방법

### 1. Vercel 환경 변수 추가

1. Vercel 대시보드 접속: https://vercel.com
2. 프로젝트 선택
3. Settings → Environment Variables 클릭
4. 다음 환경 변수 추가:

**Name:** `DATABASE_URL`
**Value:**

```
postgresql://neondb_owner:npg_BSq4aKCFgo8v@ep-flat-mode-ahj1jtml-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Name:** `NEXT_PUBLIC_KAKAO_API_KEY`
**Value:**

```
15bb41100fd43f80b4123f5ea31586d7
```

### 2. 재배포

1. Deployments 탭 클릭
2. 최근 배포 옆 ... 메뉴 클릭
3. Redeploy 클릭

### 3. 확인

배포 완료 후:

- `https://your-app.vercel.app/api/facilities` 접속
- 데이터가 나오는지 확인

## 📝 주의사항

- 환경 변수 추가 후 반드시 재배포 필요
- DATABASE_URL에 공백 없이 입력
- Neon Connection String 정확히 복사
