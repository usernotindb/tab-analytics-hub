
// This is a mock database module for frontend development
// In a real application, you would have a backend API instead

import { DB_INFO } from './db-config';
console.log("Using mock database:", DB_INFO.message);

// Mock query function that simulates a database query with Promise
export async function query<T = any>(_sql: string, _params: any[] = []): Promise<T[]> {
  // In a browser environment, we can't use actual database connections
  // So we'll return mock data or empty arrays
  return Promise.resolve([]) as Promise<T[]>;
}

// Mock queryOne function that simulates retrieving a single record
export async function queryOne<T = any>(_sql: string, _params: any[] = []): Promise<T | null> {
  // In a browser environment, we can't use actual database connections
  return Promise.resolve(null) as Promise<T | null>;
}

// Mock function to check connection
export const checkConnection = () => {
  return Promise.resolve({ 
    connected: true, 
    message: 'Using mock database connection for frontend development' 
  });
};
