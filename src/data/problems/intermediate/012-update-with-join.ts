import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-012', level: 'intermediate', order: 12,
  title: { ko: 'UPDATE + 서브쿼리: 평균가 이하 제품 재고 증가', en: 'UPDATE + Subquery: Increase Stock for Below-Average Products' },
  description: {
    ko: `**평균 가격 이하**인 제품들의 \`stock_quantity\`를 **50 증가**시키세요.\n\n### 요구사항\n- \`products\` 테이블에서 \`price\`가 전체 평균 이하인 제품만 대상\n- \`stock_quantity\`를 현재 값에서 50 추가\n- 서브쿼리로 평균 가격을 구합니다\n\n### UPDATE + 서브쿼리 구문\n\`\`\`sql\nUPDATE 테이블\nSET 컬럼 = 컬럼 + 값\nWHERE 컬럼 <= (SELECT AVG(컬럼) FROM 테이블);\n\`\`\``,
    en: `Increase \`stock_quantity\` by **50** for products priced **at or below average**.\n\n### Requirements\n- Target products in \`products\` where \`price\` <= overall average\n- Add 50 to current \`stock_quantity\`\n- Use a subquery to calculate the average price\n\n### UPDATE + Subquery Syntax\n\`\`\`sql\nUPDATE table\nSET column = column + value\nWHERE column <= (SELECT AVG(column) FROM table);\n\`\`\``,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 2,
  hints: {
    ko: ['SET stock_quantity = stock_quantity + 50으로 현재 값에 50을 더합니다.', 'WHERE price <= (SELECT AVG(price) FROM products)로 평균 이하를 필터링합니다.', 'UPDATE products SET stock_quantity = stock_quantity + 50 WHERE price <= (SELECT AVG(price) FROM products);'],
    en: ['SET stock_quantity = stock_quantity + 50 adds 50 to current value.', 'WHERE price <= (SELECT AVG(price) FROM products) filters below average.', 'UPDATE products SET stock_quantity = stock_quantity + 50 WHERE price <= (SELECT AVG(price) FROM products);'],
  },
  explanation: {
    ko: `## UPDATE + 서브쿼리\n\nWHERE 조건에 서브쿼리를 사용하여 동적인 조건으로 UPDATE합니다.\n\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + 50\nWHERE price <= (SELECT AVG(price) FROM products);\n\`\`\`\n\n### 핵심 포인트\n- **산술 연산**: \`stock_quantity + 50\`처럼 현재 값에 연산 가능\n- **서브쿼리 WHERE**: 동적 조건으로 대상 필터링\n- 서브쿼리는 단일 값(스칼라)을 반환해야 비교 가능\n\n### 실무 활용\n- 특정 조건의 데이터 일괄 수정\n- 통계 기반 데이터 보정\n- 재고 관리, 가격 조정 등`,
    en: `## UPDATE + Subquery\n\nUse a subquery in WHERE for dynamic conditions.\n\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + 50\nWHERE price <= (SELECT AVG(price) FROM products);\n\`\`\`\n\n### Key Points\n- **Arithmetic**: \`stock_quantity + 50\` operates on current value\n- **Subquery WHERE**: Dynamic condition filtering\n- Subquery must return a scalar value for comparison\n\n### Real-World Use\n- Batch updates based on conditions\n- Statistics-based data correction\n- Inventory management, price adjustments`,
  },
  expectedQuery: {
    postgresql: 'UPDATE products SET stock_quantity = stock_quantity + 50 WHERE price <= (SELECT AVG(price) FROM products);',
    mysql: 'UPDATE products SET stock_quantity = stock_quantity + 50 WHERE price <= (SELECT AVG(price) FROM products);',
  },
  gradingMode: 'contains', relatedConcepts: ['UPDATE', 'Subquery', 'AVG', 'SET', 'DML'],
};
