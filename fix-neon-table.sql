-- Neon SQL Editor에서 실행할 쿼리
-- description 컬럼 제거 (Cafe24에 없는 컬럼)

ALTER TABLE facilities DROP COLUMN IF EXISTS description;

-- 또는 테이블을 다시 만들기 (기존 데이터가 없다면)
-- DROP TABLE IF EXISTS facilities;
-- CREATE TABLE facilities (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     category VARCHAR(50) NOT NULL,
--     lat DECIMAL(10, 8) NOT NULL,
--     lng DECIMAL(11, 8) NOT NULL,
--     address TEXT,
--     phone VARCHAR(20),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_facilities_category ON facilities(category);
-- CREATE INDEX idx_facilities_location ON facilities(lat, lng);

-- 테이블 구조 확인
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'facilities' ORDER BY ordinal_position;
