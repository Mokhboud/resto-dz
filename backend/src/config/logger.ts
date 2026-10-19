import winston from 'winston';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'resto-dz-api' },
  transports: [
    // Always log to console (Render captures this)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// In development, also write to files for local debugging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
  }));
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
  }));
}
