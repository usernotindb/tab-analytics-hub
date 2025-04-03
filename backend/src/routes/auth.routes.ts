
import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/verify', authenticate, authController.verifyToken);

export default router;
