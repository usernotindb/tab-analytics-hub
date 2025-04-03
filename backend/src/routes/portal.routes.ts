
import express from 'express';
import * as portalController from '../controllers/portal.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Get all portals (can be filtered by installed status)
router.get('/', portalController.getAllPortals);

// Get a specific portal by ID
router.get('/:id', portalController.getPortalById);

// Create a new portal (admin and user roles only)
router.post('/', authorize(['admin', 'user']), portalController.createPortal);

// Update an existing portal (admin and user roles only)
router.put('/:id', authorize(['admin', 'user']), portalController.updatePortal);

// Delete a portal (admin role only)
router.delete('/:id', authorize(['admin']), portalController.deletePortal);

export default router;
