import { Request, Response, NextFunction } from 'express';
import { RankingService } from '../services/rankingService';

export class RankingController {
  private rankingService: RankingService;

  constructor() {
    this.rankingService = new RankingService();
  }

  /**
   * GET /api/restaurants/ranking
   */
  async getRankedRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        wilaya_id: req.query.wilaya_id ? parseInt(req.query.wilaya_id as string) : undefined,
        category_id: req.query.category_id as string,
        cuisine_id: req.query.cuisine_id as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await this.rankingService.getRankedRestaurants(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        meta: result.meta,
        message: 'Ranking retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}