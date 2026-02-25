export const ko = {
  common: {
    appName: 'SQL-DBA 학습 플랫폼',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    close: '닫기',
    reset: '초기화',
    submit: '제출',
  },
  nav: {
    home: '홈',
    levels: '레벨',
    docs: '이론학습',
    progress: '진행도',
    settings: '설정',
  },
  home: {
    hero: {
      title: 'SQL 마스터가 되는 여정',
      subtitle: '실제 데이터베이스에서 SQL을 실행하고, 채점받고, 학습하세요',
      startButton: '학습 시작하기',
    },
    levelSection: {
      title: '학습 레벨',
      subtitle: '단계별로 SQL 실력을 향상시키세요',
    },
  },
  level: {
    beginner: '초보',
    intermediate: '중급',
    advanced: '고급',
    expert: '전문가',
    problems: '문제',
    completed: '완료',
    locked: '잠김',
    unlockRequirement: '이전 레벨을 80% 이상 완료하면 잠금 해제됩니다',
  },
  problem: {
    description: '문제 설명',
    sqlEditor: 'SQL 편집기',
    run: '실행',
    runShortcut: 'Ctrl+Enter',
    checkAnswer: '정답 확인',
    hint: '힌트 보기',
    hintCount: '힌트 {{current}}/{{total}}',
    explanation: '해설',
    result: '실행 결과',
    expected: '예상 결과',
    schema: '테이블 구조',
    noResult: '쿼리를 실행해주세요',
    writeQuery: 'SQL 쿼리를 작성하세요...',
  },
  grading: {
    correct: '정답입니다!',
    incorrect: '오답입니다',
    partialMatch: '부분 일치',
    wrongColumns: '컬럼이 기대한 결과와 다릅니다',
    wrongRowCount: '행 수가 다릅니다. 기대: {{expected}}행, 실제: {{actual}}행',
    wrongData: '데이터가 기대한 결과와 다릅니다',
    executionError: '실행 오류',
    tryAgain: '다시 시도해보세요',
    nextProblem: '다음 문제',
    viewExplanation: '해설 보기',
  },
  settings: {
    dbEngine: '데이터베이스 엔진',
    language: '언어',
    theme: '테마',
    light: '라이트',
    dark: '다크',
    system: '시스템',
  },
  db: {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    connectionError: '데이터베이스 연결에 실패했습니다. Docker가 실행 중인지 확인해주세요.',
  },
} as const;

// Use a recursive type that allows any string values while preserving structure
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationKeys = DeepStringify<typeof ko>;
