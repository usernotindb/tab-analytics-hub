
import { Customer, Portal, SoftwarePayment, BankApplication, TimelineEvent, User } from './schema';
import { query, queryOne } from './db';

// ------------------------
// Customer API Functions
// ------------------------

export async function getCustomers(): Promise<Customer[]> {
  return await query<Customer>('SELECT * FROM customers ORDER BY created_at DESC');
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  return await queryOne<Customer>('SELECT * FROM customers WHERE id = ?', [id]);
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  const result = await query(
    'INSERT INTO customers (name, email, phone, address, city, state, zipCode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [customer.name, customer.email, customer.phone, customer.address, customer.city, customer.state, customer.zipCode, customer.status]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...customer,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | null> {
  const updates = Object.entries(customer)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([key]) => `${key} = ?`);
  
  if (updates.length === 0) return null;
  
  const values = Object.entries(customer)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([_, value]) => value);
  
  const sqlQuery = `UPDATE customers SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await query(sqlQuery, [...values, id]);
  
  return await getCustomerById(id);
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const result = await query('DELETE FROM customers WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
}

// ------------------------
// Portal API Functions
// ------------------------

export async function getPortals(): Promise<Portal[]> {
  return await query<Portal>('SELECT * FROM portals ORDER BY created_at DESC');
}

export async function getPortalById(id: number): Promise<Portal | null> {
  return await queryOne<Portal>('SELECT * FROM portals WHERE id = ?', [id]);
}

export async function getPortalsByStatus(installed: boolean): Promise<Portal[]> {
  return await query<Portal>('SELECT * FROM portals WHERE installed = ?', [installed]);
}

export async function createPortal(portal: Omit<Portal, 'id' | 'created_at' | 'updated_at'>): Promise<Portal> {
  const result = await query(
    'INSERT INTO portals (userId, company, software, type, userType, installed, license, installed_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [portal.userId, portal.company, portal.software, portal.type, portal.userType, portal.installed, portal.license, portal.installed_by]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...portal,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updatePortal(id: number, portal: Partial<Portal>): Promise<Portal | null> {
  const updates = Object.entries(portal)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([key]) => `${key} = ?`);
  
  if (updates.length === 0) return null;
  
  const values = Object.entries(portal)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([_, value]) => value);
  
  const sqlQuery = `UPDATE portals SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await query(sqlQuery, [...values, id]);
  
  return await getPortalById(id);
}

export async function deletePortal(id: number): Promise<boolean> {
  const result = await query('DELETE FROM portals WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
}

// ------------------------
// Software Payment API Functions
// ------------------------

export async function getSoftwarePayments(): Promise<SoftwarePayment[]> {
  return await query<SoftwarePayment>('SELECT * FROM software_payments ORDER BY created_at DESC');
}

export async function getSoftwarePaymentsByStatus(status: 'paid' | 'pending' | 'overdue'): Promise<SoftwarePayment[]> {
  return await query<SoftwarePayment>('SELECT * FROM software_payments WHERE status = ?', [status]);
}

export async function createSoftwarePayment(payment: Omit<SoftwarePayment, 'id' | 'created_at' | 'updated_at'>): Promise<SoftwarePayment> {
  const result = await query(
    'INSERT INTO software_payments (userId, customer, software, licenses, price, status, purchaseDate, nextBillingDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [payment.userId, payment.customer, payment.software, payment.licenses, payment.price, payment.status, payment.purchaseDate, payment.nextBillingDate]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...payment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updateSoftwarePayment(id: number, payment: Partial<SoftwarePayment>): Promise<SoftwarePayment | null> {
  const updates = Object.entries(payment)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([key]) => `${key} = ?`);
  
  if (updates.length === 0) return null;
  
  const values = Object.entries(payment)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([_, value]) => value);
  
  const sqlQuery = `UPDATE software_payments SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await query(sqlQuery, [...values, id]);
  
  return await getSoftwarePaymentById(id);
}

export async function getSoftwarePaymentById(id: number): Promise<SoftwarePayment | null> {
  return await queryOne<SoftwarePayment>('SELECT * FROM software_payments WHERE id = ?', [id]);
}

export async function deleteSoftwarePayment(id: number): Promise<boolean> {
  const result = await query('DELETE FROM software_payments WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
}

// ------------------------
// Bank Application API Functions
// ------------------------

export async function getBankApplications(): Promise<BankApplication[]> {
  return await query<BankApplication>('SELECT * FROM bank_applications ORDER BY created_at DESC');
}

export async function getBankApplicationsByStatus(status: 'submitted' | 'unsubmitted' | 'processing' | 'approved' | 'rejected'): Promise<BankApplication[]> {
  return await query<BankApplication>('SELECT * FROM bank_applications WHERE status = ?', [status]);
}

export async function getBankApplicationById(id: number): Promise<BankApplication | null> {
  return await queryOne<BankApplication>('SELECT * FROM bank_applications WHERE id = ?', [id]);
}

export async function createBankApplication(application: Omit<BankApplication, 'id' | 'created_at' | 'updated_at'>): Promise<BankApplication> {
  const result = await query(
    'INSERT INTO bank_applications (customerId, customerName, applicationType, status, submittedDate, amount, bankName, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [application.customerId, application.customerName, application.applicationType, application.status, application.submittedDate, application.amount, application.bankName, application.notes]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...application,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updateBankApplication(id: number, application: Partial<BankApplication>): Promise<BankApplication | null> {
  const updates = Object.entries(application)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([key]) => `${key} = ?`);
  
  if (updates.length === 0) return null;
  
  const values = Object.entries(application)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([_, value]) => value);
  
  const sqlQuery = `UPDATE bank_applications SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await query(sqlQuery, [...values, id]);
  
  return await getBankApplicationById(id);
}

export async function deleteBankApplication(id: number): Promise<boolean> {
  const result = await query('DELETE FROM bank_applications WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
}

// ------------------------
// Timeline API Functions
// ------------------------

export async function getTimelineEvents(entityType: string, entityId: number): Promise<TimelineEvent[]> {
  return await query<TimelineEvent>(
    'SELECT * FROM timeline_events WHERE entityType = ? AND entityId = ? ORDER BY date DESC',
    [entityType, entityId]
  );
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
  const result = await query(
    'INSERT INTO timeline_events (entityId, entityType, eventType, description, date, createdBy) VALUES (?, ?, ?, ?, ?, ?)',
    [event.entityId, event.entityType, event.eventType, event.description, event.date, event.createdBy]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...event
  };
}

// ------------------------
// User API Functions
// ------------------------

export async function getCurrentUser(): Promise<User | null> {
  // This would typically use some auth token to get the current user
  // For demo purposes, return the first admin user
  return await queryOne<User>('SELECT * FROM users WHERE role = ? LIMIT 1', ['admin']);
}

export async function getUsers(): Promise<User[]> {
  return await query<User>('SELECT * FROM users ORDER BY created_at DESC');
}

export async function getUserById(id: number): Promise<User | null> {
  return await queryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const result = await query(
    'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
    [user.name, user.email, user.role]
  );
  
  const insertId = result[0].insertId;
  return {
    id: insertId,
    ...user,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function updateUser(id: number, user: Partial<User>): Promise<User | null> {
  const updates = Object.entries(user)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([key]) => `${key} = ?`);
  
  if (updates.length === 0) return null;
  
  const values = Object.entries(user)
    .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
    .map(([_, value]) => value);
  
  const sqlQuery = `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  await query(sqlQuery, [...values, id]);
  
  return await getUserById(id);
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await query('DELETE FROM users WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
}
