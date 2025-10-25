-- HeidiSQL에서 실행할 쿼리들
-- 이 쿼리들을 HeidiSQL에서 실행하고 결과를 복사하세요

-- 1. 테이블 구조 확인
DESCRIBE facilities;

-- 2. 전체 데이터 조회 (CSV 형태로 복사하기 좋게)
SELECT 
    CONCAT('''', name, '''') as name,
    CONCAT('''', category, '''') as category,
    lat,
    lng,
    CONCAT('''', IFNULL(address, ''), '''') as address,
    CONCAT('''', IFNULL(phone, ''), '''') as phone,
    CONCAT('''', IFNULL(description, ''), '''') as description
FROM facilities 
ORDER BY id;

-- 3. 카테고리별 데이터 개수 확인
SELECT category, COUNT(*) as count 
FROM facilities 
GROUP BY category 
ORDER BY category;

-- 4. 샘플 데이터 확인 (처음 10개)
SELECT * FROM facilities LIMIT 10;

