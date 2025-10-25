-- 이 쿼리를 Neon SQL Editor에 붙여넣으세요
-- 먼저 description 컬럼 제거 (한 번만 실행)
ALTER TABLE facilities DROP COLUMN IF EXISTS description;

-- 그 다음 HeidiSQL에서 복사한 데이터를 VALUES 뒤에 붙여넣으세요
-- 예시:
INSERT INTO facilities (name, category, lat, lng, address, phone) VALUES
('시설명1', '카테고리', 33.4996, 126.5312, '주소1', '전화1'),
('시설명2', '카테고리', 33.2541, 126.5601, '주소2', '전화2');

-- 실제로는 HeidiSQL에서 복사한 2,451개 행을 여기에 붙여넣으세요
-- 마지막 행의 쉼표(,)는 제거하세요!
