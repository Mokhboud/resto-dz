import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/users/profile
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const profile = await this.userService.getProfile(userId);

      res.json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/profile
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        firstName: z.string().min(2).max(100).optional(),
        lastName: z.string().min(2).max(100).optional(),
        phone: z.string().min(8).max(20).optional(),
        profilePhoto: z.string().max(500).optional(),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const profile = await this.userService.updateProfile(userId, validated);

      res.json({
        success: true,
        data: profile,
        message: 'Profile updated successfully',
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
}