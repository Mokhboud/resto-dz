import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';

export class CategoryController {
  /**
   * GET /api/categories
   */
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await AppDataSource.query(
        `SELECT id, name_fr, name_ar, name_en, icon
         FROM categories
         WHERE status = 'ACTIVE'
         ORDER BY name_fr ASC`
      );

      res.json({
        success: true,
        data: categories,
        message: 'Categories retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}