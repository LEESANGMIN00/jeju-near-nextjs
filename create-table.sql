-- Neon PostgreSQL용 테이블 생성
-- 이 명령어를 Neon 콘솔의 SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    category VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    operating_hours TEXT,
    is_open_all_year VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities(lat, lng);

-- 테이블 생성 확인
SELECT 'Table created successfully' as status;

