import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-016', level: 'intermediate', order: 16,
  title: { ko: 'TRUNCATE: 테이블 데이터 전체 삭제', en: 'TRUNCATE: Remove All Table Data' },
  description: {
    ko: `\`reviews\` 테이블의 모든 데이터를 빠르게 삭제하세요.\n\n### 요구사항\n1. TRUNCATE 문을 실행하세요:\n\`\`\`sql\nTRUNCATE TABLE reviews;\n\`\`\`\n\n2. 삭제 확인을 위해 아래 쿼리를 실행하세요:\n\`\`\`sql\nSELECT COUNT(*) AS remaining_rows FROM reviews;\n\`\`\`\n\n> **채점**: 2번 SELECT 쿼리의 결과로 채점됩니다. (결과: 0)\n\n### TRUNCATE vs DELETE\n| 비교 | TRUNCATE | DELETE |\n|------|----------|--------|\n| 속도 | 매우 빠름 | 느림 (행 단위) |\n| WHERE 조건 | 불가 | 가능 |\n| 롤백 | 제한적 | 가능 |\n| 자동증가 | 리셋됨 | 유지됨 |\n| 트리거 | 실행 안됨 | 실행됨 |`,
    en: `Quickly remove all data from the \`reviews\` table.\n\n### Requirements\n1. Run TRUNCATE:\n\`\`\`sql\nTRUNCATE TABLE reviews;\n\`\`\`\n\n2. Verify deletion:\n\`\`\`sql\nSELECT COUNT(*) AS remaining_rows FROM reviews;\n\`\`\`\n\n> **Grading**: Based on step 2's result. (Expected: 0)\n\n### TRUNCATE vs DELETE\n| Compare | TRUNCATE | DELETE |\n|---------|----------|--------|\n| Speed | Very fast | Slow (row-by-row) |\n| WHERE clause | No | Yes |\n| Rollback | Limited | Yes |\n| Auto-increment | Reset | Preserved |\n| Triggers | Not fired | Fired |`,
  },
  schema: 'ecommerce', category: 'DDL', difficulty: 1,
  hints: {
    ko: ['TRUNCATE TABLE은 DELETE보다 훨씬 빠르게 전체 행을 삭제합니다.', 'TRUNCATE는 WHERE 조건을 사용할 수 없습니다.', 'SELECT COUNT(*) AS remaining_rows FROM reviews;'],
    en: ['TRUNCATE TABLE removes all rows much faster than DELETE.', 'TRUNCATE cannot use WHERE conditions.', 'SELECT COUNT(*) AS remaining_rows FROM reviews;'],
  },
  explanation: {
    ko: `## TRUNCATE TABLE (전체 데이터 삭제)\n\n\`\`\`sql\nTRUNCATE TABLE reviews;\n\`\`\`\n\n### DELETE와의 차이\n- **DELETE**: 행 하나씩 삭제, 트랜잭션 로그에 기록, 롤백 가능\n- **TRUNCATE**: 테이블 데이터를 한번에 제거, 로그 최소화, 매우 빠름\n\n### TRUNCATE 특징\n- WHERE 조건 사용 불가 (전체 삭제만)\n- 자동 증가(SERIAL/AUTO_INCREMENT) 값이 리셋됨\n- 트리거가 실행되지 않음\n- 외래키 참조가 있으면 실패 (CASCADE 옵션으로 해결)\n\n### CASCADE 옵션 (PostgreSQL)\n\`\`\`sql\n-- 참조하는 테이블의 데이터도 함께 삭제\nTRUNCATE TABLE orders CASCADE;\n\`\`\`\n\n### 실무 활용\n- 테스트 데이터 초기화\n- 배치 처리 전 임시 테이블 비우기\n- 대용량 로그 테이블 정리`,
    en: `## TRUNCATE TABLE (Remove All Data)\n\n\`\`\`sql\nTRUNCATE TABLE reviews;\n\`\`\`\n\n### Difference from DELETE\n- **DELETE**: Row-by-row removal, logged, rollback possible\n- **TRUNCATE**: Bulk removal, minimal logging, very fast\n\n### TRUNCATE Characteristics\n- No WHERE clause (full table only)\n- Resets auto-increment (SERIAL/AUTO_INCREMENT)\n- Does NOT fire triggers\n- Fails if foreign key references exist (use CASCADE)\n\n### CASCADE Option (PostgreSQL)\n\`\`\`sql\n-- Also truncate referencing tables\nTRUNCATE TABLE orders CASCADE;\n\`\`\`\n\n### Real-World Uses\n- Reset test data\n- Clear staging tables before batch processing\n- Clean up large log tables`,
  },
  expectedQuery: {
    postgresql: 'SELECT COUNT(*) AS remaining_rows FROM reviews;',
    mysql: 'SELECT COUNT(*) AS remaining_rows FROM reviews;',
  },
  gradingMode: 'exact', relatedConcepts: ['TRUNCATE', 'DELETE', 'DDL', 'Data Cleanup'],
};
