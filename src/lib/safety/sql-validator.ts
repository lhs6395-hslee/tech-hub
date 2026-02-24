import type { Level } from '@/types/problem';

interface ValidationResult {
  valid: boolean;
  error?: string;
  errorKo?: string;
}

const LEVEL_PERMISSIONS: Record<Level, { blocked: RegExp[]; blockedMessage: { ko: string; en: string }; allowMultiStatement?: boolean }> = {
  beginner: {
    // 초보: SELECT + 기본 DML (INSERT, UPDATE, DELETE) 허용. DDL/권한/트랜잭션 차단.
    blocked: [
      /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b/i,
      /\b(ALTER|CREATE|TRUNCATE|GRANT|REVOKE)\b/i,
      /\b(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION)\b/i,
    ],
    blockedMessage: {
      ko: '초보 레벨에서는 SELECT, INSERT, UPDATE, DELETE만 사용할 수 있습니다.',
      en: 'Only SELECT, INSERT, UPDATE, DELETE are allowed at the Beginner level.',
    },
  },
  intermediate: {
    // 중급: SELECT + DML + 기본 DDL (CREATE TABLE, DROP TABLE, TRUNCATE) 허용. 권한/트랜잭션 차단.
    blocked: [
      /\bDROP\s+(DATABASE|SCHEMA|INDEX|VIEW)\b/i,
      /\b(ALTER|GRANT|REVOKE)\b/i,
      /\bCREATE\s+(INDEX|VIEW|SCHEMA|SEQUENCE|TRIGGER|FUNCTION|PROCEDURE)\b/i,
      /\b(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION)\b/i,
    ],
    blockedMessage: {
      ko: '중급 레벨에서는 SELECT, DML, CREATE TABLE, DROP TABLE, TRUNCATE를 사용할 수 있습니다.',
      en: 'SELECT, DML, CREATE TABLE, DROP TABLE, and TRUNCATE are allowed at the Intermediate level.',
    },
  },
  advanced: {
    // 고급: SELECT + DML + DDL (CREATE TABLE/VIEW/INDEX, ALTER TABLE, TRUNCATE) 허용. 권한/DROP DATABASE 차단.
    blocked: [
      /\bDROP\s+DATABASE\b/i,
      /\b(GRANT|REVOKE)\b/i,
    ],
    blockedMessage: {
      ko: '고급 레벨에서는 GRANT, REVOKE, DROP DATABASE를 사용할 수 없습니다.',
      en: 'GRANT, REVOKE, and DROP DATABASE are not allowed at the Advanced level.',
    },
  },
  expert: {
    // 전문가: 거의 모든 것 허용. DROP DATABASE만 차단. 트랜잭션(multi-statement) 허용.
    blocked: [/\bDROP\s+DATABASE\b/i],
    allowMultiStatement: true,
    blockedMessage: {
      ko: 'DROP DATABASE는 사용할 수 없습니다.',
      en: 'DROP DATABASE is not allowed.',
    },
  },
  database: {
    // Database: 모든 것 허용. DROP DATABASE만 차단. 멀티 스테이트먼트 허용.
    blocked: [/\bDROP\s+DATABASE\b/i],
    allowMultiStatement: true,
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

  const permissions = LEVEL_PERMISSIONS[level];

  // Check for multiple statements
  const statements = trimmed
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (statements.length > 1 && !permissions.allowMultiStatement) {
    return {
      valid: false,
      error: 'Only one SQL statement is allowed at a time.',
      errorKo: '한 번에 하나의 SQL 문만 실행할 수 있습니다.',
    };
  }

  // Check blocked patterns against each statement
  for (const stmt of statements) {
    for (const pattern of permissions.blocked) {
      if (pattern.test(stmt)) {
        return {
          valid: false,
          error: permissions.blockedMessage.en,
          errorKo: permissions.blockedMessage.ko,
        };
      }
    }
  }

  return { valid: true };
}
