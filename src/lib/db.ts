
// This is a mock database module for frontend development
// In a real application, you would have a backend API instead

import { DB_INFO } from './db-config';
console.log("Using mock database:", DB_INFO.message);

// Mock query function that returns sample data
export async function query<T = any>(_sql: string, _params: any[] = []): Promise<T[]> {
  return Promise.resolve([]) as Promise<T[]>;
}

// Mock queryOne function
export async function queryOne<T = any>(_sql: string, _params: any[] = []): Promise<T | null> {
  return Promise.resolve(null) as Promise<T | null>;
}

export const checkConnection = () => {
  return Promise.resolve({ 
    connected: true, 
    message: 'Using mock database connection for frontend development' 
  });
};
