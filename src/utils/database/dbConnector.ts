
// Database connection utility
import { toast } from "@/hooks/use-toast";

export interface DatabaseConfig {
  host: string;
  port: number | string;
  user: string;
  password: string;
  database: string;
}

// Store database configuration in localStorage
export const saveDbConfig = (config: DatabaseConfig): void => {
  localStorage.setItem('db_config', JSON.stringify(config));
  toast({
    title: "Database configuration saved",
    description: "Your database configuration has been saved locally.",
  });
};

// Retrieve database configuration from localStorage
export const getDbConfig = (): DatabaseConfig | null => {
  const config = localStorage.getItem('db_config');
  return config ? JSON.parse(config) : null;
};

// Test database connection with provided configuration
export const testDbConnection = async (config: DatabaseConfig): Promise<{success: boolean; message: string}> => {
  try {
    // In a real implementation, this would make an actual connection
    // using a server-side API endpoint
    
    // Simulate testing the connection
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if all fields are provided
        if (!config.host || !config.port || !config.user || !config.database) {
          resolve({
            success: false,
            message: "All connection fields must be provided"
          });
          return;
        }
        
        // For demo purposes, we're simulating a successful connection
        // In a real app, this would use an API endpoint to test the connection
        if (config.host.includes('localhost') || config.host.includes('127.0.0.1')) {
          resolve({
            success: true,
            message: "Connection successful!"
          });
        } else {
          resolve({
            success: Math.random() > 0.3, // 70% chance of success for demo
            message: Math.random() > 0.3 ? 
              "Connection successful!" : 
              "Connection failed. Please check your database credentials."
          });
        }
      }, 1500); // Simulate network delay
    });
  } catch (error) {
    console.error("Error testing database connection:", error);
    return {
      success: false,
      message: "Error testing connection: " + (error instanceof Error ? error.message : String(error))
    };
  }
};

// Check if database is configured
export const isDatabaseConfigured = (): boolean => {
  return localStorage.getItem('db_config') !== null;
};

// Clear database configuration
export const clearDbConfig = (): void => {
  localStorage.removeItem('db_config');
  toast({
    title: "Database configuration cleared",
    description: "Your database configuration has been removed.",
  });
};
