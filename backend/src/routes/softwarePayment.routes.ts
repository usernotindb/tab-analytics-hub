
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Placeholder routes - implement controllers later
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all software payments' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get software payment ${req.params.id}` });
});

router.post('/', authorize(['admin', 'user']), (req, res) => {
  res.status(201).json({ message: 'Create software payment' });
});

router.put('/:id', authorize(['admin', 'user']), (req, res) => {
  res.status(200).json({ message: `Update software payment ${req.params.id}` });
});

router.delete('/:id', authorize(['admin']), (req, res) => {
  res.status(200).json({ message: `Delete software payment ${req.params.id}` });
});

export default router;
