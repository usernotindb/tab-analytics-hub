
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Get current user
router.get('/me', (req, res) => {
  res.status(200).json({ message: 'Get current user', userId: req.user?.userId });
});

// Only admin can access user management
router.use(authorize(['admin']));

// Placeholder routes - implement controllers later
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all users' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get user ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create user' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update user ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete user ${req.params.id}` });
});

export default router;
