# 가장 간단한 방법

## 네, INSERT SQL 그대로 넣으면 됩니다!

### Neon SQL Editor에서:

```sql
INSERT INTO facilities (name, address, lat, lng, category, phone, operating_hours, is_open_all_year) VALUES
('시설명1', '주소1', 33.4996, 126.5312, '마트', '010-1234-5678', '09:00~18:00', '평일'),
('시설명2', '주소2', 33.2541, 126.5601, '편의점', '010-2345-6789', '24시간', '연중무휴');
```

### HeidiSQL에서:

아래 쿼리를 실행해서 INSERT 문 생성:

```sql
SELECT
    CONCAT('(''', name, ''', ''', IFNULL(address, ''), ''', ', lat, ', ', lng, ', ''', category, ''', ''', IFNULL(phone, ''), ''', ''', IFNULL(operating_hours, ''), ''', ''', IFNULL(is_open_all_year, ''), '''),')
FROM facilities
ORDER BY id;
```

그리고 **결과를 복사해서** Neon에 붙여넣으세요.

### ⚠️ 주의사항:

- 마지막 줄의 쉼표(`,`) 제거
- 한 번에 1000개씩 나눠서 넣으면 더 안전
