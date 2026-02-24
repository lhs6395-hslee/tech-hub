import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-015', level: 'intermediate', order: 15,
  title: { ko: 'DROP TABLE: 테이블 삭제', en: 'DROP TABLE: Remove a Table' },
  description: {
    ko: `불필요한 테이블을 안전하게 삭제하세요.\n\n### 요구사항\n1. 먼저 임시 테이블을 생성하세요:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS temp_logs (\n  id SERIAL PRIMARY KEY,\n  message TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n2. 생성된 테이블을 삭제하세요:\n\`\`\`sql\nDROP TABLE IF EXISTS temp_logs;\n\`\`\`\n\n3. 삭제 확인을 위해 아래 쿼리를 실행하세요:\n\`\`\`sql\nSELECT COUNT(*) AS table_exists\nFROM information_schema.tables\nWHERE table_name = 'temp_logs';\n\`\`\`\n\n> **채점**: 3번 SELECT 쿼리의 결과로 채점됩니다. (결과: 0)\n\n### DROP TABLE 옵션\n- **IF EXISTS**: 테이블이 없어도 오류 발생 안함\n- **CASCADE**: 의존하는 객체(뷰, FK)도 함께 삭제\n- **RESTRICT**: 의존 객체가 있으면 삭제 거부 (기본값)`,
    en: `Safely remove an unnecessary table.\n\n### Requirements\n1. First, create a temporary table:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS temp_logs (\n  id SERIAL PRIMARY KEY,\n  message TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n2. Drop the created table:\n\`\`\`sql\nDROP TABLE IF EXISTS temp_logs;\n\`\`\`\n\n3. Verify deletion:\n\`\`\`sql\nSELECT COUNT(*) AS table_exists\nFROM information_schema.tables\nWHERE table_name = 'temp_logs';\n\`\`\`\n\n> **Grading**: Based on step 3's result. (Expected: 0)\n\n### DROP TABLE Options\n- **IF EXISTS**: No error if table doesn't exist\n- **CASCADE**: Also drop dependent objects (views, FKs)\n- **RESTRICT**: Refuse if dependencies exist (default)`,
  },
  schema: 'ecommerce', category: 'DDL', difficulty: 1,
  hints: {
    ko: ['DROP TABLE IF EXISTS는 테이블이 없어도 오류가 발생하지 않습니다.', 'information_schema.tables에서 테이블 존재 여부를 확인할 수 있습니다.', "SELECT COUNT(*) AS table_exists FROM information_schema.tables WHERE table_name = 'temp_logs';"],
    en: ['DROP TABLE IF EXISTS prevents errors when table does not exist.', 'Check table existence via information_schema.tables.', "SELECT COUNT(*) AS table_exists FROM information_schema.tables WHERE table_name = 'temp_logs';"],
  },
  explanation: {
    ko: `## DROP TABLE (테이블 삭제)\n\n\`\`\`sql\nDROP TABLE IF EXISTS temp_logs;\n\`\`\`\n\n### 핵심 개념\n- **DROP TABLE**: 테이블과 모든 데이터를 영구 삭제\n- **IF EXISTS**: 테이블이 없어도 에러 없이 진행\n- **CASCADE**: 의존하는 뷰, 외래키 등도 함께 삭제\n- **RESTRICT**: 의존 객체가 있으면 삭제 거부 (기본값)\n\n### DROP vs DELETE vs TRUNCATE\n| 명령 | 대상 | 롤백 | 속도 |\n|------|------|------|------|\n| DROP TABLE | 테이블 자체 삭제 | 불가 | 즉시 |\n| DELETE FROM | 행 삭제 (조건부) | 가능 | 느림 |\n| TRUNCATE | 모든 행 삭제 | 제한적 | 빠름 |\n\n### 주의사항\n- DROP은 **되돌릴 수 없습니다** (DDL은 자동 커밋)\n- 프로덕션에서는 반드시 백업 후 실행\n- CASCADE 사용 시 의존 객체도 함께 삭제되므로 주의`,
    en: `## DROP TABLE (Remove a Table)\n\n\`\`\`sql\nDROP TABLE IF EXISTS temp_logs;\n\`\`\`\n\n### Key Concepts\n- **DROP TABLE**: Permanently removes table and all data\n- **IF EXISTS**: No error if table doesn't exist\n- **CASCADE**: Also drop dependent views, foreign keys, etc.\n- **RESTRICT**: Refuse if dependencies exist (default)\n\n### DROP vs DELETE vs TRUNCATE\n| Command | Target | Rollback | Speed |\n|---------|--------|----------|-------|\n| DROP TABLE | Table itself | No | Instant |\n| DELETE FROM | Rows (conditional) | Yes | Slow |\n| TRUNCATE | All rows | Limited | Fast |\n\n### Caution\n- DROP is **irreversible** (DDL auto-commits)\n- Always backup before dropping in production\n- CASCADE removes dependent objects too`,
  },
  expectedQuery: {
    postgresql: "SELECT COUNT(*) AS table_exists FROM information_schema.tables WHERE table_name = 'temp_logs';",
    mysql: "SELECT COUNT(*) AS table_exists FROM information_schema.tables WHERE table_name = 'temp_logs';",
  },
  gradingMode: 'exact', relatedConcepts: ['DROP TABLE', 'IF EXISTS', 'CASCADE', 'RESTRICT', 'DDL'],
};
