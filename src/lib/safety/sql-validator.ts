import type { Level } from '@/types/problem';

interface ValidationResult {
  valid: boolean;
  error?: string;
  errorKo?: string;
}

const LEVEL_PERMISSIONS: Record<Level, { blocked: RegExp[]; blockedMessage: { ko: string; en: string } }> = {
  beginner: {
    blocked: [
      /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b/i,
    ],
    blockedMessage: {
      ko: '초보 레벨에서는 SELECT 문만 사용할 수 있습니다.',
      en: 'Only SELECT statements are allowed at the Beginner level.',
    },
  },
  intermediate: {
    blocked: [
      /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX)\b/i,
      /\b(ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b/i,
    ],
    blockedMessage: {
      ko: '중급 레벨에서는 해당 SQL 명령어를 사용할 수 없습니다.',
      en: 'This SQL command is not allowed at the Intermediate level.',
    },
  },
  advanced: {
    blocked: [
      /\bDROP\s+DATABASE\b/i,
      /\bTRUNCATE\b/i,
      /\b(GRANT|REVOKE)\b/i,
    ],
    blockedMessage: {
      ko: '고급 레벨에서는 해당 SQL 명령어를 사용할 수 없습니다.',
      en: 'This SQL command is not allowed at the Advanced level.',
    },
  },
  expert: {
    blocked: [/\bDROP\s+DATABASE\b/i],
    blockedMessage: {
      ko: 'DROP DATABASE는 사용할 수 없습니다.',
      en: 'DROP DATABASE is not allowed.',
    },
  },
};

export function validateSQL(sql: string, level: Level): ValidationResult {
  const trimmed = sql.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter a SQL query.',
      errorKo: 'SQL 쿼리를 입력해주세요.',
    };
  }

  // Check for multiple statements (basic check)
  const statements = trimmed
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (statements.length > 1) {
    return {
      valid: false,
      error: 'Only one SQL statement is allowed at a time.',
      errorKo: '한 번에 하나의 SQL 문만 실행할 수 있습니다.',
    };
  }

  const permissions = LEVEL_PERMISSIONS[level];

  for (const pattern of permissions.blocked) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: permissions.blockedMessage.en,
        errorKo: permissions.blockedMessage.ko,
      };
    }
  }

  return { valid: true };
}
