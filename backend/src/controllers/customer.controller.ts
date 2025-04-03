
import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    let query = 'SELECT * FROM customers';
    const queryParams: any[] = [];
    
    // Handle status filter
    if (req.query.status) {
      query += ' WHERE status = ?';
      queryParams.push(req.query.status);
    }
    
    // Add ordering
    query += ' ORDER BY name ASC';
    
    const [customers] = await pool.query(query, queryParams);
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    
    const [customers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );
    
    if ((customers as any[]).length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json((customers as any[])[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      status = 'active'
    } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Customer name is required' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO customers 
       (name, email, phone, address, city, state, zipCode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email || null, phone || null, address || null, city || null, state || null, zipCode || null, status]
    );
    
    const newCustomerId = (result as any).insertId;
    
    // Create timeline event
    await pool.query(
      `INSERT INTO timeline_events 
       (entityId, entityType, eventType, description, createdBy)
       VALUES (?, ?, ?, ?, ?)`,
      [
        newCustomerId,
        'customer',
        'customer_created',
        `Customer ${name} was created`,
        req.user?.userId || null
      ]
    );
    
    // Fetch the created customer to return
    const [newCustomers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [newCustomerId]
    );
    
    res.status(201).json((newCustomers as any[])[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      status
    } = req.body;
    
    // Check if customer exists
    const [customers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );
    
    if ((customers as any[]).length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const currentCustomer = (customers as any[])[0];
    
    // Update the customer
    await pool.query(
      `UPDATE customers SET
       name = ?,
       email = ?,
       phone = ?,
       address = ?,
       city = ?,
       state = ?,
       zipCode = ?,
       status = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name || currentCustomer.name,
        email !== undefined ? email : currentCustomer.email,
        phone !== undefined ? phone : currentCustomer.phone,
        address !== undefined ? address : currentCustomer.address,
        city !== undefined ? city : currentCustomer.city,
        state !== undefined ? state : currentCustomer.state,
        zipCode !== undefined ? zipCode : currentCustomer.zipCode,
        status || currentCustomer.status,
        customerId
      ]
    );
    
    // If status changed, create a timeline event
    if (status && status !== currentCustomer.status) {
      await pool.query(
        `INSERT INTO timeline_events 
         (entityId, entityType, eventType, description, createdBy)
         VALUES (?, ?, ?, ?, ?)`,
        [
          customerId,
          'customer',
          'customer_status_changed',
          `Customer ${currentCustomer.name} status changed from ${currentCustomer.status} to ${status}`,
          req.user?.userId || null
        ]
      );
    }
    
    // Fetch the updated customer to return
    const [updatedCustomers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );
    
    res.status(200).json((updatedCustomers as any[])[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    
    // Check if customer exists
    const [customers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );
    
    if ((customers as any[]).length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Delete related bank applications
    await pool.query(
      'DELETE FROM bank_applications WHERE customerId = ?',
      [customerId]
    );
    
    // Delete related timeline events
    await pool.query(
      'DELETE FROM timeline_events WHERE entityId = ? AND entityType = ?',
      [customerId, 'customer']
    );
    
    // Delete the customer
    await pool.query(
      'DELETE FROM customers WHERE id = ?',
      [customerId]
    );
    
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Failed to delete customer' });
  }
};
