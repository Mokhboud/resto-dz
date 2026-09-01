import { Request, Response, NextFunction } from 'express';
import { OwnerDashboardService } from '../services/ownerDashboardService';
import { AuthRequest } from '../middleware/auth';

export class OwnerDashboardController {
  private ownerDashboardService: OwnerDashboardService;

  constructor() {
    this.ownerDashboardService = new OwnerDashboardService();
  }

  /**
   * GET /api/owner/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
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

      const stats = await this.ownerDashboardService.getDashboardStats(userId, userRoles);

      res.json({
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/owner/restaurants
   */
  async getMyRestaurants(req: AuthRequest, res: Response, next: NextFunction) {
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

      const restaurants = await this.ownerDashboardService.getMyRestaurants(userId, userRoles);

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
   * GET /api/owner/restaurants/:id
   */
  async getMyRestaurantById(req: AuthRequest, res: Response, next: NextFunction) {
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

      const restaurant = await this.ownerDashboardService.getMyRestaurantById(
        req.params.id,
        userId,
        userRoles
      );

      res.json({
        success: true,
        data: restaurant,
        message: 'Restaurant retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}