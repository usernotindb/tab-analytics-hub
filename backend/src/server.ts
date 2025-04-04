
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import portalRoutes from './routes/portal.routes';
import softwarePaymentRoutes from './routes/softwarePayment.routes';
import bankApplicationRoutes from './routes/bankApplication.routes';
import timelineEventRoutes from './routes/timelineEvent.routes';
import userRoutes from './routes/user.routes';
import setupRoutes from './routes/setup.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8236;

// Apply middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/portals', portalRoutes);
app.use('/api/software-payments', softwarePaymentRoutes);
app.use('/api/bank-applications', bankApplicationRoutes);
app.use('/api/timeline-events', timelineEventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/setup', setupRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
