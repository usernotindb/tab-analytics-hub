
-- MySQL/MariaDB Schema for Tax Portal Application

-- Drop tables if they exist
DROP TABLE IF EXISTS timeline_events;
DROP TABLE IF EXISTS bank_applications;
DROP TABLE IF EXISTS software_payments;
DROP TABLE IF EXISTS portals;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zipCode VARCHAR(20),
  status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create portals table
CREATE TABLE portals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  company VARCHAR(255) NOT NULL,
  software VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  userType VARCHAR(50) NOT NULL,
  installed BOOLEAN NOT NULL DEFAULT FALSE,
  license VARCHAR(255),
  installed_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (installed)
);

-- Create software_payments table
CREATE TABLE software_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  customer VARCHAR(255) NOT NULL,
  software VARCHAR(255) NOT NULL,
  licenses INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
  purchaseDate DATE NOT NULL,
  nextBillingDate DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (status)
);

-- Create bank_applications table
CREATE TABLE bank_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT,
  customerName VARCHAR(255) NOT NULL,
  applicationType VARCHAR(100) NOT NULL,
  status ENUM('submitted', 'unsubmitted', 'processing', 'approved', 'rejected') NOT NULL DEFAULT 'unsubmitted',
  submittedDate DATE,
  amount DECIMAL(10, 2) NOT NULL,
  bankName VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX (status)
);

-- Create timeline_events table
CREATE TABLE timeline_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entityId INT NOT NULL,
  entityType ENUM('portal', 'customer', 'payment', 'application') NOT NULL,
  eventType VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy VARCHAR(255),
  INDEX (entityType, entityId)
);

-- Insert sample admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', '$2b$10$rNCvVPRQUY4hXXNzksNRW.CdQkNKAATi0EL/L6B3qpZoVzjbcx5k2', 'admin');
