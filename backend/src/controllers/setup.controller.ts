
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Path to the .env file
const envPath = path.resolve(__dirname, '../../.env');

// Check if the system has been configured already
export const getSetupStatus = async (req: Request, res: Response) => {
  try {
    // Check if .env file exists and has required values
    const envFileExists = fs.existsSync(envPath);
    if (!envFileExists) {
      return res.json({ configured: false });
    }

    // Check if we can connect to the database
    try {
      dotenv.config();
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0
      });

      const connection = await pool.getConnection();
      
      // Check if the users table exists and has at least one user
      const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
      const userCount = (rows as any[])[0].count;
      
      connection.release();
      
      return res.json({ configured: userCount > 0 });
    } catch (error) {
      return res.json({ configured: false });
    }
  } catch (error) {
    console.error('Error checking setup status:', error);
    return res.status(500).json({ message: 'Error checking setup status' });
  }
};

// Test database connection
export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    const { host, port, user, password, database } = req.body;
    
    // Create a connection to test
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database
    });
    
    // Test the connection
    await connection.ping();
    
    // Close the connection
    await connection.end();
    
    return res.json({ success: true, message: 'Connection successful' });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return res.status(500).json({ success: false, message: 'Connection failed' });
  }
};

// Perform the setup
export const performSetup = async (req: Request, res: Response) => {
  try {
    const { database, admin } = req.body;
    
    // Connect to the database
    const connection = await mysql.createConnection({
      host: database.host,
      port: database.port,
      user: database.user,
      password: database.password,
      database: database.database
    });
    
    // Create .env file with the database configuration
    const envContent = `
# Database Configuration
DB_HOST=${database.host}
DB_PORT=${database.port}
DB_USER=${database.user}
DB_PASSWORD=${database.password}
DB_NAME=${database.database}

# JWT Configuration
JWT_SECRET=${generateSecureToken(32)}
JWT_EXPIRY=24h

# Server Configuration
PORT=3001
NODE_ENV=production
`;

    // Write the .env file
    fs.writeFileSync(envPath, envContent.trim());
    
    // Check if the users table exists
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      console.log('Table already exists, continuing...');
    }
    
    // Hash the admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
    
    // Check if admin user already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [admin.email]
    );
    
    if ((existingUsers as any[]).length > 0) {
      // Update existing admin
      await connection.query(
        'UPDATE users SET name = ?, password = ?, role = "admin" WHERE email = ?',
        [admin.name, hashedPassword, admin.email]
      );
    } else {
      // Create admin user
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "admin")',
        [admin.name, admin.email, hashedPassword]
      );
    }
    
    // Close the connection
    await connection.end();
    
    return res.json({ success: true, message: 'Setup completed successfully' });
  } catch (error) {
    console.error('Setup failed:', error);
    return res.status(500).json({ success: false, message: 'Setup failed' });
  }
};

// Helper function to generate secure token for JWT_SECRET
function generateSecureToken(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  
  return token;
}
