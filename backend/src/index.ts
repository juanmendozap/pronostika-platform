import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import betRoutes from './routes/bets';
import categoryRoutes from './routes/categories';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';
import tempAdminRoutes from './routes/temp-admin';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { initSocket } from './services/socketService';

dotenv.config();

const app = express();

// Trust proxy for Railway/production deployment
app.set('trust proxy', true);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins in development
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Rate limiting - disabled for Railway deployment compatibility
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(limiter); // Disabled for Railway compatibility

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/temp', tempAdminRoutes); // Temporary admin route
app.use('/api', healthRoutes);

// Error handling
app.use(errorHandler);

// Initialize Socket.IO
initSocket(io);

server.listen(Number(PORT), '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Server accessible on all network interfaces`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };