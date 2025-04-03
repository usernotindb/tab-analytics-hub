
// This is a mock database module for frontend development
// In a real application, you would have a backend API instead

import { DB_INFO } from './db-config';
console.log("Using mock database:", DB_INFO.message);

// Mock query function that simulates a database query with Promise
export async function query<T = any>(_sql: string, _params: any[] = []): Promise<T[]> {
  // In a browser environment, we can't use actual database connections
  // So we'll return mock data or empty arrays
  console.log("Query attempted:", _sql, "with params:", _params);
  console.log("NOTE: This is a frontend-only mock. To use your MySQL database (atsat), you'll need a backend API.");
  return Promise.resolve([]) as Promise<T[]>;
}

// Mock queryOne function that simulates retrieving a single record
export async function queryOne<T = any>(_sql: string, _params: any[] = []): Promise<T | null> {
  // In a browser environment, we can't use actual database connections
  console.log("Single query attempted:", _sql, "with params:", _params);
  console.log("NOTE: This is a frontend-only mock. To use your MySQL database (atsat), you'll need a backend API.");
  return Promise.resolve(null) as Promise<T | null>;
}

// Mock function to check connection
export const checkConnection = () => {
  console.log("Connection check attempted to database:", "atsat");
  console.log("NOTE: This is a frontend-only mock. To use your MySQL database, you'll need a backend API.");
  return Promise.resolve({ 
    connected: true, 
    message: 'Using mock database connection for frontend development. Your actual MySQL database (atsat) would require a backend API.' 
  });
};
