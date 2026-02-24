import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'database-003', level: 'database', order: 3,
  title: { ko: 'pg_stat_user_tables: 테이블 통계 조회', en: 'pg_stat_user_tables: Table Statistics' },
  description: {
    ko: `모든 테이블의 **I/O 통계와 튜플 정보**를 조회하세요.\n\n### 요구사항\n\`\`\`sql\nSELECT\n  relname AS table_name,\n  n_live_tup AS live_rows,\n  n_dead_tup AS dead_rows,\n  seq_scan,\n  idx_scan,\n  n_tup_ins AS inserts,\n  n_tup_upd AS updates,\n  n_tup_del AS deletes\nFROM pg_stat_user_tables\nORDER BY n_live_tup DESC;\n\`\`\`\n\n### 주요 컬럼\n| 컬럼 | 설명 |\n|------|------|\n| n_live_tup | 살아있는 행 수 |\n| n_dead_tup | Dead Tuple 수 (VACUUM 대상) |\n| seq_scan | 순차 스캔 횟수 |\n| idx_scan | 인덱스 스캔 횟수 |\n| n_tup_ins/upd/del | INSERT/UPDATE/DELETE 횟수 |`,
    en: `Query **I/O statistics and tuple info** for all tables.\n\n### Requirements\n\`\`\`sql\nSELECT\n  relname AS table_name,\n  n_live_tup AS live_rows,\n  n_dead_tup AS dead_rows,\n  seq_scan,\n  idx_scan,\n  n_tup_ins AS inserts,\n  n_tup_upd AS updates,\n  n_tup_del AS deletes\nFROM pg_stat_user_tables\nORDER BY n_live_tup DESC;\n\`\`\`\n\n### Key Columns\n| Column | Description |\n|--------|-------------|\n| n_live_tup | Live row count |\n| n_dead_tup | Dead tuple count (VACUUM targets) |\n| seq_scan | Sequential scan count |\n| idx_scan | Index scan count |\n| n_tup_ins/upd/del | INSERT/UPDATE/DELETE counts |`,
  },
  schema: 'ecommerce', category: 'Monitoring', difficulty: 1,
  hints: {
    ko: ['pg_stat_user_tables에는 사용자 테이블의 통계 정보가 있습니다.', 'seq_scan이 높고 idx_scan이 낮으면 인덱스가 필요할 수 있습니다.', 'SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, seq_scan, idx_scan, n_tup_ins AS inserts, n_tup_upd AS updates, n_tup_del AS deletes FROM pg_stat_user_tables ORDER BY n_live_tup DESC;'],
    en: ['pg_stat_user_tables contains statistics for user tables.', 'High seq_scan with low idx_scan may indicate missing indexes.', 'SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, seq_scan, idx_scan, n_tup_ins AS inserts, n_tup_upd AS updates, n_tup_del AS deletes FROM pg_stat_user_tables ORDER BY n_live_tup DESC;'],
  },
  explanation: {
    ko: `## pg_stat_user_tables (테이블 통계)\n\n### 인덱스 필요 여부 판단\n\`\`\`sql\n-- seq_scan이 높고 idx_scan이 낮은 테이블 = 인덱스 필요\nSELECT relname, seq_scan, idx_scan,\n       CASE WHEN idx_scan = 0 THEN 'No index usage!'\n            ELSE ROUND(idx_scan::numeric / (seq_scan + idx_scan) * 100, 1) || '%'\n       END AS idx_usage_ratio\nFROM pg_stat_user_tables\nWHERE seq_scan > 0\nORDER BY seq_scan DESC;\n\`\`\`\n\n### Dead Tuple 비율 확인\n\`\`\`sql\nSELECT relname, n_live_tup, n_dead_tup,\n       CASE WHEN n_live_tup = 0 THEN 0\n            ELSE ROUND(n_dead_tup::numeric / n_live_tup * 100, 1)\n       END AS dead_ratio\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 0\nORDER BY dead_ratio DESC;\n\`\`\`\n\n### DBA 활용\n- **인덱스 최적화**: seq_scan/idx_scan 비율로 인덱스 필요성 판단\n- **VACUUM 타이밍**: Dead Tuple 비율이 높으면 VACUUM 필요\n- **테이블 활동 분석**: INSERT/UPDATE/DELETE 빈도 확인\n- **성능 트렌드**: 통계를 주기적으로 수집하여 변화 추적`,
    en: `## pg_stat_user_tables (Table Statistics)\n\n### Determine Index Need\n\`\`\`sql\n-- High seq_scan + low idx_scan = index needed\nSELECT relname, seq_scan, idx_scan,\n       CASE WHEN idx_scan = 0 THEN 'No index usage!'\n            ELSE ROUND(idx_scan::numeric / (seq_scan + idx_scan) * 100, 1) || '%'\n       END AS idx_usage_ratio\nFROM pg_stat_user_tables\nWHERE seq_scan > 0\nORDER BY seq_scan DESC;\n\`\`\`\n\n### Check Dead Tuple Ratio\n\`\`\`sql\nSELECT relname, n_live_tup, n_dead_tup,\n       CASE WHEN n_live_tup = 0 THEN 0\n            ELSE ROUND(n_dead_tup::numeric / n_live_tup * 100, 1)\n       END AS dead_ratio\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 0\nORDER BY dead_ratio DESC;\n\`\`\`\n\n### DBA Uses\n- **Index optimization**: Judge index need from seq_scan/idx_scan ratio\n- **VACUUM timing**: High dead tuple ratio means VACUUM needed\n- **Table activity analysis**: Monitor INSERT/UPDATE/DELETE frequency\n- **Performance trends**: Collect stats periodically to track changes`,
  },
  expectedQuery: {
    postgresql: 'SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, seq_scan, idx_scan, n_tup_ins AS inserts, n_tup_upd AS updates, n_tup_del AS deletes FROM pg_stat_user_tables ORDER BY n_live_tup DESC;',
    mysql: 'SELECT relname AS table_name, n_live_tup AS live_rows, n_dead_tup AS dead_rows, seq_scan, idx_scan, n_tup_ins AS inserts, n_tup_upd AS updates, n_tup_del AS deletes FROM pg_stat_user_tables ORDER BY n_live_tup DESC;',
  },
  gradingMode: 'exact', relatedConcepts: ['pg_stat_user_tables', 'Statistics', 'Monitoring', 'Index', 'DBA'],
};
