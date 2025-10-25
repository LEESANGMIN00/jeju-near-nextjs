DROP TABLE IF EXISTS facilities;

CREATE TABLE facilities (
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

CREATE INDEX idx_facilities_category ON facilities(category);
CREATE INDEX idx_facilities_location ON facilities(lat, lng);