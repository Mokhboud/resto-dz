import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  /**
   * POST /api/restaurants/:id/reviews
   */
  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(2000).optional(),
        foodRating: z.number().int().min(1).max(5).optional(),
        serviceRating: z.number().int().min(1).max(5).optional(),
        cleanlinessRating: z.number().int().min(1).max(5).optional(),
        priceRating: z.number().int().min(1).max(5).optional(),
        atmosphereRating: z.number().int().min(1).max(5).optional(),
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

      const review = await this.reviewService.createReview(userId, req.params.id, validated);

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully',
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
   * GET /api/restaurants/:id/reviews
   */
  async getRestaurantReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.reviewService.getRestaurantReviews(req.params.id, page, limit);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Reviews retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/reviews/:id
   */
  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        rating: z.number().int().min(1).max(5).optional(),
        comment: z.string().max(2000).optional(),
        foodRating: z.number().int().min(1).max(5).optional(),
        serviceRating: z.number().int().min(1).max(5).optional(),
        cleanlinessRating: z.number().int().min(1).max(5).optional(),
        priceRating: z.number().int().min(1).max(5).optional(),
        atmosphereRating: z.number().int().min(1).max(5).optional(),
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

      const review = await this.reviewService.updateReview(req.params.id, userId, userRoles, validated);

      res.json({
        success: true,
        data: review,
        message: 'Review updated successfully',
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
   * DELETE /api/reviews/:id
   */
  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
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

      const result = await this.reviewService.deleteReview(req.params.id, userId, userRoles);

      res.json({
        success: true,
        data: result,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}