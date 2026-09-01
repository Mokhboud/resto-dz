import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
}

/**
 * Middleware to authenticate user using JWT token
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required', 'AUTHENTICATION_REQUIRED');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const authService = new AuthService();
    const decoded = authService.verifyAccessToken(token);

    // Get user roles
    const userRepository = new UserRepository();
    const roles = await userRepository.getUserRoles(decoded.userId);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }
};

/**
 * Middleware to authorize user based on roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required', 'AUTHENTICATION_REQUIRED'));
    }

    const userRoles = req.user.roles || [];

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return next(new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS'));
    }

    next();
  };
};