
import express from 'express';
import * as setupController from '../controllers/setup.controller';

const router = express.Router();

// Public routes for initial setup
router.get('/status', setupController.getSetupStatus);
router.post('/test-db', setupController.testDatabaseConnection);
router.post('/', setupController.performSetup);

export default router;
