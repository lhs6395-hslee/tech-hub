import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'advanced-011', level: 'advanced', order: 11,
  title: { ko: 'INSERT RETURNING: 삽입 결과 즉시 확인', en: 'INSERT RETURNING: Get Inserted Data Back' },
  description: {
    ko: `\`orders\` 테이블에 새 주문을 추가하고, **RETURNING**으로 생성된 데이터를 즉시 확인하세요.\n\n### 요구사항\n아래 쿼리를 실행하세요:\n\`\`\`sql\nINSERT INTO orders (customer_id, order_date, status, total_amount)\nVALUES (1, '2025-06-01 10:00:00', 'pending', 599000)\nRETURNING id, customer_id, order_date, status, total_amount;\n\`\`\`\n\n> **RETURNING**은 INSERT/UPDATE/DELETE 후 변경된 행을 SELECT처럼 반환합니다.\n> 별도의 SELECT 쿼리 없이 생성된 ID를 즉시 확인할 수 있습니다.`,
    en: `Insert a new order and use **RETURNING** to immediately see the inserted data.\n\n### Requirements\nRun this query:\n\`\`\`sql\nINSERT INTO orders (customer_id, order_date, status, total_amount)\nVALUES (1, '2025-06-01 10:00:00', 'pending', 599000)\nRETURNING id, customer_id, order_date, status, total_amount;\n\`\`\`\n\n> **RETURNING** returns modified rows like a SELECT after INSERT/UPDATE/DELETE.\n> Get the auto-generated ID immediately without a separate SELECT.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 2,
  hints: {
    ko: ['INSERT 문 끝에 RETURNING 절을 추가합니다.', 'RETURNING *은 모든 컬럼을, RETURNING id는 특정 컬럼만 반환합니다.', "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (1, '2025-06-01 10:00:00', 'pending', 599000) RETURNING id, customer_id, order_date, status, total_amount;"],
    en: ['Add RETURNING clause at the end of INSERT.', 'RETURNING * returns all columns, RETURNING id returns specific ones.', "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (1, '2025-06-01 10:00:00', 'pending', 599000) RETURNING id, customer_id, order_date, status, total_amount;"],
  },
  explanation: {
    ko: `## RETURNING 절\n\nPostgreSQL에서 DML 문 실행 후 변경된 행을 즉시 반환합니다.\n\n\`\`\`sql\nINSERT INTO orders (...)\nVALUES (...)\nRETURNING id, customer_id, order_date, status, total_amount;\n\`\`\`\n\n### 활용\n- **INSERT RETURNING**: 자동 생성된 ID 확인\n- **UPDATE RETURNING**: 수정된 값 확인\n- **DELETE RETURNING**: 삭제된 행 확인\n\n### RETURNING vs 별도 SELECT\n| 방식 | 쿼리 수 | 원자성 |\n|------|---------|--------|\n| RETURNING | 1 | 보장 |\n| INSERT + SELECT | 2 | 미보장 (동시성 문제) |\n\n### MySQL 대안\nMySQL은 RETURNING을 지원하지 않습니다.\n- \`LAST_INSERT_ID()\`로 자동 생성 ID 확인\n- \`SELECT * FROM orders WHERE id = LAST_INSERT_ID();\``,
    en: `## RETURNING Clause\n\nPostgreSQL returns modified rows immediately after DML.\n\n\`\`\`sql\nINSERT INTO orders (...)\nVALUES (...)\nRETURNING id, customer_id, order_date, status, total_amount;\n\`\`\`\n\n### Usage\n- **INSERT RETURNING**: Get auto-generated IDs\n- **UPDATE RETURNING**: See updated values\n- **DELETE RETURNING**: See deleted rows\n\n### RETURNING vs Separate SELECT\n| Method | Queries | Atomicity |\n|--------|---------|----------|\n| RETURNING | 1 | Guaranteed |\n| INSERT + SELECT | 2 | Not guaranteed (concurrency) |\n\n### MySQL Alternative\nMySQL doesn't support RETURNING.\n- Use \`LAST_INSERT_ID()\` for auto-generated IDs`,
  },
  expectedQuery: {
    postgresql: "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (1, '2025-06-01 10:00:00', 'pending', 599000) RETURNING id, customer_id, order_date, status, total_amount;",
    mysql: "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (1, '2025-06-01 10:00:00', 'pending', 599000);",
  },
  gradingMode: 'contains', relatedConcepts: ['INSERT', 'RETURNING', 'DML', 'Auto-generated ID'],
};
