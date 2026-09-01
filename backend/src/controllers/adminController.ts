import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { RestaurantManagementService } from '../services/restaurantManagementService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class AdminController {
  private adminService: AdminService;
  private managementService: RestaurantManagementService;

  constructor() {
    this.adminService = new AdminService();
    this.managementService = new RestaurantManagementService();
  }

  /**
   * GET /api/admin/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await this.adminService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
        message: 'Admin dashboard retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users
   */
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const search = req.query.search as string;

      const result = await this.adminService.getUsers(page, limit, search);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/users/:id/status
   */
  async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']),
      });

      const validated = schema.parse(req.body);
      const result = await this.adminService.updateUserStatus(req.params.id, validated.status);

      res.json({
        success: true,
        data: result,
        message: 'User status updated successfully',
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
   * PUT /api/admin/users/:id/roles
   */
  async updateUserRoles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        roles: z.array(z.string()).min(1),
      });

      const validated = schema.parse(req.body);
      const result = await this.adminService.updateUserRoles(req.params.id, validated.roles);

      res.json({
        success: true,
        data: result,
        message: 'User roles updated successfully',
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
   * GET /api/admin/restaurants
   */
  async getRestaurants(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const restaurants = await this.adminService.getRestaurants(page, limit, status, search);

      res.json({
        success: true,
        data: restaurants,
        message: 'Restaurants retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/restaurants/:id/status
   */
  async updateRestaurantStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'REJECTED', 'DELETED']),
      });

      const validated = schema.parse(req.body);
      const result = await this.adminService.updateRestaurantStatus(req.params.id, validated.status);

      res.json({
        success: true,
        data: result,
        message: 'Restaurant status updated successfully',
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
   * PUT /api/admin/restaurants/:id/verify
   */
  async verifyRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        verified: z.boolean(),
      });

      const validated = schema.parse(req.body);
      const result = await this.adminService.verifyRestaurant(req.params.id, validated.verified);

      res.json({
        success: true,
        data: result,
        message: 'Restaurant verification updated successfully',
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
   * GET /api/admin/reviews
   */
  async getReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const status = req.query.status as string;

      const reviews = await this.adminService.getReviews(page, limit, status);

      res.json({
        success: true,
        data: reviews,
        message: 'Reviews retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/reviews/:id/status
   */
  async updateReviewStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        status: z.enum(['PENDING', 'PUBLISHED', 'HIDDEN', 'REJECTED', 'FLAGGED']),
      });

      const validated = schema.parse(req.body);
      const result = await this.adminService.updateReviewStatus(req.params.id, validated.status);

      res.json({
        success: true,
        data: result,
        message: 'Review status updated successfully',
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
   * DELETE /api/admin/reviews/:id
   */
  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.deleteReview(req.params.id);

      res.json({
        success: true,
        data: result,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // === CLAIM MANAGEMENT ===

  /**
   * GET /api/admin/restaurant-claims
   */
  async getRestaurantClaims(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const status = req.query.status as string;

      const claims = await this.managementService.getAllClaims(page, limit, status);

      res.json({
        success: true,
        data: claims,
        pagination: { page, limit },
        message: 'Claims retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/restaurant-claims/:id/approve
   */
  async approveClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminUserId = req.user?.userId;
      if (!adminUserId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.managementService.approveClaim(req.params.id, adminUserId);

      res.json({
        success: true,
        data: result,
        message: 'Claim approved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/restaurant-claims/:id/reject
   */
  async rejectClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminUserId = req.user?.userId;
      if (!adminUserId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.managementService.rejectClaim(req.params.id, adminUserId);

      res.json({
        success: true,
        data: result,
        message: 'Claim rejected successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}