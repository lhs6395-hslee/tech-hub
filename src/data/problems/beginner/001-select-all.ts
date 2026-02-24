import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-001',
  level: 'beginner',
  order: 1,
  title: {
    ko: '모든 고객 조회하기',
    en: 'Select All Customers',
  },
  description: {
    ko: '`customers` 테이블에서 **모든 고객의 정보**를 조회하세요.\n\n### 테이블 구조\n| 컬럼 | 타입 | 설명 |\n|------|------|------|\n| id | INTEGER | 고객 ID |\n| name | VARCHAR | 고객 이름 |\n| email | VARCHAR | 이메일 |\n| city | VARCHAR | 도시 |\n| country | VARCHAR | 국가 |\n| signup_date | DATE | 가입일 |\n| is_premium | BOOLEAN | 프리미엄 여부 |',
    en: 'Select **all customer information** from the `customers` table.\n\n### Table Schema\n| Column | Type | Description |\n|--------|------|-------------|\n| id | INTEGER | Customer ID |\n| name | VARCHAR | Customer name |\n| email | VARCHAR | Email |\n| city | VARCHAR | City |\n| country | VARCHAR | Country |\n| signup_date | DATE | Sign-up date |\n| is_premium | BOOLEAN | Premium status |',
  },
  schema: 'ecommerce',
  category: 'SELECT',
  difficulty: 1,
  hints: {
    ko: [
      '모든 데이터를 조회하려면 SELECT 문을 사용합니다.',
      '모든 컬럼을 선택하려면 * (별표)를 사용할 수 있습니다.',
      'SELECT * FROM 테이블이름;',
    ],
    en: [
      'Use the SELECT statement to retrieve data.',
      'Use * (asterisk) to select all columns.',
      'SELECT * FROM table_name;',
    ],
  },
  explanation: {
    ko: '## SELECT 문 기초\n\n`SELECT`는 SQL에서 가장 기본적인 명령어로, 데이터베이스에서 데이터를 조회할 때 사용합니다.\n\n```sql\nSELECT * FROM customers;\n```\n\n- `SELECT`: 조회할 컬럼을 지정\n- `*`: 모든 컬럼을 의미\n- `FROM`: 어떤 테이블에서 가져올지 지정\n\n> **팁**: 실무에서는 `SELECT *` 대신 필요한 컬럼만 명시하는 것이 성능과 가독성에 좋습니다.',
    en: '## SELECT Basics\n\n`SELECT` is the most fundamental SQL command used to retrieve data from a database.\n\n```sql\nSELECT * FROM customers;\n```\n\n- `SELECT`: Specifies which columns to retrieve\n- `*`: Means all columns\n- `FROM`: Specifies which table to query\n\n> **Tip**: In practice, it\'s better to specify only the columns you need instead of using `SELECT *`.',
  },
  expectedQuery: {
    postgresql: 'SELECT * FROM customers;',
    mysql: 'SELECT * FROM customers;',
  },
  gradingMode: 'unordered',
  relatedConcepts: ['SELECT', 'FROM', 'asterisk'],
};
