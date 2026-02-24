import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-010',
  level: 'beginner',
  order: 10,
  title: {
    ko: '집계 함수 사용하기',
    en: 'Using Aggregate Functions',
  },
  description: {
    ko: '`products` 테이블에서 **카테고리별 상품 수**를 조회하세요.\n\n`GROUP BY`와 집계 함수를 사용하면 데이터를 그룹화하여 요약 통계를 구할 수 있습니다. 상품 수가 많은 카테고리부터 내림차순으로 정렬하세요.\n\n### 테이블 구조 - products\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 상품 ID |\n| name | VARCHAR | 상품 이름 |\n| category_id | INTEGER | 카테고리 ID |\n| price | DECIMAL | 가격 |\n| stock_quantity | INTEGER | 재고 수량 |\n| created_at | TIMESTAMP | 등록일시 |\n\n### 기대 결과 형식\n| category_id | product_count |\n|-------------|---------------|\n| 1 | 15 |\n| 3 | 12 |\n| 2 | 8 |',
    en: 'Count the **number of products in each category** from the `products` table.\n\nUsing `GROUP BY` with aggregate functions allows you to group data and compute summary statistics. Sort the results by product count in descending order.\n\n### Table Schema - products\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Product ID |\n| name | VARCHAR | Product name |\n| category_id | INTEGER | Category ID |\n| price | DECIMAL | Price |\n| stock_quantity | INTEGER | Stock quantity |\n| created_at | TIMESTAMP | Created date |\n\n### Expected Result Format\n| category_id | product_count |\n|-------------|---------------|\n| 1 | 15 |\n| 3 | 12 |\n| 2 | 8 |',
  },
  schema: 'ecommerce',
  category: 'GROUP BY',
  difficulty: 2,
  hints: {
    ko: [
      'COUNT(*) 함수를 사용하면 행의 개수를 셀 수 있습니다.',
      'GROUP BY를 사용하면 특정 컬럼의 값별로 데이터를 그룹화할 수 있습니다.',
      'SELECT category_id, COUNT(*) AS product_count FROM products GROUP BY category_id ORDER BY product_count DESC;',
    ],
    en: [
      'The COUNT(*) function counts the number of rows.',
      'GROUP BY groups data by the values of a specified column.',
      'SELECT category_id, COUNT(*) AS product_count FROM products GROUP BY category_id ORDER BY product_count DESC;',
    ],
  },
  explanation: {
    ko: '## GROUP BY와 집계 함수\n\n`GROUP BY`는 지정한 컬럼의 값을 기준으로 행들을 그룹화하고, 집계 함수를 사용하여 각 그룹의 요약 정보를 구합니다.\n\n```sql\nSELECT category_id, COUNT(*) AS product_count\nFROM products\nGROUP BY category_id\nORDER BY product_count DESC;\n```\n\n### 주요 집계 함수\n\n| 함수 | 설명 | 예시 |\n|------|------|------|\n| `COUNT(*)` | 행의 수 | `COUNT(*)` |\n| `COUNT(column)` | NULL이 아닌 값의 수 | `COUNT(email)` |\n| `SUM(column)` | 합계 | `SUM(price)` |\n| `AVG(column)` | 평균 | `AVG(price)` |\n| `MAX(column)` | 최대값 | `MAX(price)` |\n| `MIN(column)` | 최소값 | `MIN(price)` |\n\n### GROUP BY 동작 원리\n\n```\n원본 데이터:          GROUP BY category_id 후:\n| category_id |       | category_id | COUNT(*) |\n|-------------|       |-------------|----------|\n| 1           |  -->  | 1           | 3        |\n| 2           |       | 2           | 2        |\n| 1           |\n| 1           |\n| 2           |\n```\n\n### SQL 실행 순서\n\n1. `FROM` - 테이블 지정\n2. `WHERE` - 행 필터링\n3. **`GROUP BY`** - 그룹화\n4. `HAVING` - 그룹 필터링\n5. `SELECT` - 컬럼 선택 및 집계\n6. `ORDER BY` - 정렬\n\n> **주의**: `GROUP BY`를 사용할 때 `SELECT`에는 그룹화 기준 컬럼이나 집계 함수만 사용할 수 있습니다.',
    en: '## GROUP BY and Aggregate Functions\n\n`GROUP BY` groups rows by the values of specified columns, and aggregate functions compute summary information for each group.\n\n```sql\nSELECT category_id, COUNT(*) AS product_count\nFROM products\nGROUP BY category_id\nORDER BY product_count DESC;\n```\n\n### Common Aggregate Functions\n\n| Function | Description | Example |\n|----------|-------------|--------|\n| `COUNT(*)` | Number of rows | `COUNT(*)` |\n| `COUNT(column)` | Count of non-NULL values | `COUNT(email)` |\n| `SUM(column)` | Sum of values | `SUM(price)` |\n| `AVG(column)` | Average value | `AVG(price)` |\n| `MAX(column)` | Maximum value | `MAX(price)` |\n| `MIN(column)` | Minimum value | `MIN(price)` |\n\n### How GROUP BY Works\n\n```\nOriginal data:          After GROUP BY category_id:\n| category_id |         | category_id | COUNT(*) |\n|-------------|         |-------------|----------|\n| 1           |   -->   | 1           | 3        |\n| 2           |         | 2           | 2        |\n| 1           |\n| 1           |\n| 2           |\n```\n\n### SQL Execution Order\n\n1. `FROM` - Specify table\n2. `WHERE` - Filter rows\n3. **`GROUP BY`** - Group rows\n4. `HAVING` - Filter groups\n5. `SELECT` - Choose columns and aggregate\n6. `ORDER BY` - Sort results\n\n> **Important**: When using `GROUP BY`, the `SELECT` clause can only include grouped columns or aggregate functions.',
  },
  expectedQuery: {
    postgresql: 'SELECT category_id, COUNT(*) AS product_count FROM products GROUP BY category_id ORDER BY product_count DESC;',
    mysql: 'SELECT category_id, COUNT(*) AS product_count FROM products GROUP BY category_id ORDER BY product_count DESC;',
  },
  gradingMode: 'exact',
  relatedConcepts: ['GROUP BY', 'COUNT', 'aggregate functions', 'AS'],
};
