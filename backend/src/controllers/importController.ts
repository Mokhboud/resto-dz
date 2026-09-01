import { Request, Response, NextFunction } from 'express';
import { ImportService } from '../services/importService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class ImportController {
  private importService: ImportService;

  constructor() {
    this.importService = new ImportService();
  }

  /**
   * POST /api/admin/import/restaurants
   */
  async importRestaurants(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        restaurants: z.array(z.object({
          name: z.string().min(2),
          description: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          wilaya_id: z.number().int().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          price_level: z.number().int().min(1).max(5).optional(),
          categories: z.array(z.string()).optional(),
        })).min(1),
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

      const results = await this.importService.importRestaurants(validated.restaurants, userId);

      res.json({
        success: true,
        data: results,
        message: 'Import completed',
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
   * POST /api/admin/import/communes
   */
  async importCommunes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        communes: z.array(z.object({
          id: z.number().int(),
          daira_id: z.number().int(),
          wilaya_id: z.number().int(),
          code: z.string(),
          name_fr: z.string(),
          name_ar: z.string().optional(),
          name_en: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })).min(1),
      });

      const validated = schema.parse(req.body);

      const results = await this.importService.importCommunes(validated.communes);

      res.json({
        success: true,
        data: results,
        message: 'Communes import completed',
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
   * POST /api/admin/import/dairas
   */
  async importDairas(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        dairas: z.array(z.object({
          id: z.number().int(),
          wilaya_id: z.number().int(),
          code: z.string(),
          name_fr: z.string(),
          name_ar: z.string().optional(),
          name_en: z.string().optional(),
        })).min(1),
      });

      const validated = schema.parse(req.body);

      const results = await this.importService.importDairas(validated.dairas);

      res.json({
        success: true,
        data: results,
        message: 'Dairas import completed',
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