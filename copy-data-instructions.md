# HeidiSQL에서 데이터 복사하는 방법

## 방법 1: HeidiSQL에서 직접 복사

1. HeidiSQL에서 쿼리 실행 후 결과 창 클릭
2. **첫 번째 행** 클릭
3. **Shift 누른 채로 마지막 행**까지 스크롤 후 클릭
4. Ctrl+C (복사)

## 방법 2: CSV로 내보내기

1. HeidiSQL에서 쿼리 실행
2. 우클릭 → "Export grid as" → "CSV"
3. CSV 파일 저장
4. 메모장으로 열기
5. 전체 선택 (Ctrl+A) → 복사 (Ctrl+C)

## 방법 3: 수동으로 복사

아래 쿼리를 실행해서 파일로 저장:

```sql
SELECT
    CONCAT(
        '( ',
        '''', name, ''', ',
        '''', IFNULL(address, ''), ''', ',
        lat, ', ',
        lng, ', ',
        '''', category, ''', ',
        IFNULL(CONCAT('''', phone, ''''), 'NULL'), ', ',
        IFNULL(CONCAT('''', operating_hours, ''''), 'NULL'), ', ',
        IFNULL(CONCAT('''', is_open_all_year, ''''), 'NULL'),
        ' ),'
    ) as insert_query
FROM facilities
ORDER BY id;
```

그리고 HeidiSQL에서:

- 결과창에서 우클릭
- "Copy" → "Copy all result rows"
- 또는 Ctrl+Shift+C

## 방법 4: 파일로 저장

1. HeidiSQL에서 쿼리 실행
2. 결과창 우클릭
3. "Export grid as" → "SQL INSERT"
4. 파일 저장
5. 저장된 파일 내용 복사

## 빠른 방법 (추천)

**HeidiSQL에서:**

1. 쿼리 실행 후
2. 결과 창 아무 곳이나 우클릭
3. "Copy" → "Copy all result rows" 선택
4. Ctrl+V로 Neon에 붙여넣기
