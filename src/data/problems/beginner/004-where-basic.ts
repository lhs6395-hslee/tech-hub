import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-004',
  level: 'beginner',
  order: 4,
  title: {
    ko: 'WHERE 조건으로 필터링하기',
    en: 'Filtering with WHERE',
  },
  description: {
    ko: '`customers` 테이블에서 **서울(Seoul)**에 거주하는 고객의 모든 정보를 조회하세요.\n\n`WHERE` 절을 사용하면 특정 조건에 맞는 행(row)만 필터링하여 조회할 수 있습니다.\n\n### 테이블 구조\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 고객 ID |\n| name | VARCHAR | 고객 이름 |\n| email | VARCHAR | 이메일 |\n| city | VARCHAR | 도시 |\n| country | VARCHAR | 국가 |\n| signup_date | DATE | 가입일 |\n| is_premium | BOOLEAN | 프리미엄 여부 |\n\n### 예시 데이터\n| id | name | city | country |\n|----|------|------|---------|\n| 1 | 김민수 | Seoul | South Korea |\n| 2 | John | New York | USA |\n| 3 | 이지은 | Seoul | South Korea |',
    en: 'Select all information of customers who live in **Seoul** from the `customers` table.\n\nThe `WHERE` clause allows you to filter rows that match specific conditions.\n\n### Table Schema\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Customer ID |\n| name | VARCHAR | Customer name |\n| email | VARCHAR | Email |\n| city | VARCHAR | City |\n| country | VARCHAR | Country |\n| signup_date | DATE | Sign-up date |\n| is_premium | BOOLEAN | Premium status |\n\n### Sample Data\n| id | name | city | country |\n|----|------|------|---------|\n| 1 | Kim Minsu | Seoul | South Korea |\n| 2 | John | New York | USA |\n| 3 | Lee Jieun | Seoul | South Korea |',
  },
  schema: 'ecommerce',
  category: 'WHERE',
  difficulty: 1,
  hints: {
    ko: [
      'WHERE 절은 FROM 뒤에 작성합니다.',
      '문자열 값을 비교할 때는 작은따옴표(\')로 감싸야 합니다.',
      "SELECT * FROM customers WHERE city = 'Seoul';",
    ],
    en: [
      'The WHERE clause comes after FROM.',
      'String values must be enclosed in single quotes (\').',
      "SELECT * FROM customers WHERE city = 'Seoul';",
    ],
  },
  explanation: {
    ko: '## WHERE 절 기초\n\n`WHERE` 절은 조회 결과를 특정 조건으로 필터링할 때 사용합니다.\n\n```sql\nSELECT * FROM customers WHERE city = \'Seoul\';\n```\n\n### SQL 실행 순서\n\n1. `FROM customers` - customers 테이블에서\n2. `WHERE city = \'Seoul\'` - city가 Seoul인 행만 필터링\n3. `SELECT *` - 모든 컬럼을 조회\n\n### 비교 연산자\n\n| 연산자 | 의미 | 예시 |\n|--------|------|------|\n| `=` | 같다 | `city = \'Seoul\'` |\n| `!=` 또는 `<>` | 같지 않다 | `city != \'Seoul\'` |\n| `>` | 크다 | `price > 1000` |\n| `<` | 작다 | `price < 1000` |\n| `>=` | 크거나 같다 | `price >= 1000` |\n| `<=` | 작거나 같다 | `price <= 1000` |\n\n> **주의**: 문자열 비교 시 작은따옴표(`\'`)를 사용합니다. 큰따옴표(`"`)는 컬럼/테이블 이름에 사용됩니다.',
    en: '## WHERE Clause Basics\n\nThe `WHERE` clause filters query results based on specified conditions.\n\n```sql\nSELECT * FROM customers WHERE city = \'Seoul\';\n```\n\n### SQL Execution Order\n\n1. `FROM customers` - From the customers table\n2. `WHERE city = \'Seoul\'` - Filter rows where city is Seoul\n3. `SELECT *` - Select all columns\n\n### Comparison Operators\n\n| Operator | Meaning | Example |\n|----------|---------|--------|\n| `=` | Equal to | `city = \'Seoul\'` |\n| `!=` or `<>` | Not equal to | `city != \'Seoul\'` |\n| `>` | Greater than | `price > 1000` |\n| `<` | Less than | `price < 1000` |\n| `>=` | Greater than or equal | `price >= 1000` |\n| `<=` | Less than or equal | `price <= 1000` |\n\n> **Note**: Use single quotes (`\'`) for string values. Double quotes (`"`) are used for column/table names.',
  },
  expectedQuery: {
    postgresql: "SELECT * FROM customers WHERE city = 'Seoul';",
    mysql: "SELECT * FROM customers WHERE city = 'Seoul';",
  },
  gradingMode: 'unordered',
  relatedConcepts: ['SELECT', 'WHERE', 'comparison operators'],
};
