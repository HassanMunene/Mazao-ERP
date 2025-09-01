import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// Middleware Number 1 Set security Header.
app.use(helmet());

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // Allows cookies to be sent
}));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body and Cookie Parsers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Routes - API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/profile', profileRoutes);

// Basic Route to ensure our endpoint is working.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mazao ERP API!' });
});

// 404 for undefined routes
app.use('/{*any}', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});


// Central Error Handler this Must be last
app.use(errorHandler);

export default app;
