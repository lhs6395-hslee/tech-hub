import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-007',
  level: 'beginner',
  order: 7,
  title: {
    ko: 'LIKE 패턴 검색',
    en: 'Pattern Matching with LIKE',
  },
  description: {
    ko: '`products` 테이블에서 상품 이름이 **\'Galaxy\'로 시작하는** 모든 상품을 조회하세요.\n\n`LIKE` 연산자와 와일드카드(`%`, `_`)를 사용하면 문자열 패턴을 기반으로 데이터를 검색할 수 있습니다.\n\n### 테이블 구조 - products\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 상품 ID |\n| name | VARCHAR | 상품 이름 |\n| category_id | INTEGER | 카테고리 ID |\n| price | DECIMAL | 가격 |\n| stock_quantity | INTEGER | 재고 수량 |\n| created_at | TIMESTAMP | 등록일시 |\n\n### 예시 데이터\n| id | name | price |\n|----|------|-------|\n| 1 | Galaxy S24 | 1200000 |\n| 2 | iPhone 15 | 1350000 |\n| 3 | Galaxy Book | 1800000 |',
    en: 'Select all products from the `products` table whose name **starts with \'Galaxy\'**.\n\nThe `LIKE` operator with wildcards (`%`, `_`) allows you to search for patterns within string data.\n\n### Table Schema - products\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Product ID |\n| name | VARCHAR | Product name |\n| category_id | INTEGER | Category ID |\n| price | DECIMAL | Price |\n| stock_quantity | INTEGER | Stock quantity |\n| created_at | TIMESTAMP | Created date |\n\n### Sample Data\n| id | name | price |\n|----|------|-------|\n| 1 | Galaxy S24 | 1200000 |\n| 2 | iPhone 15 | 1350000 |\n| 3 | Galaxy Book | 1800000 |',
  },
  schema: 'ecommerce',
  category: 'WHERE',
  difficulty: 2,
  hints: {
    ko: [
      'LIKE 연산자와 % 와일드카드를 사용하면 패턴 검색이 가능합니다.',
      '%는 0개 이상의 임의 문자를 의미합니다. \'Galaxy%\'는 Galaxy로 시작하는 모든 문자열과 매칭됩니다.',
      "SELECT * FROM products WHERE name LIKE 'Galaxy%';",
    ],
    en: [
      'Use the LIKE operator with the % wildcard for pattern matching.',
      '% represents zero or more characters. \'Galaxy%\' matches any string starting with Galaxy.',
      "SELECT * FROM products WHERE name LIKE 'Galaxy%';",
    ],
  },
  explanation: {
    ko: '## LIKE 연산자와 와일드카드\n\n`LIKE`는 문자열 패턴 매칭에 사용됩니다.\n\n```sql\nSELECT * FROM products WHERE name LIKE \'Galaxy%\';\n```\n\n### 와일드카드 종류\n\n| 와일드카드 | 의미 | 예시 | 매칭 결과 |\n|-----------|------|------|----------|\n| `%` | 0개 이상의 임의 문자 | `\'Galaxy%\'` | Galaxy, Galaxy S24, Galaxy Book |\n| `_` | 정확히 1개의 임의 문자 | `\'S_4\'` | S24, S34 (S4는 매칭 안됨) |\n\n### 다양한 패턴 예시\n\n```sql\n-- Galaxy로 시작하는 상품\nWHERE name LIKE \'Galaxy%\'\n\n-- Pro로 끝나는 상품\nWHERE name LIKE \'%Pro\'\n\n-- 이름에 Book이 포함된 상품\nWHERE name LIKE \'%Book%\'\n\n-- 정확히 5글자인 상품\nWHERE name LIKE \'_____\'\n```\n\n### NOT LIKE\n\n`NOT LIKE`를 사용하면 패턴에 매칭되지 않는 행을 조회합니다:\n```sql\nSELECT * FROM products WHERE name NOT LIKE \'Galaxy%\';\n```\n\n> **참고**: `LIKE`는 대소문자를 구분합니다. 대소문자 무관하게 검색하려면 PostgreSQL에서는 `ILIKE`를 사용할 수 있습니다.',
    en: '## LIKE Operator and Wildcards\n\n`LIKE` is used for string pattern matching.\n\n```sql\nSELECT * FROM products WHERE name LIKE \'Galaxy%\';\n```\n\n### Wildcard Types\n\n| Wildcard | Meaning | Example | Matches |\n|----------|---------|---------|--------|\n| `%` | Zero or more characters | `\'Galaxy%\'` | Galaxy, Galaxy S24, Galaxy Book |\n| `_` | Exactly one character | `\'S_4\'` | S24, S34 (not S4) |\n\n### Pattern Examples\n\n```sql\n-- Products starting with Galaxy\nWHERE name LIKE \'Galaxy%\'\n\n-- Products ending with Pro\nWHERE name LIKE \'%Pro\'\n\n-- Products containing Book\nWHERE name LIKE \'%Book%\'\n\n-- Products with exactly 5 characters\nWHERE name LIKE \'_____\'\n```\n\n### NOT LIKE\n\nUse `NOT LIKE` to find rows that do not match the pattern:\n```sql\nSELECT * FROM products WHERE name NOT LIKE \'Galaxy%\';\n```\n\n> **Note**: `LIKE` is case-sensitive. For case-insensitive matching in PostgreSQL, use `ILIKE`.',
  },
  expectedQuery: {
    postgresql: "SELECT * FROM products WHERE name LIKE 'Galaxy%';",
    mysql: "SELECT * FROM products WHERE name LIKE 'Galaxy%';",
  },
  gradingMode: 'unordered',
  relatedConcepts: ['WHERE', 'LIKE', 'wildcard', 'pattern matching'],
};
