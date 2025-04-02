
// This is a configuration file that would be used in a real backend
// For the frontend, we'll use mock data instead

// In a real application, you would use environment variables
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tax_portal',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
};

// Export a message to clarify usage
export const DB_INFO = {
  message: "This is a configuration file for a real backend. In this frontend application, we're using mock data instead."
};
