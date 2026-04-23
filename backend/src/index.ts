import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { requestLogger } from './middleware/logger';
import { setupSwagger } from './utils/swagger';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Redis for caching (optional)
// import Redis from 'ioredis';
// export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom middleware
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Routes
import authRoutes from './api/auth.routes';
import userRoutes from './api/user.routes';
import courseRoutes from './api/course.routes';
import progressRoutes from './api/progress.routes';
import quizRoutes from './api/quiz.routes';
import recommendationRoutes from './api/recommendation.routes';
import analyticsRoutes from './api/analytics.routes';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/courses', authMiddleware, courseRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/quizzes', authMiddleware, quizRoutes);
app.use('/api/recommendations', authMiddleware, recommendationRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Swagger documentation
if (NODE_ENV === 'development') {
  setupSwagger(app);
}

// Error handling (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  
  // Close Prisma connection
  await prisma.$disconnect();
  
  // Close Redis connection if exists
  // await redis.quit();
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Núcleo Tático Backend Server
─────────────────────────────
✅ Environment: ${NODE_ENV}
✅ Port: ${PORT}
✅ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
✅ API Docs: ${NODE_ENV === 'development' ? `http://localhost:${PORT}/api-docs` : 'Disabled in production'}
✅ Health: http://localhost:${PORT}/health
─────────────────────────────
  `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

export default app;