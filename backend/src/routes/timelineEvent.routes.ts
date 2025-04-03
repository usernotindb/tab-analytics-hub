
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Placeholder routes - implement controllers later
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get timeline events' });
});

router.post('/', authorize(['admin', 'user']), (req, res) => {
  res.status(201).json({ message: 'Create timeline event' });
});

export default router;
