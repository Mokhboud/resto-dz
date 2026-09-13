import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class RestaurantReportController {
  /**
   * POST /api/restaurants/:id/report — Public report
   */
  async submitReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        reason: z.enum([
          'CLOSED',
          'NOT_EXISTS',
          'WRONG_ADDRESS',
          'WRONG_PHONE',
          'WRONG_INFO',
          'DUPLICATE',
          'OTHER',
        ]),
        description: z.string().max(500).optional(),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId || null;
      const restaurantId = req.params.id;

      // Check restaurant exists
      const exists = await AppDataSource.query(
        `SELECT id FROM restaurants WHERE id = $1`,
        [restaurantId]
      );
      if (!exists[0]) {
        return res.status(404).json({ success: false, message: 'Restaurant not found', errorCode: 'NOT_FOUND' });
      }

      const result = await AppDataSource.query(
        `INSERT INTO reports (reporter_id, target_type, target_id, reason, description)
         VALUES ($1, 'RESTAURANT', $2, $3, $4)
         RETURNING id, reason, status, created_at`,
        [userId, restaurantId, validated.reason, validated.description || null]
      );

      res.status(201).json({
        success: true,
        data: result[0],
        message: 'Report submitted. Thank you for helping us improve!',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Validation error', errorCode: 'VALIDATION_ERROR', details: error.errors });
      }
      next(error);
    }
  }

  /**
   * GET /api/admin/restaurant-reports — List reports
   */
  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await AppDataSource.query(
        `SELECT rep.id, rep.reason, rep.description, rep.status, rep.created_at,
                r.id as restaurant_id, r.name as restaurant_name,
                u.email as reporter_email
         FROM reports rep
         LEFT JOIN restaurants r ON r.id = rep.target_id
         LEFT JOIN users u ON u.id = rep.reporter_id
         WHERE rep.target_type = 'RESTAURANT'
         ORDER BY rep.created_at DESC
         LIMIT 100`
      );

      res.json({
        success: true,
        data: reports,
        message: 'Reports retrieved',
      });
    } catch (error) {
      next(error);
    }
  }
}