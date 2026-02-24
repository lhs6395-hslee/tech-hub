import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-011', level: 'intermediate', order: 11,
  title: { ko: 'INSERT SELECT: 쿼리 결과로 삽입', en: 'INSERT SELECT: Insert from Query Result' },
  description: {
    ko: `\`order_items\` 테이블에 **주문 ID 1번**의 항목을 복사하여 **주문 ID 200번**으로 다시 삽입하세요.\n\n### INSERT ... SELECT 구문\n\`\`\`sql\nINSERT INTO 테이블 (컬럼들)\nSELECT 값들 FROM 다른테이블 WHERE 조건;\n\`\`\`\n\n> **참고**: VALUES 대신 SELECT를 사용하면 쿼리 결과를 바로 삽입할 수 있습니다.\n> 주문 ID 200은 orders 테이블에 존재하지 않으므로, order_items에 직접 삽입합니다.`,
    en: `Copy items from **order ID 1** and insert them as **order ID 200** into \`order_items\`.\n\n### INSERT ... SELECT Syntax\n\`\`\`sql\nINSERT INTO table (columns)\nSELECT values FROM other_table WHERE condition;\n\`\`\`\n\n> **Note**: Using SELECT instead of VALUES inserts query results directly.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 2,
  hints: {
    ko: ['INSERT INTO ... SELECT 구문에서 order_id를 200으로 바꿔서 삽입합니다.', 'SELECT에서 id는 SERIAL이므로 제외하고, order_id를 200으로 고정합니다.', "INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT 200, product_id, quantity, unit_price FROM order_items WHERE order_id = 1;"],
    en: ['In INSERT INTO ... SELECT, replace order_id with 200.', 'Exclude id (SERIAL auto-generates), fix order_id to 200.', "INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT 200, product_id, quantity, unit_price FROM order_items WHERE order_id = 1;"],
  },
  explanation: {
    ko: `## INSERT ... SELECT\n\nSELECT 쿼리의 결과를 바로 다른 테이블(또는 같은 테이블)에 삽입합니다.\n\n\`\`\`sql\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT 200, product_id, quantity, unit_price\nFROM order_items\nWHERE order_id = 1;\n\`\`\`\n\n### 활용 사례\n- **데이터 복사**: 기존 데이터를 복제\n- **데이터 마이그레이션**: 다른 테이블에서 데이터 이동\n- **집계 결과 저장**: 집계 결과를 요약 테이블에 삽입\n- **백업**: 특정 조건의 데이터를 백업 테이블에 복사\n\n### VALUES vs SELECT\n| 방식 | 용도 |\n|------|------|\n| VALUES | 직접 값을 지정할 때 |\n| SELECT | 기존 데이터를 가져와 삽입할 때 |`,
    en: `## INSERT ... SELECT\n\nInserts results from a SELECT query directly into a table.\n\n\`\`\`sql\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT 200, product_id, quantity, unit_price\nFROM order_items\nWHERE order_id = 1;\n\`\`\`\n\n### Use Cases\n- **Data copying**: Duplicate existing data\n- **Data migration**: Move data between tables\n- **Store aggregations**: Insert summary results\n- **Backup**: Copy filtered data to backup tables\n\n### VALUES vs SELECT\n| Method | Use When |\n|--------|----------|\n| VALUES | Specifying values directly |\n| SELECT | Inserting from existing data |`,
  },
  expectedQuery: {
    postgresql: "INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT 200, product_id, quantity, unit_price FROM order_items WHERE order_id = 1;",
    mysql: "INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT 200, product_id, quantity, unit_price FROM order_items WHERE order_id = 1;",
  },
  gradingMode: 'contains', relatedConcepts: ['INSERT INTO', 'SELECT', 'Data Copy', 'DML'],
};
