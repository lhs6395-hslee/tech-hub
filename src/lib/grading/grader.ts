import type { QueryResult, GradingMode } from '@/types/problem';

export interface GradingResult {
  correct: boolean;
  score: number;
  message: { ko: string; en: string };
  details?: {
    expectedRowCount: number;
    actualRowCount: number;
    matchingRows: number;
    missingColumns?: string[];
    extraColumns?: string[];
  };
}

function normalizeValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  return String(val).trim().toLowerCase();
}

function rowToString(row: (string | number | boolean | null)[]): string {
  return row.map(normalizeValue).join('|');
}

export function gradeResult(
  actual: QueryResult,
  expected: QueryResult,
  mode: GradingMode
): GradingResult {
  // Step 1: Check columns
  const expectedCols = expected.columns.map((c) => c.toLowerCase());
  const actualCols = actual.columns.map((c) => c.toLowerCase());

  if (mode !== 'contains') {
    const expectedColsSorted = [...expectedCols].sort();
    const actualColsSorted = [...actualCols].sort();

    if (JSON.stringify(expectedColsSorted) !== JSON.stringify(actualColsSorted)) {
      const missingColumns = expectedCols.filter((c) => !actualCols.includes(c));
      const extraColumns = actualCols.filter((c) => !expectedCols.includes(c));

      return {
        correct: false,
        score: 20,
        message: {
          ko: '컬럼이 기대한 결과와 다릅니다.',
          en: 'Columns do not match the expected result.',
        },
        details: {
          expectedRowCount: expected.rowCount,
          actualRowCount: actual.rowCount,
          matchingRows: 0,
          missingColumns,
          extraColumns,
        },
      };
    }
  }

  // Step 2: Check row count
  if (mode !== 'contains' && actual.rowCount !== expected.rowCount) {
    return {
      correct: false,
      score: 50,
      message: {
        ko: `행 수가 다릅니다. 기대: ${expected.rowCount}행, 실제: ${actual.rowCount}행`,
        en: `Row count mismatch. Expected: ${expected.rowCount}, Actual: ${actual.rowCount}`,
      },
      details: {
        expectedRowCount: expected.rowCount,
        actualRowCount: actual.rowCount,
        matchingRows: 0,
      },
    };
  }

  // Step 3: Reorder actual columns to match expected column order
  const colMapping = expectedCols.map((col) => actualCols.indexOf(col));
  const reorderedRows = actual.rows.map((row) =>
    colMapping.map((idx) => (idx >= 0 ? row[idx] : null))
  );

  // Step 4: Compare data
  switch (mode) {
    case 'exact':
      return compareExact(reorderedRows, expected.rows, expected.rowCount);
    case 'unordered':
      return compareUnordered(reorderedRows, expected.rows, expected.rowCount);
    case 'contains':
      return compareContains(actual, expected);
    default:
      return compareUnordered(reorderedRows, expected.rows, expected.rowCount);
  }
}

function compareExact(
  actualRows: (string | number | boolean | null)[][],
  expectedRows: (string | number | boolean | null)[][],
  expectedRowCount: number
): GradingResult {
  let matchingRows = 0;

  for (let i = 0; i < expectedRows.length; i++) {
    if (rowToString(actualRows[i]) === rowToString(expectedRows[i])) {
      matchingRows++;
    }
  }

  if (matchingRows === expectedRowCount) {
    return {
      correct: true,
      score: 100,
      message: {
        ko: '정답입니다!',
        en: 'Correct!',
      },
    };
  }

  return {
    correct: false,
    score: Math.round((matchingRows / expectedRowCount) * 80) + 10,
    message: {
      ko: '데이터 또는 정렬 순서가 기대한 결과와 다릅니다.',
      en: 'Data or row ordering does not match the expected result.',
    },
    details: {
      expectedRowCount,
      actualRowCount: actualRows.length,
      matchingRows,
    },
  };
}

function compareUnordered(
  actualRows: (string | number | boolean | null)[][],
  expectedRows: (string | number | boolean | null)[][],
  expectedRowCount: number
): GradingResult {
  const expectedSet = new Set(expectedRows.map(rowToString));
  const actualSet = new Set(actualRows.map(rowToString));

  let matchingRows = 0;
  for (const row of actualSet) {
    if (expectedSet.has(row)) {
      matchingRows++;
    }
  }

  if (matchingRows === expectedRowCount && actualSet.size === expectedSet.size) {
    return {
      correct: true,
      score: 100,
      message: {
        ko: '정답입니다!',
        en: 'Correct!',
      },
    };
  }

  return {
    correct: false,
    score: Math.round((matchingRows / expectedRowCount) * 80) + 10,
    message: {
      ko: '데이터가 기대한 결과와 다릅니다.',
      en: 'Data does not match the expected result.',
    },
    details: {
      expectedRowCount,
      actualRowCount: actualRows.length,
      matchingRows,
    },
  };
}

function compareContains(
  actual: QueryResult,
  expected: QueryResult
): GradingResult {
  const expectedSet = new Set(expected.rows.map(rowToString));
  let matchingRows = 0;

  for (const row of actual.rows) {
    if (expectedSet.has(rowToString(row))) {
      matchingRows++;
    }
  }

  if (matchingRows >= expected.rowCount) {
    return {
      correct: true,
      score: 100,
      message: {
        ko: '정답입니다!',
        en: 'Correct!',
      },
    };
  }

  return {
    correct: false,
    score: Math.round((matchingRows / expected.rowCount) * 80) + 10,
    message: {
      ko: '기대한 결과가 포함되어 있지 않습니다.',
      en: 'Expected results are not fully contained in your output.',
    },
    details: {
      expectedRowCount: expected.rowCount,
      actualRowCount: actual.rowCount,
      matchingRows,
    },
  };
}
