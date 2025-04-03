
import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Query the database for the user
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const users = rows as any[];
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || '',
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
    
    // Return user info and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if email already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if ((existingUsers as any[]).length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert the new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    const insertId = (result as any).insertId;
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: insertId, role },
      process.env.JWT_SECRET || '',
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
    
    res.status(201).json({
      user: {
        id: insertId,
        name,
        email,
        role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  // This endpoint is only accessible if the authenticate middleware passes
  // So if we get here, the token is valid
  
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    const users = rows as any[];
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: users[0], valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'An error occurred during token verification' });
  }
};
