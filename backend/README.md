
# ATSAT API - Backend Server

This is the backend server for the ATSAT Tax Portal application. It provides API endpoints for managing customers, portals, software payments, bank applications, and more.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL/MariaDB

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on the provided `.env.example`:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your database credentials and other configuration

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE atsat;
   ```
2. Create a database user:
   ```sql
   CREATE USER 'atsat'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON atsat.* TO 'atsat'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Import the database schema:
   ```
   mysql -u atsat -p atsat < mysql-schema.sql
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Portals
- `GET /api/portals` - List all portals
- `GET /api/portals?installed=true|false` - Filter portals by installation status
- `GET /api/portals/:id` - Get portal by ID
- `POST /api/portals` - Create a new portal
- `PUT /api/portals/:id` - Update a portal
- `DELETE /api/portals/:id` - Delete a portal

### Software Payments
- `GET /api/software-payments` - List all software payments
- `GET /api/software-payments/:id` - Get payment by ID
- `POST /api/software-payments` - Create a new payment
- `PUT /api/software-payments/:id` - Update a payment
- `DELETE /api/software-payments/:id` - Delete a payment

### Bank Applications
- `GET /api/bank-applications` - List all bank applications
- `GET /api/bank-applications/:id` - Get application by ID
- `POST /api/bank-applications` - Create a new application
- `PUT /api/bank-applications/:id` - Update an application
- `DELETE /api/bank-applications/:id` - Delete an application

### Timeline Events
- `GET /api/timeline-events` - Get timeline events
- `POST /api/timeline-events` - Create a new timeline event

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

## Deployment

For production deployment, consider the following:
1. Use a process manager like PM2 to keep the application running
2. Set up Nginx as a reverse proxy
3. Configure SSL/TLS for secure communication
4. Set up proper logging and monitoring
