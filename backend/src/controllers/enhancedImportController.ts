import { Request, Response, NextFunction } from 'express';
import { EnhancedImportService } from '../services/enhancedImportService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class EnhancedImportController {
  private importService: EnhancedImportService;

  constructor() {
    this.importService = new EnhancedImportService();
  }

  /**
   * GET /api/admin/import/restaurants/search
   * Search restaurants from OSM
   */
  async searchRestaurants(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wilayaId = parseInt(req.query.wilaya_id as string);
      const radiusKm = req.query.radius ? parseFloat(req.query.radius as string) : 5;

      if (isNaN(wilayaId) || wilayaId < 1 || wilayaId > 58) {
        return res.status(400).json({
          success: false,
          message: 'Valid wilaya_id is required',
          errorCode: 'INVALID_WILAYA_ID',
        });
      }

      const restaurants = await this.importService.searchRestaurants(wilayaId, radiusKm);

      res.json({
        success: true,
        data: restaurants,
        message: `Found ${restaurants.length} restaurants`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/import/restaurants/preview
   */
  async previewImport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        restaurants: z.array(z.object({
          name: z.string(),
          address: z.string().optional(),
          latitude: z.number(),
          longitude: z.number(),
          phone: z.string().optional(),
          cuisine: z.string().optional(),
          osm_id: z.string().optional(),
        })).min(1),
      });

      const validated = schema.parse(req.body);
      const preview = await this.importService.previewImport(validated.restaurants);

      res.json({
        success: true,
        data: preview,
        message: 'Preview completed',
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
   * POST /api/admin/import/restaurants
   */
  async importRestaurants(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        restaurants: z.array(z.object({
          name: z.string(),
          address: z.string().optional(),
          latitude: z.number(),
          longitude: z.number(),
          phone: z.string().optional(),
          cuisine: z.string().optional(),
          osm_id: z.string().optional(),
        })).min(1),
        wilaya_id: z.number().int().min(1).max(58),
        source: z.string().default('openstreetmap'),
      });

      const validated = schema.parse(req.body);
      const adminId = req.user?.userId;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.importService.importRestaurants(
        validated.restaurants,
        adminId,
        validated.wilaya_id,
        validated.source
      );

      res.json({
        success: true,
        data: result,
        message: `Imported ${result.imported} restaurants`,
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
   * GET /api/admin/import/restaurants/history
   */
  async getImportHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const history = await this.importService.getImportHistory(page, limit);

      res.json({
        success: true,
        data: history.data,
        pagination: history.pagination,
        message: 'Import history retrieved',
      });
    } catch (error) {
      next(error);
    }
  }
}