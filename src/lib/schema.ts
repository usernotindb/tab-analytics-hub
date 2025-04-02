
// Database schema types for the application
// These will be used for type-checking throughout the application

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Portal {
  id: number;
  userId: string;
  company: string;
  software: string;
  type: string;
  userType: string;
  installed: boolean;
  license: string;
  installed_by: string;
  created_at: string;
  updated_at: string;
}

export interface SoftwarePayment {
  id: number;
  userId: string;
  customer: string;
  software: string;
  licenses: number;
  price: number;
  status: 'paid' | 'pending' | 'overdue';
  purchaseDate: string;
  nextBillingDate: string;
  created_at: string;
  updated_at: string;
}

export interface BankApplication {
  id: number;
  customerId: number;
  customerName: string;
  applicationType: string;
  status: 'submitted' | 'unsubmitted' | 'processing' | 'approved' | 'rejected';
  submittedDate?: string;
  amount: number;
  bankName: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: number;
  entityId: number;
  entityType: 'portal' | 'customer' | 'payment' | 'application';
  eventType: string;
  description: string;
  date: string;
  createdBy: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  updated_at: string;
}
