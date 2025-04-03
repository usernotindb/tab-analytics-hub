
import express from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected by authentication
router.use(authenticate);

// Get all customers (can be filtered by status)
router.get('/', customerController.getAllCustomers);

// Get a specific customer by ID
router.get('/:id', customerController.getCustomerById);

// Create a new customer (admin and user roles only)
router.post('/', authorize(['admin', 'user']), customerController.createCustomer);

// Update an existing customer (admin and user roles only)
router.put('/:id', authorize(['admin', 'user']), customerController.updateCustomer);

// Delete a customer (admin role only)
router.delete('/:id', authorize(['admin']), customerController.deleteCustomer);

export default router;
