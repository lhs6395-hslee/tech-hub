import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-005',
  level: 'beginner',
  order: 5,
  title: {
    ko: 'AND/OR 조건 사용하기',
    en: 'Using AND/OR Conditions',
  },
  description: {
    ko: '`customers` 테이블에서 **한국(South Korea)**에 거주하면서 **프리미엄 회원**인 고객의 모든 정보를 조회하세요.\n\n여러 조건을 동시에 만족하는 데이터를 조회하려면 `AND` 연산자를 사용합니다.\n\n### 테이블 구조\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 고객 ID |\n| name | VARCHAR | 고객 이름 |\n| email | VARCHAR | 이메일 |\n| city | VARCHAR | 도시 |\n| country | VARCHAR | 국가 |\n| signup_date | DATE | 가입일 |\n| is_premium | BOOLEAN | 프리미엄 여부 |\n\n### 조건\n- `country`가 `\'South Korea\'`이어야 합니다\n- `is_premium`이 `true`이어야 합니다\n- 두 조건을 **모두** 만족해야 합니다',
    en: 'Select all information of customers who live in **South Korea** AND are **premium members** from the `customers` table.\n\nUse the `AND` operator to filter data that satisfies multiple conditions simultaneously.\n\n### Table Schema\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Customer ID |\n| name | VARCHAR | Customer name |\n| email | VARCHAR | Email |\n| city | VARCHAR | City |\n| country | VARCHAR | Country |\n| signup_date | DATE | Sign-up date |\n| is_premium | BOOLEAN | Premium status |\n\n### Conditions\n- `country` must be `\'South Korea\'`\n- `is_premium` must be `true`\n- **Both** conditions must be satisfied',
  },
  schema: 'ecommerce',
  category: 'WHERE',
  difficulty: 2,
  hints: {
    ko: [
      '두 개 이상의 조건을 모두 만족시키려면 AND 연산자를 사용합니다.',
      'BOOLEAN 컬럼은 = true 또는 = false로 비교할 수 있습니다.',
      "SELECT * FROM customers WHERE country = 'South Korea' AND is_premium = true;",
    ],
    en: [
      'Use the AND operator to combine multiple conditions that must all be true.',
      'BOOLEAN columns can be compared with = true or = false.',
      "SELECT * FROM customers WHERE country = 'South Korea' AND is_premium = true;",
    ],
  },
  explanation: {
    ko: '## AND와 OR 연산자\n\n### AND 연산자\n\n`AND`는 **모든 조건이 참**일 때만 행을 반환합니다.\n\n```sql\nSELECT * FROM customers\nWHERE country = \'South Korea\' AND is_premium = true;\n```\n\n### OR 연산자\n\n`OR`는 **하나 이상의 조건이 참**이면 행을 반환합니다.\n\n```sql\nSELECT * FROM customers\nWHERE city = \'Seoul\' OR city = \'Busan\';\n```\n\n### AND와 OR 함께 사용하기\n\n괄호를 사용하여 조건의 우선순위를 명확히 할 수 있습니다:\n\n```sql\nSELECT * FROM customers\nWHERE country = \'South Korea\'\n  AND (city = \'Seoul\' OR city = \'Busan\');\n```\n\n> **주의**: `AND`는 `OR`보다 우선순위가 높습니다. 의도한 대로 동작하려면 괄호를 사용하세요.',
    en: '## AND and OR Operators\n\n### AND Operator\n\n`AND` returns rows only when **all conditions are true**.\n\n```sql\nSELECT * FROM customers\nWHERE country = \'South Korea\' AND is_premium = true;\n```\n\n### OR Operator\n\n`OR` returns rows when **at least one condition is true**.\n\n```sql\nSELECT * FROM customers\nWHERE city = \'Seoul\' OR city = \'Busan\';\n```\n\n### Combining AND and OR\n\nUse parentheses to clarify the order of evaluation:\n\n```sql\nSELECT * FROM customers\nWHERE country = \'South Korea\'\n  AND (city = \'Seoul\' OR city = \'Busan\');\n```\n\n> **Note**: `AND` has higher precedence than `OR`. Use parentheses to ensure the intended behavior.',
  },
  expectedQuery: {
    postgresql: "SELECT * FROM customers WHERE country = 'South Korea' AND is_premium = true;",
    mysql: "SELECT * FROM customers WHERE country = 'South Korea' AND is_premium = true;",
  },
  gradingMode: 'unordered',
  relatedConcepts: ['WHERE', 'AND', 'OR', 'boolean'],
};
