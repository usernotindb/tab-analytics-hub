
// This is a configuration file that would be used in a real backend
// For the frontend, we'll use mock data instead

// Export a message to clarify usage
export const DB_INFO = {
  message: "This is a frontend-only application using mock data. In a real application, you would connect to a backend API to access your MySQL database."
};

// Database configuration (these would be used by a backend server)
export const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'atsat',
  password: 'P@SS@word@2014',
  database: 'atsat',
  connectionLimit: 10,
};
