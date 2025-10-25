# Vercel 로그 확인 방법

## 🔍 Vercel 로그에서 에러 확인

1. Vercel 대시보드 → 프로젝트 클릭
2. **Deployments** 탭
3. 최신 배포 클릭
4. **Functions** 탭 클릭
5. 빨간색 에러 로그 확인

## 🐛 에러 내용을 알려주세요!

로그에서 보이는 에러 메시지를 알려주시면:

- "connection refused" → Neon 연결 실패
- "relation 'facilities' does not exist" → 테이블 없음
- 기타 메시지 → 그것에 맞춰 해결

## 📝 빠른 확인

`https://your-app.vercel.app/api/facilities?lat=33.5&lng=126.5&radius=5&category=all`
이 URL 접속해서 에러 메시지 확인!
