import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { validatePasswordStrength } from '../utils/passwordValidator';
import { z } from 'zod';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validation schema
      const registerSchema = z.object({
        firstName: z.string().min(2).max(100),
        lastName: z.string().min(2).max(100),
        email: z.string().email(),
        phone: z.string().min(8).max(20).optional(),
        password: z.string().min(8).max(100),
      });

      const validated = registerSchema.parse(req.body);

      // Validate password strength
      const passwordCheck = validatePasswordStrength(validated.password);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet requirements',
          errorCode: 'WEAK_PASSWORD',
          details: passwordCheck.errors,
        });
      }

      const result = await this.authService.register({
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        password: validated.password,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const validated = loginSchema.parse(req.body);

      const result = await this.authService.login(validated.email, validated.password);

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError(401, 'Not authenticated', 'NOT_AUTHENTICATED');
      }

      const user = await this.authService.getCurrentUser(userId);

      res.json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        token: z.string().min(1),
      });

      const validated = schema.parse(req.body);
      const result = await this.authService.verifyEmail(validated.token);

      res.json({
        success: true,
        data: result,
        message: 'Email verified successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        email: z.string().email(),
      });

      const validated = schema.parse(req.body);
      const result = await this.authService.requestPasswordReset(validated.email);

      res.json({
        success: true,
        data: result,
        message: 'Password reset email sent',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8).max(100),
      });

      const validated = schema.parse(req.body);

      // Validate password strength
      const passwordCheck = validatePasswordStrength(validated.newPassword);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet requirements',
          errorCode: 'WEAK_PASSWORD',
          details: passwordCheck.errors,
        });
      }

      const result = await this.authService.resetPassword(validated.token, validated.newPassword);

      res.json({
        success: true,
        data: result,
        message: 'Password reset successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.authService.sendVerificationEmail(userId);

      res.json({
        success: true,
        data: result,
        message: 'Verification email sent',
      });
    } catch (error) {
      next(error);
    }
  }
}