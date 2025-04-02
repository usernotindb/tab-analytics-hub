
import { Customer, Portal, SoftwarePayment, BankApplication, TimelineEvent, User } from './schema';

// ------------------------
// Mock Data
// ------------------------

// Sample customers data
const customersData: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    status: "active",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave",
    city: "Somewhere",
    state: "NY",
    zipCode: "67890",
    status: "active",
    created_at: new Date(2023, 1, 20).toISOString(),
    updated_at: new Date(2023, 1, 20).toISOString()
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "555-555-5555",
    address: "789 Pine Rd",
    city: "Nowhere",
    state: "TX",
    zipCode: "54321",
    status: "inactive",
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 3, 15).toISOString()
  }
];

// Sample portals data
const portalsData: Portal[] = [
  {
    id: 1,
    userId: "14545807",
    company: "Azteca Tax Systems",
    software: "Xlink",
    type: "Desktop",
    userType: "Master User",
    installed: true,
    license: "1040 License",
    installed_by: "John Doe",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 2,
    userId: "14545808",
    company: "Global Tax Solutions",
    software: "TaxWeb",
    type: "Online",
    userType: "Admin",
    installed: true,
    license: "Full Service",
    installed_by: "Jane Smith",
    created_at: new Date(2023, 1, 10).toISOString(),
    updated_at: new Date(2023, 1, 10).toISOString()
  },
  {
    id: 3,
    userId: "14545809",
    company: "Premier Tax Services",
    software: "TaxPro",
    type: "Desktop",
    userType: "Standard User",
    installed: false,
    license: "1040 License",
    installed_by: "N/A",
    created_at: new Date(2023, 2, 5).toISOString(),
    updated_at: new Date(2023, 2, 5).toISOString()
  }
];

// Sample software payments data
const softwarePaymentsData: SoftwarePayment[] = [
  {
    id: 1,
    userId: "14545807",
    customer: "Azteca Tax Systems",
    software: "TaxPro Premium",
    licenses: 3,
    price: 599.99,
    status: 'paid',
    purchaseDate: "2023-01-15",
    nextBillingDate: "2024-01-15",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 2,
    userId: "14545808",
    customer: "Global Tax Solutions",
    software: "TaxWeb Enterprise",
    licenses: 5,
    price: 1299.99,
    status: 'pending',
    purchaseDate: "2023-03-10",
    nextBillingDate: "2024-03-10",
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 2, 10).toISOString()
  },
  {
    id: 3,
    userId: "14545809",
    customer: "Premier Tax Services",
    software: "TaxPro Basic",
    licenses: 2,
    price: 299.99,
    status: 'overdue',
    purchaseDate: "2023-02-20",
    nextBillingDate: "2024-02-20",
    created_at: new Date(2023, 1, 20).toISOString(),
    updated_at: new Date(2023, 1, 20).toISOString()
  }
];

// Sample bank applications data
const bankApplicationsData: BankApplication[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Smith",
    applicationType: "Business Loan",
    status: "submitted",
    submittedDate: "2023-01-20",
    amount: 50000,
    bankName: "First National Bank",
    notes: "Application for business expansion",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 0, 20).toISOString()
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Jane Doe",
    applicationType: "Personal Loan",
    status: "unsubmitted",
    submittedDate: null,
    amount: 10000,
    bankName: "City Credit Union",
    notes: "Home renovation loan",
    created_at: new Date(2023, 1, 5).toISOString(),
    updated_at: new Date(2023, 1, 5).toISOString()
  },
  {
    id: 3,
    customerId: 3,
    customerName: "Bob Johnson",
    applicationType: "Mortgage",
    status: "processing",
    submittedDate: "2023-03-15",
    amount: 250000,
    bankName: "Home Lenders Inc",
    notes: "30-year fixed rate mortgage",
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 2, 15).toISOString()
  },
  {
    id: 4,
    customerId: 1,
    customerName: "John Smith",
    applicationType: "Line of Credit",
    status: "unsubmitted",
    submittedDate: null,
    amount: 25000,
    bankName: "Business Bank",
    notes: "Seasonal inventory financing",
    created_at: new Date(2023, 3, 1).toISOString(),
    updated_at: new Date(2023, 3, 1).toISOString()
  }
];

// Sample timeline events data
const timelineEventsData: TimelineEvent[] = [
  {
    id: 1,
    entityId: 1,
    entityType: "customer",
    eventType: "created",
    description: "Customer account created",
    date: new Date(2023, 0, 15).toISOString(),
    createdBy: "admin"
  },
  {
    id: 2,
    entityId: 1,
    entityType: "bank_application",
    eventType: "submitted",
    description: "Loan application submitted to First National Bank",
    date: new Date(2023, 0, 20).toISOString(),
    createdBy: "admin"
  },
  {
    id: 3,
    entityId: 2,
    entityType: "customer",
    eventType: "updated",
    description: "Customer information updated",
    date: new Date(2023, 1, 20).toISOString(),
    createdBy: "admin"
  }
];

// Sample users data
const usersData: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    created_at: new Date(2022, 11, 1).toISOString(),
    updated_at: new Date(2022, 11, 1).toISOString()
  },
  {
    id: 2,
    name: "Staff User",
    email: "staff@example.com",
    role: "staff",
    created_at: new Date(2023, 0, 10).toISOString(),
    updated_at: new Date(2023, 0, 10).toISOString()
  }
];

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ------------------------
// Customer API Functions
// ------------------------

export async function getCustomers(): Promise<Customer[]> {
  await delay(500); // Simulate network delay
  return [...customersData];
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  await delay(300);
  return customersData.find(customer => customer.id === id) || null;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  await delay(500);
  const newCustomer: Customer = {
    id: Math.max(0, ...customersData.map(c => c.id)) + 1,
    ...customer,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  customersData.push(newCustomer);
  return newCustomer;
}

export async function updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | null> {
  await delay(500);
  const index = customersData.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  const updatedCustomer: Customer = {
    ...customersData[index],
    ...customer,
    updated_at: new Date().toISOString()
  };
  
  customersData[index] = updatedCustomer;
  return updatedCustomer;
}

export async function deleteCustomer(id: number): Promise<boolean> {
  await delay(500);
  const initialLength = customersData.length;
  const index = customersData.findIndex(c => c.id === id);
  
  if (index !== -1) {
    customersData.splice(index, 1);
  }
  
  return customersData.length < initialLength;
}

// ------------------------
// Portal API Functions
// ------------------------

export async function getPortals(): Promise<Portal[]> {
  await delay(500);
  return [...portalsData];
}

export async function getPortalById(id: number): Promise<Portal | null> {
  await delay(300);
  return portalsData.find(portal => portal.id === id) || null;
}

export async function getPortalsByStatus(installed: boolean): Promise<Portal[]> {
  await delay(500);
  return portalsData.filter(portal => portal.installed === installed);
}

export async function createPortal(portal: Omit<Portal, 'id' | 'created_at' | 'updated_at'>): Promise<Portal> {
  await delay(500);
  const newPortal: Portal = {
    id: Math.max(0, ...portalsData.map(p => p.id)) + 1,
    ...portal,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  portalsData.push(newPortal);
  return newPortal;
}

export async function updatePortal(id: number, portal: Partial<Portal>): Promise<Portal | null> {
  await delay(500);
  const index = portalsData.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedPortal: Portal = {
    ...portalsData[index],
    ...portal,
    updated_at: new Date().toISOString()
  };
  
  portalsData[index] = updatedPortal;
  return updatedPortal;
}

export async function deletePortal(id: number): Promise<boolean> {
  await delay(500);
  const initialLength = portalsData.length;
  const index = portalsData.findIndex(p => p.id === id);
  
  if (index !== -1) {
    portalsData.splice(index, 1);
  }
  
  return portalsData.length < initialLength;
}

// ------------------------
// Software Payment API Functions
// ------------------------

export async function getSoftwarePayments(): Promise<SoftwarePayment[]> {
  await delay(500);
  return [...softwarePaymentsData];
}

export async function getSoftwarePaymentsByStatus(status: 'paid' | 'pending' | 'overdue'): Promise<SoftwarePayment[]> {
  await delay(500);
  return softwarePaymentsData.filter(payment => payment.status === status);
}

export async function createSoftwarePayment(payment: Omit<SoftwarePayment, 'id' | 'created_at' | 'updated_at'>): Promise<SoftwarePayment> {
  await delay(500);
  const newPayment: SoftwarePayment = {
    id: Math.max(0, ...softwarePaymentsData.map(p => p.id)) + 1,
    ...payment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  softwarePaymentsData.push(newPayment);
  return newPayment;
}

export async function updateSoftwarePayment(id: number, payment: Partial<SoftwarePayment>): Promise<SoftwarePayment | null> {
  await delay(500);
  const index = softwarePaymentsData.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedPayment: SoftwarePayment = {
    ...softwarePaymentsData[index],
    ...payment,
    updated_at: new Date().toISOString()
  };
  
  softwarePaymentsData[index] = updatedPayment;
  return updatedPayment;
}

export async function getSoftwarePaymentById(id: number): Promise<SoftwarePayment | null> {
  await delay(300);
  return softwarePaymentsData.find(payment => payment.id === id) || null;
}

export async function deleteSoftwarePayment(id: number): Promise<boolean> {
  await delay(500);
  const initialLength = softwarePaymentsData.length;
  const index = softwarePaymentsData.findIndex(p => p.id === id);
  
  if (index !== -1) {
    softwarePaymentsData.splice(index, 1);
  }
  
  return softwarePaymentsData.length < initialLength;
}

// ------------------------
// Bank Application API Functions
// ------------------------

export async function getBankApplications(): Promise<BankApplication[]> {
  await delay(500);
  return [...bankApplicationsData];
}

export async function getBankApplicationsByStatus(status: 'submitted' | 'unsubmitted' | 'processing' | 'approved' | 'rejected'): Promise<BankApplication[]> {
  await delay(500);
  return bankApplicationsData.filter(app => app.status === status);
}

export async function getBankApplicationById(id: number): Promise<BankApplication | null> {
  await delay(300);
  return bankApplicationsData.find(app => app.id === id) || null;
}

export async function createBankApplication(application: Omit<BankApplication, 'id' | 'created_at' | 'updated_at'>): Promise<BankApplication> {
  await delay(500);
  const newApplication: BankApplication = {
    id: Math.max(0, ...bankApplicationsData.map(a => a.id)) + 1,
    ...application,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  bankApplicationsData.push(newApplication);
  return newApplication;
}

export async function updateBankApplication(id: number, application: Partial<BankApplication>): Promise<BankApplication | null> {
  await delay(500);
  const index = bankApplicationsData.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  const updatedApplication: BankApplication = {
    ...bankApplicationsData[index],
    ...application,
    updated_at: new Date().toISOString()
  };
  
  bankApplicationsData[index] = updatedApplication;
  return updatedApplication;
}

export async function deleteBankApplication(id: number): Promise<boolean> {
  await delay(500);
  const initialLength = bankApplicationsData.length;
  const index = bankApplicationsData.findIndex(a => a.id === id);
  
  if (index !== -1) {
    bankApplicationsData.splice(index, 1);
  }
  
  return bankApplicationsData.length < initialLength;
}

// ------------------------
// Timeline API Functions
// ------------------------

export async function getTimelineEvents(entityType: string, entityId: number): Promise<TimelineEvent[]> {
  await delay(500);
  return timelineEventsData.filter(event => event.entityType === entityType && event.entityId === entityId);
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
  await delay(500);
  const newEvent: TimelineEvent = {
    id: Math.max(0, ...timelineEventsData.map(e => e.id)) + 1,
    ...event
  };
  
  timelineEventsData.push(newEvent);
  return newEvent;
}

// ------------------------
// User API Functions
// ------------------------

export async function getCurrentUser(): Promise<User | null> {
  await delay(300);
  return usersData.find(user => user.role === 'admin') || null;
}

export async function getUsers(): Promise<User[]> {
  await delay(500);
  return [...usersData];
}

export async function getUserById(id: number): Promise<User | null> {
  await delay(300);
  return usersData.find(user => user.id === id) || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  await delay(500);
  const newUser: User = {
    id: Math.max(0, ...usersData.map(u => u.id)) + 1,
    ...user,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  usersData.push(newUser);
  return newUser;
}

export async function updateUser(id: number, user: Partial<User>): Promise<User | null> {
  await delay(500);
  const index = usersData.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  const updatedUser: User = {
    ...usersData[index],
    ...user,
    updated_at: new Date().toISOString()
  };
  
  usersData[index] = updatedUser;
  return updatedUser;
}

export async function deleteUser(id: number): Promise<boolean> {
  await delay(500);
  const initialLength = usersData.length;
  const index = usersData.findIndex(u => u.id === id);
  
  if (index !== -1) {
    usersData.splice(index, 1);
  }
  
  return usersData.length < initialLength;
}
