import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'expert-012', level: 'expert', order: 12,
  title: { ko: 'UPDATE CASE: 조건별 일괄 업데이트', en: 'UPDATE CASE: Conditional Batch Update' },
  description: {
    ko: `\`products\` 테이블의 재고를 **카테고리별로 다르게** 일괄 업데이트하세요.\n\n### 요구사항\n- 카테고리 ID 6 (Smartphones): 재고 +100\n- 카테고리 ID 7 (Laptops): 재고 +50\n- 카테고리 ID 8 (Audio): 재고 +200\n- 나머지: 재고 +10\n- CASE 표현식 사용\n\n### UPDATE + CASE 구문\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + CASE\n  WHEN category_id = 6 THEN 100\n  WHEN category_id = 7 THEN 50\n  WHEN category_id = 8 THEN 200\n  ELSE 10\nEND;\n\`\`\``,
    en: `Batch update \`products\` stock with **different amounts per category**.\n\n### Requirements\n- Category ID 6 (Smartphones): stock +100\n- Category ID 7 (Laptops): stock +50\n- Category ID 8 (Audio): stock +200\n- Others: stock +10\n- Use CASE expression\n\n### UPDATE + CASE Syntax\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + CASE\n  WHEN category_id = 6 THEN 100\n  WHEN category_id = 7 THEN 50\n  WHEN category_id = 8 THEN 200\n  ELSE 10\nEND;\n\`\`\``,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 3,
  hints: {
    ko: ['SET 절 안에서 CASE WHEN을 사용합니다.', 'ELSE로 나머지 카테고리의 기본 증가량을 지정합니다.', 'UPDATE products SET stock_quantity = stock_quantity + CASE WHEN category_id = 6 THEN 100 WHEN category_id = 7 THEN 50 WHEN category_id = 8 THEN 200 ELSE 10 END;'],
    en: ['Use CASE WHEN inside the SET clause.', 'ELSE specifies the default increment for other categories.', 'UPDATE products SET stock_quantity = stock_quantity + CASE WHEN category_id = 6 THEN 100 WHEN category_id = 7 THEN 50 WHEN category_id = 8 THEN 200 ELSE 10 END;'],
  },
  explanation: {
    ko: `## UPDATE + CASE (조건별 일괄 업데이트)\n\n하나의 UPDATE 문으로 조건에 따라 다른 값을 설정합니다.\n\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + CASE\n  WHEN category_id = 6 THEN 100\n  WHEN category_id = 7 THEN 50\n  WHEN category_id = 8 THEN 200\n  ELSE 10\nEND;\n\`\`\`\n\n### 장점\n- **하나의 UPDATE**로 조건별 다른 값 적용\n- 여러 개의 UPDATE를 실행하는 것보다 효율적\n- 트랜잭션 1회로 원자성 보장\n\n### 실무 활용\n- 등급별 포인트 지급\n- 지역별 배송비 일괄 설정\n- 카테고리별 할인율 적용\n- 상태별 우선순위 재설정\n\n### 여러 컬럼에 CASE 적용\n\`\`\`sql\nUPDATE products SET\n  stock_quantity = stock_quantity + CASE WHEN ... END,\n  price = price * CASE WHEN ... END;\n\`\`\``,
    en: `## UPDATE + CASE (Conditional Batch Update)\n\nApply different values based on conditions in a single UPDATE.\n\n\`\`\`sql\nUPDATE products\nSET stock_quantity = stock_quantity + CASE\n  WHEN category_id = 6 THEN 100\n  WHEN category_id = 7 THEN 50\n  WHEN category_id = 8 THEN 200\n  ELSE 10\nEND;\n\`\`\`\n\n### Benefits\n- **Single UPDATE** with conditional values\n- More efficient than multiple UPDATEs\n- Atomic in one transaction\n\n### Real-World Uses\n- Tier-based point awards\n- Region-based shipping costs\n- Category-based discount rates\n- Status-based priority resets\n\n### CASE on Multiple Columns\n\`\`\`sql\nUPDATE products SET\n  stock_quantity = stock_quantity + CASE WHEN ... END,\n  price = price * CASE WHEN ... END;\n\`\`\``,
  },
  expectedQuery: {
    postgresql: 'UPDATE products SET stock_quantity = stock_quantity + CASE WHEN category_id = 6 THEN 100 WHEN category_id = 7 THEN 50 WHEN category_id = 8 THEN 200 ELSE 10 END;',
    mysql: 'UPDATE products SET stock_quantity = stock_quantity + CASE WHEN category_id = 6 THEN 100 WHEN category_id = 7 THEN 50 WHEN category_id = 8 THEN 200 ELSE 10 END;',
  },
  gradingMode: 'contains', relatedConcepts: ['UPDATE', 'CASE', 'Batch Update', 'Conditional', 'DML'],
};
