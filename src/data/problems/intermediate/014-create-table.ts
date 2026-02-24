import type { Problem } from '@/types/problem';

export const problem: Problem = {
  id: 'intermediate-014', level: 'intermediate', order: 14,
  title: { ko: 'CREATE TABLE: 기본 테이블 생성', en: 'CREATE TABLE: Basic Table Creation' },
  description: {
    ko: `고객 문의를 저장할 \`inquiries\` 테이블을 생성하세요.\n\n### 요구사항\n1. 먼저 아래 \`CREATE TABLE\`문을 실행하세요:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id SERIAL PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  subject VARCHAR(200) NOT NULL,\n  message TEXT,\n  status VARCHAR(20) DEFAULT 'open',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n2. 그 다음, 테이블 구조를 확인하세요:\n\`\`\`sql\nSELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_name = 'inquiries'\nORDER BY ordinal_position;\n\`\`\`\n\n> **채점**: 2번 SELECT 쿼리의 결과로 채점됩니다.\n\n### 주요 데이터 타입\n| 타입 | 설명 |\n|------|------|\n| SERIAL | 자동 증가 정수 |\n| INTEGER | 정수 |\n| VARCHAR(n) | 가변 길이 문자열 |\n| TEXT | 긴 문자열 |\n| TIMESTAMP | 날짜+시간 |`,
    en: `Create an \`inquiries\` table to store customer inquiries.\n\n### Requirements\n1. First, run this \`CREATE TABLE\` statement:\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id SERIAL PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  subject VARCHAR(200) NOT NULL,\n  message TEXT,\n  status VARCHAR(20) DEFAULT 'open',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n2. Then verify the table structure:\n\`\`\`sql\nSELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_name = 'inquiries'\nORDER BY ordinal_position;\n\`\`\`\n\n> **Grading**: Based on the result of step 2's SELECT query.\n\n### Common Data Types\n| Type | Description |\n|------|-------------|\n| SERIAL | Auto-incrementing integer |\n| INTEGER | Integer |\n| VARCHAR(n) | Variable-length string |\n| TEXT | Long string |\n| TIMESTAMP | Date + time |`,
  },
  schema: 'ecommerce', category: 'DDL', difficulty: 1,
  hints: {
    ko: ['CREATE TABLE IF NOT EXISTS로 안전하게 테이블을 생성합니다.', 'SERIAL PRIMARY KEY는 자동 증가하는 고유 식별자입니다.', "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inquiries' ORDER BY ordinal_position;"],
    en: ['Use CREATE TABLE IF NOT EXISTS for safe creation.', 'SERIAL PRIMARY KEY creates an auto-incrementing unique identifier.', "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inquiries' ORDER BY ordinal_position;"],
  },
  explanation: {
    ko: `## CREATE TABLE (기본 테이블 생성)\n\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id SERIAL PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  subject VARCHAR(200) NOT NULL,\n  message TEXT,\n  status VARCHAR(20) DEFAULT 'open',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n### 핵심 개념\n- **CREATE TABLE**: 새 테이블 정의\n- **IF NOT EXISTS**: 이미 존재하면 무시 (오류 방지)\n- **SERIAL**: PostgreSQL 자동 증가 정수 (MySQL은 AUTO_INCREMENT)\n- **PRIMARY KEY**: 고유 식별자 (NOT NULL + UNIQUE)\n- **NOT NULL**: NULL 값 불허\n- **DEFAULT**: 값 미지정시 기본값\n\n### information_schema\n- 데이터베이스의 메타데이터를 조회하는 표준 스키마\n- \`information_schema.columns\`로 테이블 구조를 확인할 수 있습니다\n\n### MySQL 차이점\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  ...\n);\n\`\`\``,
    en: `## CREATE TABLE (Basic Table Creation)\n\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id SERIAL PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  subject VARCHAR(200) NOT NULL,\n  message TEXT,\n  status VARCHAR(20) DEFAULT 'open',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n### Key Concepts\n- **CREATE TABLE**: Define a new table\n- **IF NOT EXISTS**: Skip if table already exists\n- **SERIAL**: PostgreSQL auto-increment (MySQL uses AUTO_INCREMENT)\n- **PRIMARY KEY**: Unique identifier (NOT NULL + UNIQUE)\n- **NOT NULL**: Disallow NULL values\n- **DEFAULT**: Fallback value\n\n### information_schema\n- Standard schema for querying database metadata\n- Use \`information_schema.columns\` to inspect table structure\n\n### MySQL Difference\n\`\`\`sql\nCREATE TABLE IF NOT EXISTS inquiries (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  ...\n);\n\`\`\``,
  },
  expectedQuery: {
    postgresql: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inquiries' ORDER BY ordinal_position;",
    mysql: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inquiries' ORDER BY ordinal_position;",
  },
  gradingMode: 'exact', relatedConcepts: ['CREATE TABLE', 'PRIMARY KEY', 'NOT NULL', 'DEFAULT', 'DDL', 'information_schema'],
};
