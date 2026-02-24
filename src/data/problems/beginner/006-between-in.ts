import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-006',
  level: 'beginner',
  order: 6,
  title: {
    ko: 'BETWEEN과 IN 사용하기',
    en: 'Using BETWEEN and IN',
  },
  description: {
    ko: '`products` 테이블에서 **가격이 100,000원 이상 500,000원 이하**인 상품의 모든 정보를 조회하세요.\n\n범위를 지정하여 필터링할 때는 `BETWEEN` 연산자를 사용하면 편리합니다.\n\n### 테이블 구조 - products\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 상품 ID |\n| name | VARCHAR | 상품 이름 |\n| category_id | INTEGER | 카테고리 ID |\n| price | DECIMAL | 가격 |\n| stock_quantity | INTEGER | 재고 수량 |\n| created_at | TIMESTAMP | 등록일시 |\n\n### 조건\n- `price`가 **100000 이상** AND **500000 이하**',
    en: 'Select all products from the `products` table where the **price is between 100,000 and 500,000** (inclusive).\n\nThe `BETWEEN` operator is a convenient way to filter within a range.\n\n### Table Schema - products\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Product ID |\n| name | VARCHAR | Product name |\n| category_id | INTEGER | Category ID |\n| price | DECIMAL | Price |\n| stock_quantity | INTEGER | Stock quantity |\n| created_at | TIMESTAMP | Created date |\n\n### Conditions\n- `price` must be **>= 100000** AND **<= 500000**',
  },
  schema: 'ecommerce',
  category: 'WHERE',
  difficulty: 2,
  hints: {
    ko: [
      'BETWEEN 연산자는 시작값과 끝값을 포함하는 범위를 지정합니다.',
      'BETWEEN A AND B는 >= A AND <= B와 같은 의미입니다.',
      'SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;',
    ],
    en: [
      'The BETWEEN operator specifies an inclusive range between two values.',
      'BETWEEN A AND B is equivalent to >= A AND <= B.',
      'SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;',
    ],
  },
  explanation: {
    ko: '## BETWEEN 연산자\n\n`BETWEEN`은 값이 특정 범위 안에 있는지 확인합니다. **시작값과 끝값을 모두 포함**합니다.\n\n```sql\nSELECT * FROM products\nWHERE price BETWEEN 100000 AND 500000;\n```\n\n위 쿼리는 아래와 동일합니다:\n```sql\nSELECT * FROM products\nWHERE price >= 100000 AND price <= 500000;\n```\n\n## IN 연산자\n\n`IN`은 값이 목록에 포함되어 있는지 확인합니다:\n\n```sql\nSELECT * FROM customers\nWHERE city IN (\'Seoul\', \'Busan\', \'Incheon\');\n```\n\n이는 아래와 동일합니다:\n```sql\nSELECT * FROM customers\nWHERE city = \'Seoul\' OR city = \'Busan\' OR city = \'Incheon\';\n```\n\n### NOT BETWEEN / NOT IN\n\n`NOT`을 붙이면 반대 조건을 지정할 수 있습니다:\n```sql\n-- 범위 밖의 값\nSELECT * FROM products WHERE price NOT BETWEEN 100000 AND 500000;\n\n-- 목록에 없는 값\nSELECT * FROM customers WHERE city NOT IN (\'Seoul\', \'Busan\');\n```\n\n> **팁**: `BETWEEN`은 날짜 범위 검색에도 자주 사용됩니다.',
    en: '## BETWEEN Operator\n\n`BETWEEN` checks if a value falls within a range. It is **inclusive of both boundary values**.\n\n```sql\nSELECT * FROM products\nWHERE price BETWEEN 100000 AND 500000;\n```\n\nThis is equivalent to:\n```sql\nSELECT * FROM products\nWHERE price >= 100000 AND price <= 500000;\n```\n\n## IN Operator\n\n`IN` checks if a value matches any value in a list:\n\n```sql\nSELECT * FROM customers\nWHERE city IN (\'Seoul\', \'Busan\', \'Incheon\');\n```\n\nThis is equivalent to:\n```sql\nSELECT * FROM customers\nWHERE city = \'Seoul\' OR city = \'Busan\' OR city = \'Incheon\';\n```\n\n### NOT BETWEEN / NOT IN\n\nAdd `NOT` to negate the condition:\n```sql\n-- Values outside the range\nSELECT * FROM products WHERE price NOT BETWEEN 100000 AND 500000;\n\n-- Values not in the list\nSELECT * FROM customers WHERE city NOT IN (\'Seoul\', \'Busan\');\n```\n\n> **Tip**: `BETWEEN` is also commonly used for date range queries.',
  },
  expectedQuery: {
    postgresql: 'SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;',
    mysql: 'SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;',
  },
  gradingMode: 'unordered',
  relatedConcepts: ['WHERE', 'BETWEEN', 'IN', 'NOT'],
};
