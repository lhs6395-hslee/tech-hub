import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-013', level: 'intermediate', order: 13,
  title: { ko: 'DELETE + 서브쿼리: 주문 없는 고객 삭제', en: 'DELETE + Subquery: Remove Customers Without Orders' },
  description: {
    ko: `**주문 기록이 없는 고객**을 \`customers\` 테이블에서 삭제하세요.\n\n### 요구사항\n- \`orders\` 테이블에 \`customer_id\`가 존재하지 않는 고객만 삭제\n- \`NOT IN\` 또는 \`NOT EXISTS\` 서브쿼리 사용\n\n### DELETE + 서브쿼리 구문\n\`\`\`sql\nDELETE FROM 테이블\nWHERE 컬럼 NOT IN (SELECT 컬럼 FROM 다른테이블);\n\`\`\`\n\n> **주의**: 실제 운영 환경에서는 삭제 전 반드시 SELECT로 대상을 확인하세요.`,
    en: `Delete **customers who have never placed an order**.\n\n### Requirements\n- Delete from \`customers\` where \`id\` not found in \`orders.customer_id\`\n- Use \`NOT IN\` or \`NOT EXISTS\` subquery\n\n### DELETE + Subquery Syntax\n\`\`\`sql\nDELETE FROM table\nWHERE column NOT IN (SELECT column FROM other_table);\n\`\`\`\n\n> **Warning**: Always verify targets with SELECT before deleting in production.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 2,
  hints: {
    ko: ['NOT IN 서브쿼리로 orders에 없는 customer_id를 찾습니다.', 'SELECT DISTINCT customer_id FROM orders로 주문한 고객 목록을 구합니다.', 'DELETE FROM customers WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);'],
    en: ['Use NOT IN subquery to find customers without orders.', 'SELECT DISTINCT customer_id FROM orders gets the ordered customer list.', 'DELETE FROM customers WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);'],
  },
  explanation: {
    ko: `## DELETE + 서브쿼리\n\n서브쿼리 결과를 기반으로 삭제 대상을 결정합니다.\n\n\`\`\`sql\nDELETE FROM customers\nWHERE id NOT IN (\n  SELECT DISTINCT customer_id FROM orders\n);\n\`\`\`\n\n### NOT IN vs NOT EXISTS\n\`\`\`sql\n-- NOT IN 방식\nDELETE FROM customers\nWHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);\n\n-- NOT EXISTS 방식 (NULL 안전)\nDELETE FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);\n\`\`\`\n\n### 주의사항\n- **NOT IN + NULL**: 서브쿼리 결과에 NULL이 있으면 모든 행이 삭제되지 않음\n- **NOT EXISTS**가 NULL에 대해 더 안전\n- 삭제 전 반드시 SELECT로 대상 확인\n- FK 제약조건이 있으면 참조되는 행은 삭제 불가`,
    en: `## DELETE + Subquery\n\nDetermines deletion targets based on subquery results.\n\n\`\`\`sql\nDELETE FROM customers\nWHERE id NOT IN (\n  SELECT DISTINCT customer_id FROM orders\n);\n\`\`\`\n\n### NOT IN vs NOT EXISTS\n\`\`\`sql\n-- NOT IN approach\nDELETE FROM customers\nWHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);\n\n-- NOT EXISTS approach (NULL-safe)\nDELETE FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);\n\`\`\`\n\n### Caution\n- **NOT IN + NULL**: If subquery returns NULL, no rows are deleted\n- **NOT EXISTS** is safer with NULLs\n- Always verify with SELECT before deleting\n- FK constraints prevent deleting referenced rows`,
  },
  expectedQuery: {
    postgresql: 'DELETE FROM customers WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);',
    mysql: 'DELETE FROM customers WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders);',
  },
  gradingMode: 'contains', relatedConcepts: ['DELETE', 'NOT IN', 'Subquery', 'DML'],
};
