import { Customer, Portal, SoftwarePayment, BankApplication, TimelineEvent, User } from './schema';

// Base URL for your backend API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ats.aztecas.com/api' 
  : 'http://localhost:3001/api';

// Helper for making API requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  // You would add authentication headers here in a real application
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${getToken()}`, // You would implement getToken()
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// ------------------------
// Customer API Functions
// ------------------------

export async function getCustomers(): Promise<Customer[]> {
  return fetchWithAuth('/customers');
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  return fetchWithAuth(`/customers/${id}`);
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  return fetchWithAuth('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | null> {
  return fetchWithAuth(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
  });
}

export async function deleteCustomer(id: number): Promise<boolean> {
  await fetchWithAuth(`/customers/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// ------------------------
// Portal API Functions
// ------------------------

export async function getPortals(): Promise<Portal[]> {
  return fetchWithAuth('/portals');
}

export async function getPortalById(id: number): Promise<Portal | null> {
  return fetchWithAuth(`/portals/${id}`);
}

export async function getPortalsByStatus(installed: boolean): Promise<Portal[]> {
  return fetchWithAuth(`/portals?installed=${installed}`);
}

export async function createPortal(portal: Omit<Portal, 'id' | 'created_at' | 'updated_at'>): Promise<Portal> {
  return fetchWithAuth('/portals', {
    method: 'POST',
    body: JSON.stringify(portal),
  });
}

export async function updatePortal(id: number, portal: Partial<Portal>): Promise<Portal | null> {
  return fetchWithAuth(`/portals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(portal),
  });
}

export async function deletePortal(id: number): Promise<boolean> {
  await fetchWithAuth(`/portals/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// ------------------------
// Software Payment API Functions
// ------------------------

export async function getSoftwarePayments(): Promise<SoftwarePayment[]> {
  return fetchWithAuth('/software-payments');
}

export async function getSoftwarePaymentsByStatus(status: 'paid' | 'pending' | 'overdue'): Promise<SoftwarePayment[]> {
  return fetchWithAuth(`/software-payments?status=${status}`);
}

export async function createSoftwarePayment(payment: Omit<SoftwarePayment, 'id' | 'created_at' | 'updated_at'>): Promise<SoftwarePayment> {
  return fetchWithAuth('/software-payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

export async function updateSoftwarePayment(id: number, payment: Partial<SoftwarePayment>): Promise<SoftwarePayment | null> {
  return fetchWithAuth(`/software-payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payment),
  });
}

export async function getSoftwarePaymentById(id: number): Promise<SoftwarePayment | null> {
  return fetchWithAuth(`/software-payments/${id}`);
}

export async function deleteSoftwarePayment(id: number): Promise<boolean> {
  await fetchWithAuth(`/software-payments/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// ------------------------
// Bank Application API Functions
// ------------------------

export async function getBankApplications(): Promise<BankApplication[]> {
  return fetchWithAuth('/bank-applications');
}

export async function getBankApplicationsByStatus(status: 'submitted' | 'unsubmitted' | 'processing' | 'approved' | 'rejected'): Promise<BankApplication[]> {
  return fetchWithAuth(`/bank-applications?status=${status}`);
}

export async function getBankApplicationById(id: number): Promise<BankApplication | null> {
  return fetchWithAuth(`/bank-applications/${id}`);
}

export async function createBankApplication(application: Omit<BankApplication, 'id' | 'created_at' | 'updated_at'>): Promise<BankApplication> {
  return fetchWithAuth('/bank-applications', {
    method: 'POST',
    body: JSON.stringify(application),
  });
}

export async function updateBankApplication(id: number, application: Partial<BankApplication>): Promise<BankApplication | null> {
  return fetchWithAuth(`/bank-applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(application),
  });
}

export async function deleteBankApplication(id: number): Promise<boolean> {
  await fetchWithAuth(`/bank-applications/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// ------------------------
// Timeline API Functions
// ------------------------

export async function getTimelineEvents(entityType: string, entityId: number): Promise<TimelineEvent[]> {
  return fetchWithAuth(`/timeline-events?entityType=${entityType}&entityId=${entityId}`);
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
  return fetchWithAuth('/timeline-events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

// ------------------------
// User API Functions
// ------------------------

export async function getCurrentUser(): Promise<User | null> {
  return fetchWithAuth('/users/current');
}

export async function getUsers(): Promise<User[]> {
  return fetchWithAuth('/users');
}

export async function getUserById(id: number): Promise<User | null> {
  return fetchWithAuth(`/users/${id}`);
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  return fetchWithAuth('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function updateUser(id: number, user: Partial<User>): Promise<User | null> {
  return fetchWithAuth(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}

export async function deleteUser(id: number): Promise<boolean> {
  await fetchWithAuth(`/users/${id}`, {
    method: 'DELETE',
  });
  return true;
}
