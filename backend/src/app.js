import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
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
app.use('/api/dashboard', dashboardRoutes)

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
