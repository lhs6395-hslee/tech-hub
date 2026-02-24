import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-014', level: 'beginner', order: 14,
  title: { ko: 'INSERT: 여러 행 한번에 추가', en: 'INSERT: Add Multiple Rows at Once' },
  description: {
    ko: `\`categories\` 테이블에 **3개의 카테고리**를 한번에 추가하세요.\n\n### 추가할 데이터\n| id | name | parent_id |\n|----|------|-----------|\n| 101 | Board Games | NULL |\n| 102 | Card Games | NULL |\n| 103 | Puzzles | NULL |\n\n### 여러 행 INSERT 구문\n\`\`\`sql\nINSERT INTO 테이블 (컬럼들)\nVALUES (값1), (값2), (값3);\n\`\`\`\n\n> **참고**: 3 rows affected가 표시되면 성공입니다.`,
    en: `Add **3 categories** to the \`categories\` table at once.\n\n### Data to Insert\n| id | name | parent_id |\n|----|------|-----------|\n| 101 | Board Games | NULL |\n| 102 | Card Games | NULL |\n| 103 | Puzzles | NULL |\n\n### Multi-row INSERT Syntax\n\`\`\`sql\nINSERT INTO table (columns)\nVALUES (row1), (row2), (row3);\n\`\`\`\n\n> **Note**: Shows "3 rows affected" on success.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 1,
  hints: {
    ko: ['VALUES 뒤에 여러 개의 괄호를 쉼표로 구분합니다.', '각 괄호가 하나의 행을 나타냅니다.', "INSERT INTO categories (id, name, parent_id) VALUES (101, 'Board Games', NULL), (102, 'Card Games', NULL), (103, 'Puzzles', NULL);"],
    en: ['Separate multiple value sets with commas after VALUES.', 'Each parenthesized set represents one row.', "INSERT INTO categories (id, name, parent_id) VALUES (101, 'Board Games', NULL), (102, 'Card Games', NULL), (103, 'Puzzles', NULL);"],
  },
  explanation: {
    ko: `## 여러 행 INSERT\n\nVALUES 뒤에 여러 개의 값 세트를 쉼표로 나열하면 한 번에 여러 행을 삽입합니다.\n\n\`\`\`sql\nINSERT INTO categories (id, name, parent_id)\nVALUES\n  (101, 'Board Games', NULL),\n  (102, 'Card Games', NULL),\n  (103, 'Puzzles', NULL);\n\`\`\`\n\n### 장점\n- 한 번의 SQL 문으로 여러 행 삽입\n- 개별 INSERT보다 **성능이 훨씬 좋음**\n- 네트워크 왕복(round-trip)이 1회로 줄어듦\n\n### 주의사항\n- 모든 행의 컬럼 수가 동일해야 함\n- 하나의 행이라도 실패하면 전체 INSERT가 롤백됨`,
    en: `## Multi-row INSERT\n\nList multiple value sets separated by commas to insert many rows at once.\n\n\`\`\`sql\nINSERT INTO categories (id, name, parent_id)\nVALUES\n  (101, 'Board Games', NULL),\n  (102, 'Card Games', NULL),\n  (103, 'Puzzles', NULL);\n\`\`\`\n\n### Benefits\n- Insert multiple rows in one statement\n- **Much faster** than individual INSERTs\n- Reduces network round-trips to 1\n\n### Notes\n- All rows must have the same number of columns\n- If any row fails, the entire INSERT is rolled back`,
  },
  expectedQuery: {
    postgresql: "INSERT INTO categories (id, name, parent_id) VALUES (101, 'Board Games', NULL), (102, 'Card Games', NULL), (103, 'Puzzles', NULL);",
    mysql: "INSERT INTO categories (id, name, parent_id) VALUES (101, 'Board Games', NULL), (102, 'Card Games', NULL), (103, 'Puzzles', NULL);",
  },
  gradingMode: 'contains', relatedConcepts: ['INSERT INTO', 'VALUES', 'Multi-row INSERT', 'DML'],
};
