import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-008',
  level: 'beginner',
  order: 8,
  title: {
    ko: '정렬하기',
    en: 'Sorting Results',
  },
  description: {
    ko: '`products` 테이블에서 **모든 상품을 가격이 높은 순서대로** 정렬하여 조회하세요.\n\n`ORDER BY` 절을 사용하면 조회 결과를 특정 컬럼 기준으로 정렬할 수 있습니다.\n\n### 테이블 구조 - products\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 상품 ID |\n| name | VARCHAR | 상품 이름 |\n| category_id | INTEGER | 카테고리 ID |\n| price | DECIMAL | 가격 |\n| stock_quantity | INTEGER | 재고 수량 |\n| created_at | TIMESTAMP | 등록일시 |\n\n### 요구사항\n- 모든 상품 정보를 조회합니다\n- **가격(price) 내림차순**(높은 가격부터)으로 정렬합니다',
    en: 'Select all products from the `products` table, **sorted by price in descending order** (highest price first).\n\nThe `ORDER BY` clause allows you to sort query results by one or more columns.\n\n### Table Schema - products\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Product ID |\n| name | VARCHAR | Product name |\n| category_id | INTEGER | Category ID |\n| price | DECIMAL | Price |\n| stock_quantity | INTEGER | Stock quantity |\n| created_at | TIMESTAMP | Created date |\n\n### Requirements\n- Select all product information\n- Sort by **price in descending order** (highest first)',
  },
  schema: 'ecommerce',
  category: 'ORDER BY',
  difficulty: 1,
  hints: {
    ko: [
      'ORDER BY 절은 쿼리의 마지막 부분에 작성합니다.',
      '내림차순 정렬은 DESC 키워드를 사용합니다. 오름차순은 ASC (기본값)입니다.',
      'SELECT * FROM products ORDER BY price DESC;',
    ],
    en: [
      'The ORDER BY clause goes at the end of the query.',
      'Use DESC for descending order. ASC (ascending) is the default.',
      'SELECT * FROM products ORDER BY price DESC;',
    ],
  },
  explanation: {
    ko: '## ORDER BY 절\n\n`ORDER BY`는 조회 결과를 정렬할 때 사용합니다.\n\n```sql\nSELECT * FROM products ORDER BY price DESC;\n```\n\n### 정렬 방향\n\n| 키워드 | 방향 | 설명 |\n|--------|------|------|\n| `ASC` | 오름차순 | 작은 값부터 큰 값 순 (기본값) |\n| `DESC` | 내림차순 | 큰 값부터 작은 값 순 |\n\n### 여러 컬럼으로 정렬\n\n쉼표로 구분하여 여러 컬럼을 기준으로 정렬할 수 있습니다:\n\n```sql\n-- 카테고리별로 정렬하고, 같은 카테고리 내에서는 가격 내림차순\nSELECT * FROM products\nORDER BY category_id ASC, price DESC;\n```\n\n### SQL 실행 순서에서의 위치\n\n1. `FROM` - 테이블 지정\n2. `WHERE` - 필터링\n3. `SELECT` - 컬럼 선택\n4. **`ORDER BY`** - 정렬\n\n> **팁**: `ORDER BY`가 없으면 데이터베이스가 행의 순서를 보장하지 않습니다. 특정 순서가 필요하다면 반드시 `ORDER BY`를 사용하세요.',
    en: '## ORDER BY Clause\n\n`ORDER BY` is used to sort query results.\n\n```sql\nSELECT * FROM products ORDER BY price DESC;\n```\n\n### Sort Direction\n\n| Keyword | Direction | Description |\n|---------|-----------|------------|\n| `ASC` | Ascending | Smallest to largest (default) |\n| `DESC` | Descending | Largest to smallest |\n\n### Sorting by Multiple Columns\n\nUse commas to sort by multiple columns:\n\n```sql\n-- Sort by category, then by price descending within each category\nSELECT * FROM products\nORDER BY category_id ASC, price DESC;\n```\n\n### Position in SQL Execution Order\n\n1. `FROM` - Specify table\n2. `WHERE` - Filter rows\n3. `SELECT` - Choose columns\n4. **`ORDER BY`** - Sort results\n\n> **Tip**: Without `ORDER BY`, the database does not guarantee row order. Always use `ORDER BY` when you need a specific order.',
  },
  expectedQuery: {
    postgresql: 'SELECT * FROM products ORDER BY price DESC;',
    mysql: 'SELECT * FROM products ORDER BY price DESC;',
  },
  gradingMode: 'exact',
  relatedConcepts: ['ORDER BY', 'ASC', 'DESC', 'sorting'],
};
