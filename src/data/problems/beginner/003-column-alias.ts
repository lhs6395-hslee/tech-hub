import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-003',
  level: 'beginner',
  order: 3,
  title: {
    ko: '컬럼 별칭 사용하기',
    en: 'Using Column Aliases',
  },
  description: {
    ko: '`customers` 테이블에서 고객의 이름과 이메일을 조회하되, 컬럼 이름을 **별칭(alias)**으로 변경하세요.\n\n- `name` 컬럼을 `customer_name`으로 표시\n- `email` 컬럼을 `customer_email`로 표시\n\n### 테이블 구조\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 고객 ID |\n| name | VARCHAR | 고객 이름 |\n| email | VARCHAR | 이메일 |\n| city | VARCHAR | 도시 |\n| country | VARCHAR | 국가 |\n| signup_date | DATE | 가입일 |\n| is_premium | BOOLEAN | 프리미엄 여부 |',
    en: 'Select the name and email from the `customers` table, but rename the columns using **aliases**.\n\n- Display the `name` column as `customer_name`\n- Display the `email` column as `customer_email`\n\n### Table Schema\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Customer ID |\n| name | VARCHAR | Customer name |\n| email | VARCHAR | Email |\n| city | VARCHAR | City |\n| country | VARCHAR | Country |\n| signup_date | DATE | Sign-up date |\n| is_premium | BOOLEAN | Premium status |',
  },
  schema: 'ecommerce',
  category: 'SELECT',
  difficulty: 1,
  hints: {
    ko: [
      '컬럼 이름 뒤에 AS 키워드를 사용하면 별칭을 지정할 수 있습니다.',
      'AS 키워드는 생략할 수도 있지만, 가독성을 위해 사용하는 것이 좋습니다.',
      'SELECT name AS customer_name, email AS customer_email FROM customers;',
    ],
    en: [
      'Use the AS keyword after a column name to assign an alias.',
      'The AS keyword is optional but recommended for readability.',
      'SELECT name AS customer_name, email AS customer_email FROM customers;',
    ],
  },
  explanation: {
    ko: '## 컬럼 별칭 (Column Alias)\n\n`AS` 키워드를 사용하면 결과에 표시되는 컬럼 이름을 변경할 수 있습니다.\n\n```sql\nSELECT name AS customer_name, email AS customer_email\nFROM customers;\n```\n\n### 별칭이 유용한 경우\n\n1. **컬럼 이름을 더 명확하게**: `name` -> `customer_name`\n2. **계산 결과에 이름 부여**: `price * quantity AS total_price`\n3. **테이블 조인 시 구분**: 여러 테이블의 같은 이름 컬럼을 구분\n\n### AS 생략\n\n`AS`는 생략할 수 있습니다:\n```sql\nSELECT name customer_name, email customer_email FROM customers;\n```\n\n> **팁**: 별칭에 공백이 포함된 경우 큰따옴표(`"`)로 감싸야 합니다: `AS "Customer Name"`',
    en: '## Column Aliases\n\nThe `AS` keyword lets you rename columns in the query result.\n\n```sql\nSELECT name AS customer_name, email AS customer_email\nFROM customers;\n```\n\n### When aliases are useful\n\n1. **Clarify column names**: `name` -> `customer_name`\n2. **Name calculated results**: `price * quantity AS total_price`\n3. **Distinguish in joins**: Differentiate same-named columns from multiple tables\n\n### Omitting AS\n\n`AS` is optional:\n```sql\nSELECT name customer_name, email customer_email FROM customers;\n```\n\n> **Tip**: If an alias contains spaces, wrap it in double quotes: `AS "Customer Name"`',
  },
  expectedQuery: {
    postgresql: 'SELECT name AS customer_name, email AS customer_email FROM customers;',
    mysql: 'SELECT name AS customer_name, email AS customer_email FROM customers;',
  },
  gradingMode: 'unordered',
  relatedConcepts: ['SELECT', 'AS', 'column alias'],
};
