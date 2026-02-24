export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type DbEngine = 'postgresql' | 'mysql';

export type GradingMode = 'exact' | 'unordered' | 'contains' | 'custom';

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
      ko: 'SELECT, WHERE, ORDER BY 등 SQL 기초를 학습합니다',
      en: 'Learn SQL basics: SELECT, WHERE, ORDER BY and more',
    },
    icon: 'Sprout',
    color: 'emerald',
    problemCount: 10,
  },
  {
    id: 'intermediate',
    label: { ko: '중급', en: 'Intermediate' },
    description: {
      ko: 'JOIN, 서브쿼리, GROUP BY 등 중급 쿼리를 학습합니다',
      en: 'Learn intermediate queries: JOIN, subqueries, GROUP BY',
    },
    icon: 'Flame',
    color: 'blue',
    problemCount: 0,
  },
  {
    id: 'advanced',
    label: { ko: '고급', en: 'Advanced' },
    description: {
      ko: 'Window Function, CTE, 쿼리 최적화를 학습합니다',
      en: 'Learn Window Functions, CTEs, query optimization',
    },
    icon: 'Zap',
    color: 'purple',
    problemCount: 0,
  },
  {
    id: 'expert',
    label: { ko: '전문가', en: 'Expert' },
    description: {
      ko: '인덱스, 성능 튜닝, 권한 관리 등 DBA 실무를 학습합니다',
      en: 'Learn DBA skills: indexing, performance tuning, permissions',
    },
    icon: 'Crown',
    color: 'amber',
    problemCount: 0,
  },
];
