import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'expert-014', level: 'expert', order: 14,
  title: { ko: 'CREATE SEQUENCE: 시퀀스 생성 및 사용', en: 'CREATE SEQUENCE: Sequence Creation and Usage' },
  description: {
    ko: `주문번호 생성을 위한 커스텀 시퀀스를 생성하고 사용하세요.\n\n### 요구사항\n1. 시퀀스를 생성하세요:\n\`\`\`sql\nCREATE SEQUENCE IF NOT EXISTS order_number_seq\n  START WITH 10001\n  INCREMENT BY 1\n  NO MAXVALUE\n  CACHE 10;\n\`\`\`\n\n2. 시퀀스 값을 확인하세요:\n\`\`\`sql\nSELECT\n  nextval('order_number_seq') AS first_val,\n  nextval('order_number_seq') AS second_val,\n  currval('order_number_seq') AS current_val;\n\`\`\`\n\n> **채점**: 2번 SELECT 쿼리의 결과로 채점됩니다.\n\n### 시퀀스(Sequence)란?\n- 순차적으로 **고유한 숫자를 생성**하는 데이터베이스 객체\n- SERIAL 타입 내부에서도 시퀀스를 사용\n- 여러 테이블에서 공유 가능`,
    en: `Create and use a custom sequence for order number generation.\n\n### Requirements\n1. Create the sequence:\n\`\`\`sql\nCREATE SEQUENCE IF NOT EXISTS order_number_seq\n  START WITH 10001\n  INCREMENT BY 1\n  NO MAXVALUE\n  CACHE 10;\n\`\`\`\n\n2. Check sequence values:\n\`\`\`sql\nSELECT\n  nextval('order_number_seq') AS first_val,\n  nextval('order_number_seq') AS second_val,\n  currval('order_number_seq') AS current_val;\n\`\`\`\n\n> **Grading**: Based on step 2's SELECT result.\n\n### What is a Sequence?\n- Database object that generates **unique sequential numbers**\n- SERIAL type uses sequences internally\n- Can be shared across multiple tables`,
  },
  schema: 'ecommerce', category: 'DDL', difficulty: 2,
  hints: {
    ko: ['CREATE SEQUENCE로 커스텀 시퀀스를 생성합니다.', 'nextval()은 다음 값을, currval()은 현재 값을 반환합니다.', "SELECT nextval('order_number_seq') AS first_val, nextval('order_number_seq') AS second_val, currval('order_number_seq') AS current_val;"],
    en: ['Use CREATE SEQUENCE to create a custom sequence.', 'nextval() returns next value, currval() returns current value.', "SELECT nextval('order_number_seq') AS first_val, nextval('order_number_seq') AS second_val, currval('order_number_seq') AS current_val;"],
  },
  explanation: {
    ko: `## CREATE SEQUENCE (시퀀스)\n\n\`\`\`sql\nCREATE SEQUENCE IF NOT EXISTS order_number_seq\n  START WITH 10001\n  INCREMENT BY 1\n  NO MAXVALUE\n  CACHE 10;\n\`\`\`\n\n### 시퀀스 함수\n| 함수 | 설명 |\n|------|------|\n| nextval('seq') | 다음 값 생성 (부작용 있음) |\n| currval('seq') | 현재 세션의 마지막 값 |\n| setval('seq', n) | 시퀀스 값을 n으로 설정 |\n| lastval() | 마지막으로 생성된 값 |\n\n### 시퀀스 옵션\n\`\`\`sql\nCREATE SEQUENCE my_seq\n  START WITH 1       -- 시작 값\n  INCREMENT BY 1     -- 증가량\n  MINVALUE 1         -- 최소값\n  NO MAXVALUE        -- 최대값 없음\n  CACHE 10           -- 메모리에 미리 할당할 값 수\n  CYCLE;             -- 최대값 도달 시 처음부터 다시\n\`\`\`\n\n### SERIAL과의 관계\n\`\`\`sql\n-- SERIAL은 내부적으로 시퀀스를 생성\nCREATE TABLE t (id SERIAL PRIMARY KEY);\n-- 동일:\nCREATE SEQUENCE t_id_seq;\nCREATE TABLE t (id INTEGER DEFAULT nextval('t_id_seq') PRIMARY KEY);\n\`\`\`\n\n### 실무 활용\n- 주문번호, 송장번호 등 비즈니스 고유 번호\n- 여러 테이블이 공유하는 통합 ID 체계\n- 배치 처리에서의 순서 보장`,
    en: `## CREATE SEQUENCE\n\n\`\`\`sql\nCREATE SEQUENCE IF NOT EXISTS order_number_seq\n  START WITH 10001\n  INCREMENT BY 1\n  NO MAXVALUE\n  CACHE 10;\n\`\`\`\n\n### Sequence Functions\n| Function | Description |\n|----------|-------------|\n| nextval('seq') | Generate next value (has side effect) |\n| currval('seq') | Last value in current session |\n| setval('seq', n) | Set sequence to n |\n| lastval() | Last generated value |\n\n### Sequence Options\n\`\`\`sql\nCREATE SEQUENCE my_seq\n  START WITH 1       -- Starting value\n  INCREMENT BY 1     -- Step size\n  MINVALUE 1         -- Minimum value\n  NO MAXVALUE        -- No upper limit\n  CACHE 10           -- Pre-allocate values in memory\n  CYCLE;             -- Restart from beginning at max\n\`\`\`\n\n### Relationship with SERIAL\n\`\`\`sql\n-- SERIAL internally creates a sequence\nCREATE TABLE t (id SERIAL PRIMARY KEY);\n-- Equivalent to:\nCREATE SEQUENCE t_id_seq;\nCREATE TABLE t (id INTEGER DEFAULT nextval('t_id_seq') PRIMARY KEY);\n\`\`\`\n\n### Real-World Uses\n- Order numbers, invoice numbers, business IDs\n- Shared ID systems across multiple tables\n- Guaranteed ordering in batch processing`,
  },
  expectedQuery: {
    postgresql: "SELECT nextval('order_number_seq') AS first_val, nextval('order_number_seq') AS second_val, currval('order_number_seq') AS current_val;",
    mysql: "SELECT nextval('order_number_seq') AS first_val, nextval('order_number_seq') AS second_val, currval('order_number_seq') AS current_val;",
  },
  gradingMode: 'exact', relatedConcepts: ['CREATE SEQUENCE', 'SERIAL', 'nextval', 'currval', 'DDL', 'DBA'],
};
