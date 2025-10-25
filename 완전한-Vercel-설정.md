# 🔧 Vercel 완전 설정 가이드

## ⚠️ 지금 해야 할 일

### 1단계: 기존 환경 변수 모두 삭제

Vercel 대시보드 → Settings → Environment Variables에서:

- 모든 환경 변수 삭제 (쓰레기통 아이콘 클릭)

### 2단계: 환경 변수 추가

**환경 변수 1: DATABASE_URL**

```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_BSq4aKCFgo8v@ep-flat-mode-ahj1jtml-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**환경 변수 2: NEXT_PUBLIC_KAKAO_API_KEY**

```
Name: NEXT_PUBLIC_KAKAO_API_KEY
Value: 15bb41100fd43f80b4123f5ea31586d7
```

### 3단계: Save 클릭

### 4단계: 재배포

1. Deployments 탭
2. 최신 배포의 ... 메뉴
3. Redeploy 클릭

### 5단계: 확인

배포 완료 후:

- https://your-app.vercel.app/api/facilities 접속
- 데이터 확인

## 📋 최종 환경 변수 목록

✅ DATABASE_URL  
✅ NEXT_PUBLIC_KAKAO_API_KEY

**딱 2개만 있어야 합니다!**
