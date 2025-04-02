
// MySQL/MariaDB database configuration

interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

// This would normally be loaded from environment variables
export const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tax_portal',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
};
