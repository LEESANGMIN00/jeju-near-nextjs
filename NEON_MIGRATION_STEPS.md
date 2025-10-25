# Neon 데이터 마이그레이션 단계별 가이드

## ✅ 현재 상황

- Cafe24 MySQL에 2,451개의 데이터 확인
- INSERT 문 자동 생성 완료

## 📋 다음 단계

### 1단계: Neon 테이블에서 description 컬럼 제거

**Neon SQL Editor에서 실행:**

```sql
ALTER TABLE facilities DROP COLUMN IF EXISTS description;
```

### 2단계: Cafe24에서 생성된 INSERT 문 복사

HeidiSQL에서 결과를 **전체 복사** (Ctrl+A → Ctrl+C)

- 총 2,451개의 행
- 마지막 행의 쉼표(`,`) 제거 필요

### 3단계: Neon에 데이터 삽입

**Neon SQL Editor에서 실행:**

```sql
INSERT INTO facilities (name, category, lat, lng, address, phone) VALUES
-- 여기에 HeidiSQL에서 복사한 데이터 붙여넣기
-- 마지막 행의 쉼표(,)를 제거해야 합니다
```

### 4단계: 데이터 확인

```sql
-- 전체 개수 확인
SELECT COUNT(*) FROM facilities;

-- 카테고리별 개수 확인
SELECT category, COUNT(*) FROM facilities GROUP BY category;

-- 최근 데이터 확인
SELECT * FROM facilities ORDER BY id DESC LIMIT 10;
```

## ⚠️ 주의사항

- 데이터가 많으니 한 번에 INSERT 시도
- 에러 발생 시 메시지 확인
- 마지막 행 뒤의 쉼표(`,`) 반드시 제거
- NULL 값은 `NULL`로 표시 (따옴표 없이)
