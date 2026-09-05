import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';

export const visitTracker = async (req: Request, res: Response, next: NextFunction) => {
  // Skip static files and health checks
  if (req.path.includes('/health') || req.path.includes('/uploads') || req.path.includes('/api-docs')) {
    return next();
  }

  // Get IP address
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || null;
  const path = req.originalUrl || req.path;
  const method = req.method;

  // Get user ID if authenticated
  const userId = (req as any).user?.userId || null;

  // Don't block the request — fire and forget
  AppDataSource.query(
    `INSERT INTO visit_logs (user_id, ip_address, user_agent, path, method)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, ipAddress, userAgent, path, method]
  ).catch(() => {
    // Silent fail — tracking should never break the app
  });

  next();
};