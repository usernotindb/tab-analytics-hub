
// Database connection and query utilities
import mysql from 'mysql2/promise';
import { dbConfig } from './db-config';

// Create a connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: dbConfig.connectionLimit,
  queueLimit: 0
});

// Wrapper for database queries
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export const DB_INFO = {
  type: 'MySQL/MariaDB',
  version: '10.5+',
  tables: [
    'users',
    'customers',
    'portals',
    'software_payments',
    'bank_applications',
    'timeline_events'
  ]
};

// Function to check database connection
export async function checkConnection() {
  try {
    await pool.query('SELECT 1');
    return { connected: true, message: 'Successfully connected to database' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      connected: false, 
      message: error instanceof Error ? error.message : 'Failed to connect to database' 
    };
  }
}
