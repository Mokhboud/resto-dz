import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { sanitizeInput } from './middleware/sanitize';
import { generalRateLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { logger } from './config/logger';
import { setupSwagger } from './config/swagger';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // CORS with production restrictions
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl)
        if (!origin) return callback(null, true);
        
        // In development, allow all
        if (process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        
        // In production, only allow configured origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        return callback(new Error('CORS not allowed'));
      },
      credentials: true,
    })
  );

  // General rate limiting
  app.use('/api', generalRateLimiter);

  // Body parsing (with size limits)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Input sanitization (XSS protection)
  app.use(sanitizeInput);

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Swagger documentation
  setupSwagger(app);

  // Logging
  app.use(requestLogger);

  // Routes
  app.use('/api', routes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'Resto DZ API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Error handling
  app.use(errorHandler);

  return app;
};