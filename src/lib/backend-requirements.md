
# Backend Implementation Requirements

This document outlines the requirements for implementing a backend server to connect this frontend application to the MySQL database.

## Technology Stack Recommendations

- **Framework**: Express.js or NestJS
- **Database ORM**: TypeORM, Sequelize, or Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI

## Required API Endpoints

The backend should implement the following REST API endpoints that match the frontend's expected structure:

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Portals
- `GET /api/portals` - List all portals
- `GET /api/portals/:id` - Get portal by ID
- `GET /api/portals?installed=true|false` - Filter portals by installation status
- `POST /api/portals` - Create a new portal
- `PUT /api/portals/:id` - Update a portal
- `DELETE /api/portals/:id` - Delete a portal

### Software Payments
- `GET /api/software-payments` - List all software payments
- `GET /api/software-payments/:id` - Get payment by ID
- `GET /api/software-payments?status=paid|pending|overdue` - Filter payments by status
- `POST /api/software-payments` - Create a new payment
- `PUT /api/software-payments/:id` - Update a payment
- `DELETE /api/software-payments/:id` - Delete a payment

### Bank Applications
- `GET /api/bank-applications` - List all bank applications
- `GET /api/bank-applications/:id` - Get application by ID
- `GET /api/bank-applications?status=submitted|unsubmitted|processing|approved|rejected` - Filter applications by status
- `POST /api/bank-applications` - Create a new application
- `PUT /api/bank-applications/:id` - Update an application
- `DELETE /api/bank-applications/:id` - Delete an application

### Timeline Events
- `GET /api/timeline-events?entityType=X&entityId=Y` - Get timeline events for a specific entity
- `POST /api/timeline-events` - Create a new timeline event

### Users
- `GET /api/users/current` - Get the current authenticated user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (admin, user, viewer)
3. **Data Validation**: Validate all input data on the server side
4. **Error Handling**: Implement proper error handling and logging
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **CORS**: Configure CORS properly to allow only your frontend domain
7. **Environment Variables**: Store sensitive information in environment variables

## Deployment Recommendations

1. **Docker**: Containerize the application for easier deployment
2. **CI/CD**: Set up a CI/CD pipeline with GitHub Actions
3. **Environment Configuration**: Separate development, staging, and production configurations
4. **Logging**: Implement proper logging for debugging and monitoring
5. **Health Checks**: Add health check endpoints for monitoring

## Database Schema

The database schema should match the existing structure defined in `src/lib/mysql-schema.sql`.
