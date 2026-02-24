import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'expert-011', level: 'expert', order: 11,
  title: { ko: 'DELETE USING: 다른 테이블 기반 삭제', en: 'DELETE USING: Delete Based on Another Table' },
  description: {
    ko: `**취소(cancelled)**된 주문의 \`order_items\`를 모두 삭제하세요.\n\n### 요구사항\n- \`orders\` 테이블에서 \`status = 'cancelled'\`인 주문의 ID를 참조\n- 해당 주문의 \`order_items\`를 삭제\n- \`DELETE ... USING\` (PostgreSQL) 구문 사용\n\n### PostgreSQL 구문\n\`\`\`sql\nDELETE FROM order_items\nUSING orders\nWHERE order_items.order_id = orders.id\n  AND orders.status = 'cancelled';\n\`\`\`\n\n> **참고**: MySQL에서는 \`DELETE ... JOIN\` 구문을 사용합니다.`,
    en: `Delete all \`order_items\` for **cancelled** orders.\n\n### Requirements\n- Reference \`orders\` table where \`status = 'cancelled'\`\n- Delete corresponding \`order_items\`\n- Use \`DELETE ... USING\` (PostgreSQL)\n\n### PostgreSQL Syntax\n\`\`\`sql\nDELETE FROM order_items\nUSING orders\nWHERE order_items.order_id = orders.id\n  AND orders.status = 'cancelled';\n\`\`\`\n\n> **Note**: MySQL uses \`DELETE ... JOIN\` syntax instead.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 2,
  hints: {
    ko: ['DELETE FROM ... USING 구문으로 다른 테이블을 참조합니다.', 'WHERE에서 order_items와 orders의 JOIN 조건을 작성합니다.', "DELETE FROM order_items USING orders WHERE order_items.order_id = orders.id AND orders.status = 'cancelled';"],
    en: ['Use DELETE FROM ... USING to reference another table.', 'Write JOIN condition in WHERE between order_items and orders.', "DELETE FROM order_items USING orders WHERE order_items.order_id = orders.id AND orders.status = 'cancelled';"],
  },
  explanation: {
    ko: `## DELETE USING (다른 테이블 기반 삭제)\n\n### PostgreSQL: DELETE ... USING\n\`\`\`sql\nDELETE FROM order_items\nUSING orders\nWHERE order_items.order_id = orders.id\n  AND orders.status = 'cancelled';\n\`\`\`\n\n### MySQL: DELETE ... JOIN\n\`\`\`sql\nDELETE oi FROM order_items oi\nJOIN orders o ON oi.order_id = o.id\nWHERE o.status = 'cancelled';\n\`\`\`\n\n### 서브쿼리 방식 (DB 공통)\n\`\`\`sql\nDELETE FROM order_items\nWHERE order_id IN (\n  SELECT id FROM orders WHERE status = 'cancelled'\n);\n\`\`\`\n\n### 비교\n| 방식 | 장점 | 단점 |\n|------|------|------|\n| USING/JOIN | 직관적, 성능 좋음 | DB마다 문법 다름 |\n| NOT IN 서브쿼리 | DB 공통 | 대용량 시 느릴 수 있음 |\n\n### 실무 활용\n- 취소된 주문의 관련 데이터 정리\n- 비활성 사용자 관련 데이터 일괄 삭제\n- 데이터 아카이빙 후 원본 삭제`,
    en: `## DELETE USING (Cross-table Delete)\n\n### PostgreSQL: DELETE ... USING\n\`\`\`sql\nDELETE FROM order_items\nUSING orders\nWHERE order_items.order_id = orders.id\n  AND orders.status = 'cancelled';\n\`\`\`\n\n### MySQL: DELETE ... JOIN\n\`\`\`sql\nDELETE oi FROM order_items oi\nJOIN orders o ON oi.order_id = o.id\nWHERE o.status = 'cancelled';\n\`\`\`\n\n### Subquery Approach (DB-agnostic)\n\`\`\`sql\nDELETE FROM order_items\nWHERE order_id IN (\n  SELECT id FROM orders WHERE status = 'cancelled'\n);\n\`\`\`\n\n### Comparison\n| Approach | Pros | Cons |\n|----------|------|------|\n| USING/JOIN | Intuitive, performant | DB-specific syntax |\n| Subquery | DB-agnostic | Can be slow on large data |`,
  },
  expectedQuery: {
    postgresql: "DELETE FROM order_items USING orders WHERE order_items.order_id = orders.id AND orders.status = 'cancelled';",
    mysql: "DELETE oi FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.status = 'cancelled';",
  },
  gradingMode: 'contains', relatedConcepts: ['DELETE', 'USING', 'JOIN', 'Cross-table Delete', 'DML'],
};
