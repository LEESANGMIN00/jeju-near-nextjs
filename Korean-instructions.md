# 데이터 복사 방법 (한글)

## 🎯 가장 쉬운 방법

### HeidiSQL에서:

1. 쿼리 실행 (또는 이미 실행됨)
2. 결과 창에서 **우클릭**
3. "복사" 선택
4. "모든 결과 행 복사" 클릭
5. 끝!

### Neon에서:

1. INSERT 문 작성:

```sql
INSERT INTO facilities (name, address, lat, lng, category, phone, operating_hours, is_open_all_year) VALUES
```

2. HeidiSQL에서 복사한 내용 붙여넣기

3. **마지막 줄의 쉼표(,) 제거**

4. 실행!

## 💡 안되면 이렇게:

### CSV로 내보내기:

1. HeidiSQL 결과창에서 **우클릭**
2. "Export grid as" → "CSV" 선택
3. 파일 저장
4. 메모장으로 파일 열기
5. Ctrl+A (전체 선택) → Ctrl+C (복사)

## ⚠️ 주의사항

- 마지막 줄에 쉼표(,) 있으면 제거해야 함
- 깨진 글자는 괜찮음 (데이터는 정상임)
- 2500개 한 번에 복사해도 됨
