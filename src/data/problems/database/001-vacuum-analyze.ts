import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'database-001', level: 'database', order: 1,
  title: { ko: 'VACUUM ANALYZE: 테이블 유지보수', en: 'VACUUM ANALYZE: Table Maintenance' },
  description: {
    ko: `\`products\` 테이블에 **VACUUM ANALYZE**를 실행하여 유지보수를 수행하세요.\n\n### 요구사항\n1. VACUUM ANALYZE를 실행하세요:\n\`\`\`sql\nVACUUM ANALYZE products;\n\`\`\`\n\n2. 실행 결과를 확인하세요:\n\`\`\`sql\nSELECT\n  relname AS table_name,\n  n_live_tup AS live_rows,\n  n_dead_tup AS dead_rows,\n  last_vacuum,\n  last_analyze\nFROM pg_stat_user_tables\nWHERE relname = 'products';\n\`\`\`\n\n> **채점**: 2번 SELECT 쿼리의 결과로 채점됩니다.\n\n### VACUUM이란?\n- **UPDATE/DELETE** 후 남은 **Dead Tuple**(죽은 행)을 정리\n- PostgreSQL의 MVCC 모델 때문에 필수적인 유지보수\n- **ANALYZE**: 테이블 통계를 갱신하여 쿼리 플래너 최적화`,
    en: `Run **VACUUM ANALYZE** on the \`products\` table for maintenance.\n\n### Requirements\n1. Run VACUUM ANALYZE:\n\`\`\`sql\nVACUUM ANALYZE products;\n\`\`\`\n\n2. Check the results:\n\`\`\`sql\nSELECT\n  relname AS table_name,\n  n_live_tup AS live_rows,\n  n_dead_tup AS dead_rows,\n  last_vacuum,\n  last_analyze\nFROM pg_stat_user_tables\nWHERE relname = 'products';\n\`\`\`\n\n> **Grading**: Based on step 2's SELECT result.\n\n### What is VACUUM?\n- Cleans up **Dead Tuples** left after UPDATE/DELETE\n- Essential maintenance due to PostgreSQL's MVCC model\n- **ANALYZE**: Updates table statistics for query planner optimization`,
  },
  schema: 'ecommerce', category: 'Maintenance', difficulty: 2,
  hints: {
    ko: ['VACUUM은 Dead Tuple을 정리하고, ANALYZE는 통계를 갱신합니다.', 'pg_stat_user_tables에서 마지막 VACUUM/ANALYZE 시간을 확인할 수 있습니다.', "SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, last_vacuum, last_analyze FROM pg_stat_user_tables WHERE relname = 'products';"],
    en: ['VACUUM cleans dead tuples, ANALYZE updates statistics.', 'Check last VACUUM/ANALYZE time in pg_stat_user_tables.', "SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, last_vacuum, last_analyze FROM pg_stat_user_tables WHERE relname = 'products';"],
  },
  explanation: {
    ko: `## VACUUM ANALYZE\n\n### VACUUM 종류\n| 명령 | 설명 |\n|------|------|\n| VACUUM | Dead Tuple 정리 (일반) |\n| VACUUM FULL | 테이블 재작성 (잠금 발생) |\n| VACUUM ANALYZE | 정리 + 통계 갱신 |\n| ANALYZE | 통계만 갱신 |\n\n### Dead Tuple이란?\nPostgreSQL은 MVCC(Multi-Version Concurrency Control)를 사용합니다:\n- UPDATE → 기존 행은 삭제 마킹, 새 행 생성\n- DELETE → 행은 삭제 마킹 (바로 제거 안됨)\n- VACUUM이 이 Dead Tuple을 실제로 정리\n\n### autovacuum\n\`\`\`sql\n-- autovacuum 설정 확인\nSHOW autovacuum;\nSHOW autovacuum_vacuum_threshold;\nSHOW autovacuum_analyze_threshold;\n\`\`\`\nPostgreSQL은 기본적으로 autovacuum이 자동 실행됩니다.\n\n### 실무 포인트\n- 대량 UPDATE/DELETE 후 수동 VACUUM 권장\n- VACUUM FULL은 테이블 잠금 → 운영 중 주의\n- 정기적 ANALYZE로 쿼리 성능 유지`,
    en: `## VACUUM ANALYZE\n\n### VACUUM Types\n| Command | Description |\n|---------|-------------|\n| VACUUM | Clean dead tuples (regular) |\n| VACUUM FULL | Rewrite table (acquires lock) |\n| VACUUM ANALYZE | Clean + update stats |\n| ANALYZE | Update stats only |\n\n### What are Dead Tuples?\nPostgreSQL uses MVCC (Multi-Version Concurrency Control):\n- UPDATE → old row is marked dead, new row created\n- DELETE → row is marked dead (not immediately removed)\n- VACUUM actually cleans these dead tuples\n\n### autovacuum\n\`\`\`sql\n-- Check autovacuum settings\nSHOW autovacuum;\nSHOW autovacuum_vacuum_threshold;\nSHOW autovacuum_analyze_threshold;\n\`\`\`\nPostgreSQL runs autovacuum by default.\n\n### Production Tips\n- Manual VACUUM recommended after bulk UPDATE/DELETE\n- VACUUM FULL locks table → use cautiously in production\n- Regular ANALYZE maintains query performance`,
  },
  expectedQuery: {
    postgresql: "SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, last_vacuum, last_analyze FROM pg_stat_user_tables WHERE relname = 'products';",
    mysql: "SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, last_vacuum, last_analyze FROM pg_stat_user_tables WHERE relname = 'products';",
  },
  gradingMode: 'exact', relatedConcepts: ['VACUUM', 'ANALYZE', 'Dead Tuple', 'MVCC', 'Maintenance', 'DBA'],
};
