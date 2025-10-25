-- Cafe24 MySQL에서 테이블 구조 확인
-- HeidiSQL에서 이 쿼리를 실행해보세요

DESCRIBE facilities;

-- 또는 

SHOW COLUMNS FROM facilities;

-- 데이터 확인 (처음 5개만)
SELECT * FROM facilities LIMIT 5;
