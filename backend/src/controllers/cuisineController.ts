import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';

export class CuisineController {
  /**
   * GET /api/cuisines
   */
  async getCuisines(req: Request, res: Response, next: NextFunction) {
    try {
      const cuisines = await AppDataSource.query(
        `SELECT id, name_fr, name_ar, name_en, icon
         FROM cuisines
         WHERE status = 'ACTIVE'
         ORDER BY name_fr ASC`
      );

      res.json({
        success: true,
        data: cuisines,
        message: 'Cuisines retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}