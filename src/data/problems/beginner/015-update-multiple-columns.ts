import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'beginner-015', level: 'beginner', order: 15,
  title: { ko: 'UPDATE: 여러 컬럼 동시 수정', en: 'UPDATE: Modify Multiple Columns' },
  description: {
    ko: `\`customers\` 테이블에서 **ID가 50번**인 고객의 **도시**를 \`'Jeju'\`로, **프리미엄 여부**를 \`true\`로 변경하세요.\n\n### UPDATE 여러 컬럼 구문\n\`\`\`sql\nUPDATE 테이블\nSET 컬럼1 = 값1, 컬럼2 = 값2\nWHERE 조건;\n\`\`\`\n\n> **참고**: SET 뒤에 쉼표로 여러 컬럼을 나열하면 동시에 수정됩니다.`,
    en: `Change **customer ID 50**'s **city** to \`'Jeju'\` and **is_premium** to \`true\` in \`customers\`.\n\n### UPDATE Multiple Columns Syntax\n\`\`\`sql\nUPDATE table\nSET col1 = val1, col2 = val2\nWHERE condition;\n\`\`\`\n\n> **Note**: List multiple columns with commas after SET to update them together.`,
  },
  schema: 'ecommerce', category: 'DML', difficulty: 1,
  hints: {
    ko: ['SET 뒤에 city와 is_premium을 쉼표로 구분하세요.', 'WHERE id = 50으로 대상을 특정합니다.', "UPDATE customers SET city = 'Jeju', is_premium = true WHERE id = 50;"],
    en: ['Separate city and is_premium with a comma after SET.', 'Use WHERE id = 50 to target the row.', "UPDATE customers SET city = 'Jeju', is_premium = true WHERE id = 50;"],
  },
  explanation: {
    ko: `## UPDATE 여러 컬럼\n\nSET 절에서 쉼표로 구분하여 여러 컬럼을 동시에 수정합니다.\n\n\`\`\`sql\nUPDATE customers\nSET city = 'Jeju', is_premium = true\nWHERE id = 50;\n\`\`\`\n\n### 핵심 포인트\n- **쉼표로 구분**: \`SET col1 = val1, col2 = val2\`\n- 한 번의 UPDATE로 여러 컬럼을 수정하는 것이 효율적\n- 각 컬럼별로 UPDATE를 따로 실행하면 불필요한 부하 발생\n\n### 실무 팁\n- UPDATE 전에 항상 SELECT로 대상 확인\n- \`SELECT * FROM customers WHERE id = 50;\`로 먼저 확인`,
    en: `## UPDATE Multiple Columns\n\nSeparate columns with commas in the SET clause.\n\n\`\`\`sql\nUPDATE customers\nSET city = 'Jeju', is_premium = true\nWHERE id = 50;\n\`\`\`\n\n### Key Points\n- **Comma-separated**: \`SET col1 = val1, col2 = val2\`\n- More efficient than separate UPDATE statements\n- Reduces unnecessary overhead\n\n### Practical Tip\n- Always verify with SELECT before UPDATE\n- \`SELECT * FROM customers WHERE id = 50;\` first`,
  },
  expectedQuery: {
    postgresql: "UPDATE customers SET city = 'Jeju', is_premium = true WHERE id = 50;",
    mysql: "UPDATE customers SET city = 'Jeju', is_premium = true WHERE id = 50;",
  },
  gradingMode: 'contains', relatedConcepts: ['UPDATE', 'SET', 'WHERE', 'DML'],
};
