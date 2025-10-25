# Vercel 환경 변수 정리

## 🔴 문제

불필요한 환경 변수들이 너무 많습니다!

## ✅ 삭제할 환경 변수

다음 항목들을 삭제하세요:

- `PORT` ❌
- `DB_HOST` ❌
- `DB_PORT` ❌
- `DB_USER` ❌
- `DB_PASSWORD` ❌
- `DB_NAME` ❌

## ✅ 유지할 환경 변수

### 1. DATABASE_URL

**Name:** `DATABASE_URL`
**Value:**

```
postgresql://neondb_owner:npg_BSq4aKCFgo8v@ep-flat-mode-ahj1jtml-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. NEXT_PUBLIC_KAKAO_API_KEY

**Name:** `NEXT_PUBLIC_KAKAO_API_KEY`
**Value:**

```
15bb41100fd43f80b4123f5ea31586d7
```

## 📝 정리 방법

1. Vercel 대시보드 → Settings → Environment Variables
2. 각 불필요한 환경 변수 옆 쓰레기통 아이콘 클릭
3. 삭제 확인
4. 재배포

## 🎯 결과

최종적으로 **2개만** 남아야 합니다:

- `DATABASE_URL`
- `NEXT_PUBLIC_KAKAO_API_KEY`

이렇게 하면 API 500 에러가 해결될 것입니다!
