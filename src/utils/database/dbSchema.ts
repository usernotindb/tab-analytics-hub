
// Database schema definitions for reference

// Define the schemas for our main tables
export const SCHEMA_CUSTOMERS = `
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  efin VARCHAR(50),
  company VARCHAR(100),
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  businessPhone VARCHAR(20),
  cellPhone VARCHAR(20),
  portalReady BOOLEAN DEFAULT FALSE,
  bankAppSubmitted BOOLEAN DEFAULT FALSE,
  softwarePaid BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

export const SCHEMA_USERS = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin', 'manager', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

export const SCHEMA_SETTINGS = `
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  settingName VARCHAR(50) NOT NULL UNIQUE,
  settingValue TEXT,
  category VARCHAR(50),
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

// Sample queries for reference
export const SAMPLE_QUERIES = {
  // Customers
  getAllCustomers: "SELECT * FROM customers ORDER BY lastName, firstName",
  getCustomerById: "SELECT * FROM customers WHERE id = ?",
  searchCustomers: "SELECT * FROM customers WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR company LIKE ?",
  createCustomer: "INSERT INTO customers (userId, efin, company, firstName, lastName, email, businessPhone, cellPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  updateCustomer: "UPDATE customers SET efin = ?, company = ?, firstName = ?, lastName = ?, email = ?, businessPhone = ?, cellPhone = ?, portalReady = ?, bankAppSubmitted = ?, softwarePaid = ? WHERE id = ?",
  deleteCustomer: "DELETE FROM customers WHERE id = ?",
  
  // Users
  getAllUsers: "SELECT id, username, firstName, lastName, email, role FROM users",
  getUserById: "SELECT id, username, firstName, lastName, email, role FROM users WHERE id = ?",
  createUser: "INSERT INTO users (username, password, firstName, lastName, email, role) VALUES (?, ?, ?, ?, ?, ?)",
  
  // Settings
  getAllSettings: "SELECT * FROM settings",
  getSettingsByCategory: "SELECT * FROM settings WHERE category = ?",
  updateSetting: "INSERT INTO settings (settingName, settingValue, category) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE settingValue = ?",
};
