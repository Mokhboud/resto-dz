import { Request, Response, NextFunction } from 'express';
import { ReviewResponseService } from '../services/reviewResponseService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class ReviewResponseController {
  private reviewResponseService: ReviewResponseService;

  constructor() {
    this.reviewResponseService = new ReviewResponseService();
  }

  /**
   * POST /api/reviews/:id/response
   */
  async createResponse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        response: z.string().min(1).max(2000),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const response = await this.reviewResponseService.createResponse(
        userId,
        req.params.id,
        validated.response,
        userRoles
      );

      res.status(201).json({
        success: true,
        data: response,
        message: 'Response created successfully',
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
   * PUT /api/review-responses/:id
   */
  async updateResponse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        response: z.string().min(1).max(2000),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const response = await this.reviewResponseService.updateResponse(
        req.params.id,
        userId,
        validated.response,
        userRoles
      );

      res.json({
        success: true,
        data: response,
        message: 'Response updated successfully',
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
   * DELETE /api/review-responses/:id
   */
  async deleteResponse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.reviewResponseService.deleteResponse(
        req.params.id,
        userId,
        userRoles
      );

      res.json({
        success: true,
        data: result,
        message: 'Response deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}