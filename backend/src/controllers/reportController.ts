import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

export class ReportController {
  /**
   * POST /api/reports
   */
  async submitReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        targetType: z.enum(['RESTAURANT', 'REVIEW', 'USER', 'RESPONSE']),
        targetId: z.string().uuid(),
        reason: z.string().min(3).max(100),
        description: z.string().max(1000).optional(),
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

      try {
        const result = await AppDataSource.query(
          `INSERT INTO reports (reporter_id, target_type, target_id, reason, description)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, reporter_id, target_type, target_id, reason, description, status, created_at`,
          [userId, validated.targetType, validated.targetId, validated.reason, validated.description || null]
        );

        res.status(201).json({
          success: true,
          data: result[0],
          message: 'Report submitted successfully',
        });
      } catch (error: any) {
        if (error.code === '23505') {
          throw new AppError(409, 'You have already reported this content', 'DUPLICATE_REPORT');
        }
        throw error;
      }
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
   * GET /api/admin/reports
   */
  async getReports(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const status = req.query.status as string;
      const offset = (page - 1) * limit;

      const params: any[] = [];
      let whereClause = '';

      if (status) {
        params.push(status);
        whereClause = `WHERE rep.status = $1`;
      }

      params.push(limit, offset);
      const reports = await AppDataSource.query(
        `SELECT rep.*, 
          u.email as reporter_email,
          reviewer.email as reviewer_email
        FROM reports rep
        LEFT JOIN users u ON u.id = rep.reporter_id
        LEFT JOIN users reviewer ON reviewer.id = rep.reviewed_by
        ${whereClause}
        ORDER BY rep.created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      );

      res.json({
        success: true,
        data: reports,
        pagination: { page, limit },
        message: 'Reports retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/reports/:id/status
   */
  async updateReportStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        status: z.enum(['PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED']),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;

      const result = await AppDataSource.query(
        `UPDATE reports 
         SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, status, reviewed_by, reviewed_at`,
        [validated.status, userId, req.params.id]
      );

      if (!result[0]) {
        return res.status(404).json({
          success: false,
          message: 'Report not found',
          errorCode: 'REPORT_NOT_FOUND',
        });
      }

      res.json({
        success: true,
        data: result[0],
        message: 'Report status updated successfully',
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
