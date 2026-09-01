import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from '../services/favoriteService';
import { AuthRequest } from '../middleware/auth';

export class FavoriteController {
  private favoriteService: FavoriteService;

  constructor() {
    this.favoriteService = new FavoriteService();
  }

  /**
   * POST /api/restaurants/:id/favorite
   */
  async addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.favoriteService.addFavorite(userId, req.params.id);

      res.json({
        success: true,
        data: result,
        message: 'Restaurant added to favorites',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/restaurants/:id/favorite
   */
  async removeFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.favoriteService.removeFavorite(userId, req.params.id);

      res.json({
        success: true,
        data: result,
        message: 'Restaurant removed from favorites',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/favorites
   */
  async getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.favoriteService.getFavorites(userId, page, limit);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Favorites retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}