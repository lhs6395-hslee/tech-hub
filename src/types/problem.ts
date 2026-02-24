export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'database';

export type DbEngine = 'postgresql' | 'mysql';

export type GradingMode = 'exact' | 'unordered' | 'contains' | 'custom';

export type SqlType = 'DQL' | 'DML' | 'DDL' | 'DCL' | 'TCL';

const SQL_TYPE_MAP: Record<string, SqlType> = {
  // DQL (Data Query Language) - SELECT 관련
  'SELECT': 'DQL',
  'WHERE': 'DQL',
  'ORDER BY': 'DQL',
  'LIMIT': 'DQL',
  'GROUP BY': 'DQL',
  'JOIN': 'DQL',
  'Subquery': 'DQL',
  'CASE': 'DQL',
  'Window Function': 'DQL',
  'CTE': 'DQL',
  'Set Operations': 'DQL',
  'Comprehensive': 'DQL',
  'Performance': 'DQL',
  'Monitoring': 'DQL',
  'Maintenance': 'DDL',
  // DML (Data Manipulation Language)
  'DML': 'DML',
  // DDL (Data Definition Language)
  'DDL': 'DDL',
  'Index': 'DDL',
  // DCL (Data Control Language)
  'DCL': 'DCL',
  // TCL (Transaction Control Language)
  'Transaction': 'TCL',
};

export function getSqlType(category: string): SqlType {
  return SQL_TYPE_MAP[category] || 'DQL';
}

export const SQL_TYPE_LABELS: Record<SqlType, { ko: string; en: string; color: string }> = {
  DQL: { ko: '조회', en: 'Query', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  DML: { ko: '조작', en: 'Modify', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  DDL: { ko: '정의', en: 'Define', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  DCL: { ko: '권한', en: 'Control', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  TCL: { ko: '트랜잭션', en: 'Transaction', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
};

export interface Problem {
  id: string;
  level: Level;
  order: number;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  schema: string;
  category: string;
  difficulty: 1 | 2 | 3;
  hints: { ko: string[]; en: string[] };
  explanation: { ko: string; en: string };
  expectedQuery: {
    postgresql: string;
    mysql: string;
  };
  gradingMode: GradingMode;
  allowedStatements?: string[];
  prerequisites?: string[];
  relatedConcepts: string[];
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTime?: number;
}

export interface ExecutionResponse {
  success: boolean;
  result?: QueryResult;
  error?: string;
}

export interface LevelConfig {
  id: Level;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
  problemCount: number;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 'beginner',
    label: { ko: '초보', en: 'Beginner' },
    description: {
      ko: 'SELECT, WHERE, INSERT/UPDATE/DELETE 등 SQL 기초를 학습합니다',
      en: 'Learn SQL basics: SELECT, WHERE, INSERT, UPDATE, DELETE',
    },
    icon: 'Sprout',
    color: 'emerald',
    problemCount: 15,
  },
  {
    id: 'intermediate',
    label: { ko: '중급', en: 'Intermediate' },
    description: {
      ko: 'JOIN, 서브쿼리, DML, CREATE TABLE, DROP TABLE, TRUNCATE를 학습합니다',
      en: 'Learn JOIN, subqueries, DML, CREATE TABLE, DROP TABLE, TRUNCATE',
    },
    icon: 'Flame',
    color: 'blue',
    problemCount: 16,
  },
  {
    id: 'advanced',
    label: { ko: '고급', en: 'Advanced' },
    description: {
      ko: 'Window Function, CTE, CTAS, Materialized View, ALTER TABLE 심화를 학습합니다',
      en: 'Learn Window Functions, CTEs, CTAS, Materialized Views, Advanced ALTER TABLE',
    },
    icon: 'Zap',
    color: 'purple',
    problemCount: 15,
  },
  {
    id: 'expert',
    label: { ko: '전문가', en: 'Expert' },
    description: {
      ko: '인덱스, 트리거, 시퀀스, 스키마, 권한 관리 등 DBA 실무를 학습합니다',
      en: 'Learn DBA skills: indexes, triggers, sequences, schemas, permissions',
    },
    icon: 'Crown',
    color: 'amber',
    problemCount: 16,
  },
  {
    id: 'database',
    label: { ko: 'Database', en: 'Database' },
    description: {
      ko: 'VACUUM, 모니터링, 통계, 백업 등 데이터베이스 관리를 학습합니다',
      en: 'Learn DB administration: VACUUM, monitoring, statistics, backup',
    },
    icon: 'Database',
    color: 'cyan',
    problemCount: 8,
  },
];
