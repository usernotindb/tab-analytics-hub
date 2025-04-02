
// This is a configuration file that would be used in a real backend
// For the frontend, we'll use mock data instead

// Export a message to clarify usage
export const DB_INFO = {
  message: "This is a frontend-only application using mock data. In a real application, you would connect to a backend API."
};

// These values would typically come from environment variables in a backend
// They're kept here for reference but aren't used in the frontend
export const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'user',
  password: 'password',
  database: 'tax_portal',
  connectionLimit: 10,
};
