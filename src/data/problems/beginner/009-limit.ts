import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-009',
  level: 'beginner',
  order: 9,
  title: {
    ko: '결과 개수 제한하기',
    en: 'Limiting Results',
  },
  description: {
    ko: '`products` 테이블에서 **가장 비싼 상품 5개**를 조회하세요.\n\n`LIMIT` 절을 사용하면 조회되는 결과의 행 수를 제한할 수 있습니다. `ORDER BY`와 함께 사용하면 상위/하위 N개의 데이터를 가져올 수 있습니다.\n\n### 테이블 구조 - products\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 상품 ID |\n| name | VARCHAR | 상품 이름 |\n| category_id | INTEGER | 카테고리 ID |\n| price | DECIMAL | 가격 |\n| stock_quantity | INTEGER | 재고 수량 |\n| created_at | TIMESTAMP | 등록일시 |\n\n### 요구사항\n- 가격이 높은 순으로 정렬합니다\n- 상위 **5개**만 조회합니다',
    en: 'Select the **top 5 most expensive products** from the `products` table.\n\nThe `LIMIT` clause restricts the number of rows returned. Combined with `ORDER BY`, it allows you to retrieve the top or bottom N records.\n\n### Table Schema - products\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Product ID |\n| name | VARCHAR | Product name |\n| category_id | INTEGER | Category ID |\n| price | DECIMAL | Price |\n| stock_quantity | INTEGER | Stock quantity |\n| created_at | TIMESTAMP | Created date |\n\n### Requirements\n- Sort by price in descending order\n- Return only the **top 5** results',
  },
  schema: 'ecommerce',
  category: 'LIMIT',
  difficulty: 1,
  hints: {
    ko: [
      'LIMIT 절은 쿼리의 가장 마지막에 작성합니다.',
      '가장 비싼 상품을 구하려면 ORDER BY price DESC로 먼저 정렬한 후 LIMIT를 적용합니다.',
      'SELECT * FROM products ORDER BY price DESC LIMIT 5;',
    ],
    en: [
      'The LIMIT clause goes at the very end of the query.',
      'To get the most expensive products, first sort with ORDER BY price DESC, then apply LIMIT.',
      'SELECT * FROM products ORDER BY price DESC LIMIT 5;',
    ],
  },
  explanation: {
    ko: '## LIMIT 절\n\n`LIMIT`은 조회 결과의 행 수를 제한합니다.\n\n```sql\nSELECT * FROM products ORDER BY price DESC LIMIT 5;\n```\n\n### ORDER BY + LIMIT 패턴\n\n이 조합은 \"상위 N개\" 조회에 자주 사용됩니다:\n\n```sql\n-- 가장 비싼 상품 5개\nSELECT * FROM products ORDER BY price DESC LIMIT 5;\n\n-- 가장 최근 가입한 고객 10명\nSELECT * FROM customers ORDER BY signup_date DESC LIMIT 10;\n\n-- 가장 저렴한 상품 3개\nSELECT * FROM products ORDER BY price ASC LIMIT 3;\n```\n\n### OFFSET과 함께 사용하기\n\n`OFFSET`을 사용하면 특정 위치부터 조회할 수 있습니다 (페이지네이션):\n\n```sql\n-- 11번째부터 20번째 상품 조회 (2페이지)\nSELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;\n```\n\n### SQL 실행 순서\n\n1. `FROM` - 테이블 지정\n2. `WHERE` - 필터링\n3. `SELECT` - 컬럼 선택\n4. `ORDER BY` - 정렬\n5. **`LIMIT`** - 결과 수 제한\n\n> **참고**: MySQL에서는 `LIMIT`, SQL Server에서는 `TOP`, Oracle에서는 `ROWNUM` 또는 `FETCH FIRST`를 사용합니다.',
    en: '## LIMIT Clause\n\n`LIMIT` restricts the number of rows returned by a query.\n\n```sql\nSELECT * FROM products ORDER BY price DESC LIMIT 5;\n```\n\n### ORDER BY + LIMIT Pattern\n\nThis combination is commonly used for "top N" queries:\n\n```sql\n-- Top 5 most expensive products\nSELECT * FROM products ORDER BY price DESC LIMIT 5;\n\n-- 10 most recently registered customers\nSELECT * FROM customers ORDER BY signup_date DESC LIMIT 10;\n\n-- 3 cheapest products\nSELECT * FROM products ORDER BY price ASC LIMIT 3;\n```\n\n### Using with OFFSET\n\n`OFFSET` lets you skip rows, useful for pagination:\n\n```sql\n-- Get products 11-20 (page 2)\nSELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;\n```\n\n### SQL Execution Order\n\n1. `FROM` - Specify table\n2. `WHERE` - Filter rows\n3. `SELECT` - Choose columns\n4. `ORDER BY` - Sort results\n5. **`LIMIT`** - Restrict row count\n\n> **Note**: MySQL uses `LIMIT`, SQL Server uses `TOP`, and Oracle uses `ROWNUM` or `FETCH FIRST`.',
  },
  expectedQuery: {
    postgresql: 'SELECT * FROM products ORDER BY price DESC LIMIT 5;',
    mysql: 'SELECT * FROM products ORDER BY price DESC LIMIT 5;',
  },
  gradingMode: 'exact',
  relatedConcepts: ['LIMIT', 'OFFSET', 'ORDER BY', 'pagination'],
};
