
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'atsat',
  password: process.env.DB_PASSWORD || 'P@SS@word@2014',
  database: process.env.DB_NAME || 'atsat',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return false;
  }
};

export { pool, testConnection };
