# Neon 데이터베이스 마이그레이션 가이드

## ✅ 완료된 작업

- ✅ Neon 데이터베이스 연결 설정
- ✅ 테이블 생성 완료
- ✅ 샘플 데이터 16개 테스트 완료

## 📋 Cafe24 MySQL 데이터를 Neon으로 옮기는 방법

### 1단계: Cafe24 MySQL에서 데이터 추출

**HeidiSQL에서 실행:**

```sql
SELECT
    CONCAT(
        '(',
        '''', name, ''', ',
        '''', category, ''', ',
        lat, ', ',
        lng, ', ',
        IFNULL(CONCAT('''', address, ''''), 'NULL'), ', ',
        IFNULL(CONCAT('''', phone, ''''), 'NULL'), ', ',
        IFNULL(CONCAT('''', description, ''''), 'NULL'),
        '),'
    ) as insert_query
FROM facilities
ORDER BY id;
```

**또는 CSV로 추출:**

```sql
SELECT name, category, lat, lng, address, phone, description
FROM facilities
ORDER BY id;
```

### 2단계: Neon SQL Editor에서 데이터 삽입

1. https://neon.tech 접속
2. 프로젝트 선택
3. 좌측 메뉴의 "SQL Editor" 클릭
4. 아래 쿼리 실행:

```sql
INSERT INTO facilities (name, category, lat, lng, address, phone, description) VALUES
-- 여기에 1단계에서 추출한 데이터 붙여넣기
('데이터1', '카테고리', 33.4996, 126.5312, '주소', '전화', '설명'),
('데이터2', '카테고리', 33.2541, 126.5601, '주소', '전화', '설명');
```

### 3단계: 데이터 확인

```sql
-- 전체 개수 확인
SELECT COUNT(*) FROM facilities;

-- 카테고리별 개수 확인
SELECT category, COUNT(*) FROM facilities GROUP BY category;

-- 최근 데이터 확인
SELECT * FROM facilities ORDER BY id DESC LIMIT 10;
```

## 🔧 환경 변수 설정

`.env.local` 파일에 다음이 설정되어 있어야 합니다:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_xxxx@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

## 📝 참고사항

- 빈 값(NULL)은 `NULL`로 입력 (문자열 아님)
- 문자열에는 작은따옴표(`'`) 사용
- 마지막 행 뒤에는 쉼표(`,`) 없어야 함
- 데이터가 많으면 여러 번에 나눠서 INSERT 가능

## 🚀 Vercel 배포 시

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `DATABASE_URL` 추가 (Neon Connection String)
3. 배포
