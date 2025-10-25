-- Neon PostgreSQL용 샘플 데이터
-- 이 명령어들을 Neon 콘솔의 SQL Editor에서 실행하세요

-- 테이블 생성 (이미 생성했다면 건너뛰기)
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities(lat, lng);

-- 샘플 데이터 삽입
INSERT INTO facilities (name, category, lat, lng, address, phone, description) VALUES
('제주대형마트', '마트', 33.4996, 126.5312, '제주특별자치도 제주시 연동', '064-123-4567', '제주시 대형마트'),
('서귀포마트', '마트', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', '064-765-4321', '서귀포시 대형마트'),
('제주공항화장실', '화장실', 33.5127, 126.4926, '제주특별자치도 제주시 공항로', NULL, '제주공항 내 화장실'),
('서귀포시청화장실', '화장실', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', NULL, '서귀포시청 내 화장실'),
('SK주유소 제주점', '주유소', 33.4996, 126.5312, '제주특별자치도 제주시 연동', '064-111-2222', 'SK 주유소'),
('GS칼텍스 서귀포점', '주유소', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', '064-333-4444', 'GS칼텍스 주유소'),
('테슬라충전소 제주', '충전소', 33.4996, 126.5312, '제주특별자치도 제주시 연동', NULL, '테슬라 전기차 충전소'),
('제주전기차충전소', '충전소', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', NULL, '일반 전기차 충전소'),
('제주클린하우스', '클린하우스', 33.4996, 126.5312, '제주특별자치도 제주시 연동', '064-555-6666', '세탁소 및 클리닝 서비스'),
('서귀포클린하우스', '클린하우스', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', '064-777-8888', '세탁소 및 클리닝 서비스'),
('국민은행 제주지점', '은행', 33.4996, 126.5312, '제주특별자치도 제주시 연동', '064-999-0000', '국민은행 제주지점'),
('신한은행 서귀포지점', '은행', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', '064-111-2222', '신한은행 서귀포지점'),
('CU 제주점', '편의점', 33.4996, 126.5312, '제주특별자치도 제주시 연동', NULL, 'CU 편의점'),
('GS25 서귀포점', '편의점', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', NULL, 'GS25 편의점'),
('제주동문시장', '시장', 33.5127, 126.5275, '제주특별자치도 제주시 관덕로', '064-333-4444', '제주동문시장'),
('서귀포매일올레시장', '시장', 33.2541, 126.5601, '제주특별자치도 서귀포시 중앙로', '064-555-6666', '서귀포매일올레시장');

-- 데이터 확인
SELECT category, COUNT(*) as count FROM facilities GROUP BY category ORDER BY category;

