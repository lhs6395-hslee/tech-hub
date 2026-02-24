import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-002',
  level: 'beginner',
  order: 2,
  title: {
    ko: '특정 컬럼 조회하기',
    en: 'Select Specific Columns',
  },
  description: {
    ko: '`customers` 테이블에서 고객의 **이름(name)**과 **이메일(email)**만 조회하세요.\n\n모든 컬럼을 가져오는 `SELECT *` 대신, 필요한 컬럼만 지정하여 효율적으로 데이터를 조회하는 방법을 배워봅시다.\n\n### 테이블 구조\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 고객 ID |\n| name | VARCHAR | 고객 이름 |\n| email | VARCHAR | 이메일 |\n| city | VARCHAR | 도시 |\n| country | VARCHAR | 국가 |\n| signup_date | DATE | 가입일 |\n| is_premium | BOOLEAN | 프리미엄 여부 |',
    en: 'Select only the **name** and **email** columns from the `customers` table.\n\nInstead of fetching all columns with `SELECT *`, learn how to specify only the columns you need for more efficient queries.\n\n### Table Schema\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Customer ID |\n| name | VARCHAR | Customer name |\n| email | VARCHAR | Email |\n| city | VARCHAR | City |\n| country | VARCHAR | Country |\n| signup_date | DATE | Sign-up date |\n| is_premium | BOOLEAN | Premium status |',
  },
  schema: 'ecommerce',
  category: 'SELECT',
  difficulty: 1,
  hints: {
    ko: [
      'SELECT 뒤에 조회할 컬럼 이름을 쉼표로 구분하여 나열합니다.',
      '이번 문제에서는 name과 email 두 개의 컬럼을 선택해야 합니다.',
      'SELECT name, email FROM customers;',
    ],
    en: [
      'List the column names you want to retrieve after SELECT, separated by commas.',
      'In this problem, you need to select two columns: name and email.',
      'SELECT name, email FROM customers;',
    ],
  },
  explanation: {
    ko: '## 특정 컬럼 선택하기\n\n`SELECT` 문에서 `*` 대신 컬럼 이름을 직접 지정하면, 필요한 데이터만 조회할 수 있습니다.\n\n```sql\nSELECT name, email FROM customers;\n```\n\n### 왜 컬럼을 지정해야 할까요?\n\n1. **성능 향상**: 필요한 데이터만 가져오므로 네트워크 부하가 줄어듭니다\n2. **가독성**: 어떤 데이터를 사용하는지 명확합니다\n3. **유지보수**: 테이블 구조가 변경되어도 쿼리가 안정적입니다\n\n> **팁**: 여러 컬럼을 선택할 때는 쉼표(`,`)로 구분합니다.',
    en: '## Selecting Specific Columns\n\nInstead of using `*`, you can specify column names in the `SELECT` statement to retrieve only the data you need.\n\n```sql\nSELECT name, email FROM customers;\n```\n\n### Why specify columns?\n\n1. **Performance**: Reduces network overhead by fetching only needed data\n2. **Readability**: Makes it clear what data is being used\n3. **Maintainability**: Queries remain stable even if the table structure changes\n\n> **Tip**: Separate multiple column names with commas (`,`).',
  },
  expectedQuery: {
    postgresql: 'SELECT name, email FROM customers;',
    mysql: 'SELECT name, email FROM customers;',
  },
  gradingMode: 'unordered',
  relatedConcepts: ['SELECT', 'FROM', 'column selection'],
};
