import { NextRequest, NextResponse } from 'next/server';
import { validateSQL } from '@/lib/safety/sql-validator';
import { executePostgresQuery } from '@/lib/db/postgres-engine';
import { executeMysqlQuery } from '@/lib/db/mysql-engine';
import type { Level, DbEngine } from '@/types/problem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql, level, engine } = body as {
      sql: string;
      level: Level;
      engine: DbEngine;
    };

    if (!sql || !level || !engine) {
      return NextResponse.json(
        { error: 'Missing required fields: sql, level, engine' },
        { status: 400 }
      );
    }

    // Validate SQL against level permissions
    const validation = validateSQL(sql, level);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, errorKo: validation.errorKo },
        { status: 400 }
      );
    }

    // Execute query against selected engine
    let result;
    if (engine === 'postgresql') {
      result = await executePostgresQuery(sql);
    } else {
      result = await executeMysqlQuery(sql);
    }

    return NextResponse.json({
      success: true,
      result: {
        columns: result.columns,
        rows: result.rows,
        rowCount: result.rowCount,
        executionTime: result.executionTime,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 422 }
    );
  }
}
