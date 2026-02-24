import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'advanced-012', level: 'advanced', order: 12,
  title: { ko: 'UPDATE FROM: 다른 테이블 기반 업데이트', en: 'UPDATE FROM: Update Based on Another Table' },
  description: {
    ko: `\`orders\` 테이블에서 **프리미엄 고객**의 모든 \`pending\` 주문을 \`processing\`으로 변경하세요.\n\n### 요구사항\n- \`customers\` 테이블의 \`is_premium = true\`인 고객의 주문만 대상\n- \`orders.status = 'pending'\`인 주문만 변경\n- \`UPDATE ... FROM\` (PostgreSQL) 또는 \`UPDATE ... JOIN\` (MySQL) 사용\n\n### PostgreSQL 구문\n\`\`\`sql\nUPDATE orders\nSET status = 'processing'\nFROM customers\nWHERE orders.customer_id = customers.id\n  AND customers.is_premium = true\n  AND orders.status = 'pending';\n\`\`\``,
    en: `Change all \`pending\` orders to \`processing\` for **premium customers**.\n\n### Requirements\n- Target orders where customer has \`is_premium = true\`\n- Only update orders with \`status = 'pending'\`\n- Use \`UPDATE ... FROM\` (PostgreSQL) or \`UPDATE ... JOIN\` (MySQL)\n\n### PostgreSQL Syntax\n\`\`\`sql\nUPDATE orders\nSET status = 'processing'\nFROM customers\nWHERE orders.customer_id = customers.id\n  AND customers.is_premium = true\n  AND orders.status = 'pending';\n\`\`\``,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 3,
  hints: {
    ko: ['PostgreSQL에서는 UPDATE ... FROM 구문으로 다른 테이블을 참조합니다.', 'WHERE 절에서 두 테이블의 JOIN 조건과 필터 조건을 모두 작성합니다.', "UPDATE orders SET status = 'processing' FROM customers WHERE orders.customer_id = customers.id AND customers.is_premium = true AND orders.status = 'pending';"],
    en: ['PostgreSQL uses UPDATE ... FROM to reference other tables.', 'Include both JOIN condition and filter conditions in WHERE.', "UPDATE orders SET status = 'processing' FROM customers WHERE orders.customer_id = customers.id AND customers.is_premium = true AND orders.status = 'pending';"],
  },
  explanation: {
    ko: `## UPDATE FROM (다른 테이블 기반 업데이트)\n\n### PostgreSQL: UPDATE ... FROM\n\`\`\`sql\nUPDATE orders\nSET status = 'processing'\nFROM customers\nWHERE orders.customer_id = customers.id\n  AND customers.is_premium = true\n  AND orders.status = 'pending';\n\`\`\`\n\n### MySQL: UPDATE ... JOIN\n\`\`\`sql\nUPDATE orders o\nJOIN customers c ON o.customer_id = c.id\nSET o.status = 'processing'\nWHERE c.is_premium = true\n  AND o.status = 'pending';\n\`\`\`\n\n### 핵심 포인트\n- **PostgreSQL**: FROM 절에 참조 테이블, WHERE에서 JOIN 조건\n- **MySQL**: JOIN을 SET 앞에 작성\n- 두 방식 모두 다른 테이블의 조건으로 UPDATE 가능\n\n### 실무 활용\n- VIP 고객 우선 처리\n- 특정 카테고리 제품 일괄 가격 조정\n- 관련 테이블 기반 상태 변경`,
    en: `## UPDATE FROM (Update Based on Another Table)\n\n### PostgreSQL: UPDATE ... FROM\n\`\`\`sql\nUPDATE orders\nSET status = 'processing'\nFROM customers\nWHERE orders.customer_id = customers.id\n  AND customers.is_premium = true\n  AND orders.status = 'pending';\n\`\`\`\n\n### MySQL: UPDATE ... JOIN\n\`\`\`sql\nUPDATE orders o\nJOIN customers c ON o.customer_id = c.id\nSET o.status = 'processing'\nWHERE c.is_premium = true\n  AND o.status = 'pending';\n\`\`\`\n\n### Key Points\n- **PostgreSQL**: Reference table in FROM, join in WHERE\n- **MySQL**: JOIN before SET\n- Both enable cross-table conditional updates\n\n### Real-World Uses\n- VIP customer priority processing\n- Category-based batch price adjustments\n- Status changes based on related tables`,
  },
  expectedQuery: {
    postgresql: "UPDATE orders SET status = 'processing' FROM customers WHERE orders.customer_id = customers.id AND customers.is_premium = true AND orders.status = 'pending';",
    mysql: "UPDATE orders o JOIN customers c ON o.customer_id = c.id SET o.status = 'processing' WHERE c.is_premium = true AND o.status = 'pending';",
  },
  gradingMode: 'contains', relatedConcepts: ['UPDATE', 'FROM', 'JOIN', 'Cross-table Update', 'DML'],
};
