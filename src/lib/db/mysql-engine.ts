import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      database: process.env.MYSQL_DATABASE || 'sql_practice',
      user: process.env.MYSQL_USER || 'sql_student',
      password: process.env.MYSQL_PASSWORD || 'practice123',
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      connectTimeout: 5000,
    });
  }
  return pool;
}

export async function executeMysqlQuery(sql: string): Promise<{
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTime: number;
}> {
  const connection = await getPool().getConnection();
  try {
    await connection.query('SET max_execution_time = 5000');

    const startTime = Date.now();
    const [results, fields] = await connection.query(sql);
    const executionTime = Date.now() - startTime;

    if (Array.isArray(fields) && fields.length > 0) {
      const columns = fields.map((f) => f.name);
      const rows = (results as Record<string, unknown>[]).map((row) =>
        columns.map((col) => {
          const val = row[col];
          if (val === undefined || val === null) return null;
          if (typeof val === 'bigint') return Number(val);
          if (val instanceof Date) return val.toISOString();
          return val as string | number | boolean;
        })
      );

      return {
        columns,
        rows,
        rowCount: rows.length,
        executionTime,
      };
    }

    // For non-SELECT queries (INSERT, UPDATE, DELETE)
    const resultHeader = results as mysql.ResultSetHeader;
    return {
      columns: ['affectedRows', 'insertId'],
      rows: [[resultHeader.affectedRows, resultHeader.insertId]],
      rowCount: resultHeader.affectedRows,
      executionTime,
    };
  } finally {
    connection.release();
  }
}

export async function testMysqlConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return true;
  } catch {
    return false;
  }
}
