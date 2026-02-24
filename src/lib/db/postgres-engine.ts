import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432'),
      database: process.env.PG_DATABASE || 'sql_practice',
      user: process.env.PG_USER || 'sql_student',
      password: process.env.PG_PASSWORD || 'practice123',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function executePostgresQuery(sql: string): Promise<{
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTime: number;
}> {
  const client = await getPool().connect();
  try {
    await client.query('SET statement_timeout = 5000');

    const startTime = Date.now();
    const result = await client.query(sql);
    const executionTime = Date.now() - startTime;

    const columns = result.fields?.map((f) => f.name) || [];
    const rows = result.rows?.map((row) => columns.map((col) => row[col])) || [];

    return {
      columns,
      rows,
      rowCount: result.rowCount ?? rows.length,
      executionTime,
    };
  } finally {
    client.release();
  }
}

export async function testPostgresConnection(): Promise<boolean> {
  try {
    const client = await getPool().connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch {
    return false;
  }
}
