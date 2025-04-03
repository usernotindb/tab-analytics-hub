
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Token payload interface
interface TokenPayload {
  userId: number;
  role: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Authenticate middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Authorization format is invalid. Use: Bearer [token]' });
    }
    
    const token = parts[1];
    const secret = process.env.JWT_SECRET || '';
    
    if (!secret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    
    next();
  };
};
