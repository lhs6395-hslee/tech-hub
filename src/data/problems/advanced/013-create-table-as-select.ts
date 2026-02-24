import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'advanced-013', level: 'advanced', order: 13,
  title: { ko: 'CTAS: 쿼리 결과로 테이블 생성', en: 'CTAS: Create Table from Query' },
  description: {
    ko: `**CREATE TABLE AS SELECT (CTAS)** 를 사용하여 고객별 주문 요약 테이블을 생성하세요.\n\n### 요구사항\n1. 먼저 CTAS 문을 실행하세요:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS customer_order_summary AS\nSELECT\n  c.id AS customer_id,\n  c.name AS customer_name,\n  COUNT(o.id) AS total_orders,\n  COALESCE(SUM(o.total_amount), 0) AS total_spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;\n\`\`\`\n\n2. 생성된 테이블을 확인하세요:\n\`\`\`sql\nSELECT column_name, data_type\nFROM information_schema.columns\nWHERE table_name = 'customer_order_summary'\nORDER BY ordinal_position;\n\`\`\`\n\n> **채점**: 2번 SELECT 쿼리의 결과로 채점됩니다.\n\n### CTAS 활용\n- 복잡한 쿼리 결과를 테이블로 저장\n- 데이터 스냅샷 생성\n- 리포팅용 요약 테이블 생성`,
    en: `Use **CREATE TABLE AS SELECT (CTAS)** to create a customer order summary table.\n\n### Requirements\n1. First, run the CTAS statement:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS customer_order_summary AS\nSELECT\n  c.id AS customer_id,\n  c.name AS customer_name,\n  COUNT(o.id) AS total_orders,\n  COALESCE(SUM(o.total_amount), 0) AS total_spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;\n\`\`\`\n\n2. Verify the created table:\n\`\`\`sql\nSELECT column_name, data_type\nFROM information_schema.columns\nWHERE table_name = 'customer_order_summary'\nORDER BY ordinal_position;\n\`\`\`\n\n> **Grading**: Based on step 2's SELECT query result.\n\n### CTAS Uses\n- Store complex query results as a table\n- Create data snapshots\n- Build summary tables for reporting`,
  },
  schema: 'ecommerce', category: 'DDL', difficulty: 2,
  hints: {
    ko: ['CREATE TABLE AS SELECT는 쿼리 결과를 새 테이블로 저장합니다.', '컬럼 타입은 쿼리 결과에서 자동으로 결정됩니다.', "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_order_summary' ORDER BY ordinal_position;"],
    en: ['CREATE TABLE AS SELECT stores query results in a new table.', 'Column types are automatically determined from the query result.', "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_order_summary' ORDER BY ordinal_position;"],
  },
  explanation: {
    ko: `## CREATE TABLE AS SELECT (CTAS)\n\n쿼리 결과를 새 테이블로 저장합니다.\n\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS customer_order_summary AS\nSELECT c.id AS customer_id, c.name AS customer_name,\n       COUNT(o.id) AS total_orders,\n       COALESCE(SUM(o.total_amount), 0) AS total_spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;\n\`\`\`\n\n### 특징\n- 쿼리 결과의 **데이터와 구조**를 모두 복사\n- 컬럼 타입은 원본 쿼리에서 자동 추론\n- **인덱스, 제약조건은 복사되지 않음** (별도 추가 필요)\n- IF NOT EXISTS로 중복 생성 방지\n\n### CTAS vs VIEW\n| 비교 | CTAS | VIEW |\n|------|------|------|\n| 데이터 저장 | 실제 데이터 저장 | 쿼리만 저장 |\n| 갱신 | 수동 (DROP + 재생성) | 자동 (실시간) |\n| 성능 | 빠름 (미리 계산) | 느릴 수 있음 |\n| 용도 | 스냅샷, 리포팅 | 실시간 조회 |\n\n### 실무 활용\n- 일별/월별 매출 요약 테이블\n- ETL 파이프라인의 중간 테이블\n- 대시보드용 집계 데이터`,
    en: `## CREATE TABLE AS SELECT (CTAS)\n\nStore query results as a new table.\n\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS customer_order_summary AS\nSELECT c.id AS customer_id, c.name AS customer_name,\n       COUNT(o.id) AS total_orders,\n       COALESCE(SUM(o.total_amount), 0) AS total_spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;\n\`\`\`\n\n### Characteristics\n- Copies both **data and structure** from query result\n- Column types auto-inferred from source query\n- **Indexes and constraints are NOT copied** (add separately)\n- IF NOT EXISTS prevents duplicate creation\n\n### CTAS vs VIEW\n| Compare | CTAS | VIEW |\n|---------|------|------|\n| Data storage | Actual data stored | Only query stored |\n| Refresh | Manual (DROP + recreate) | Automatic (real-time) |\n| Performance | Fast (pre-computed) | Can be slow |\n| Use case | Snapshots, reporting | Real-time queries |\n\n### Real-World Uses\n- Daily/monthly sales summary tables\n- Intermediate tables in ETL pipelines\n- Aggregated data for dashboards`,
  },
  expectedQuery: {
    postgresql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_order_summary' ORDER BY ordinal_position;",
    mysql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_order_summary' ORDER BY ordinal_position;",
  },
  gradingMode: 'exact', relatedConcepts: ['CREATE TABLE AS SELECT', 'CTAS', 'DDL', 'Snapshot', 'Summary Table'],
};
