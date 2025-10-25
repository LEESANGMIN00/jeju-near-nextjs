# 최종 데이터 마이그레이션 가이드

## ⚠️ 주의사항

- 깨진 문자는 인코딩 문제이지만 데이터는 정상 입력됩니다
- 2500개를 한 번에 복사-붙여넣기 하는 것은 정상입니다

## 📋 단계별 진행 방법

### 1단계: Neon 테이블 재생성

Neon SQL Editor에서 `update-neon-table.sql` 내용 실행

### 2단계: HeidiSQL에서 INSERT 문 생성

HeidiSQL에서 `convert-for-neon.sql` 실행

- 결과를 **전체 복사** (Ctrl+A → Ctrl+C)
- 2500개 행이 모두 선택되어야 합니다

### 3단계: Neon에 붙여넣기

Neon SQL Editor에서:

```sql
INSERT INTO facilities (name, address, lat, lng, category, phone, operating_hours, is_open_all_year) VALUES
```

**바로 아래에** HeidiSQL에서 복사한 2500개 행 붙여넣기

### 4단계: 마지막 행 쉼표 제거

- 붙여넣기 한 데이터의 **마지막 행** 찾기
- 마지막의 `,` 제거
- 예: `),` → `)`

### 5단계: 실행

- Run 버튼 클릭
- 완료!

## ✅ 확인

```sql
SELECT COUNT(*) FROM facilities;
-- 2500개 나와야 함
```

## 💡 팁

- 에러 나면 에러 메시지 확인
- 마지막 쉼표(`,`) 빼먹지 말기
- NULL 값은 그대로 두기
