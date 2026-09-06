import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class FeedbackController {
  /**
   * POST /api/feedback — Submit feedback (public)
   */
  async submitFeedback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { feedbackType, message, rating } = req.body;
      const userId = req.user?.userId || null;

      if (!message || !feedbackType) {
        return res.status(400).json({
          success: false,
          message: 'Feedback type and message are required',
          errorCode: 'INVALID_INPUT',
        });
      }

      const validTypes = ['BUG', 'FEATURE_REQUEST', 'PROBLEM', 'GENERAL'];
      if (!validTypes.includes(feedbackType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid feedback type',
          errorCode: 'INVALID_TYPE',
        });
      }

      const result = await AppDataSource.query(
        `INSERT INTO feedback (user_id, feedback_type, message, rating)
         VALUES ($1, $2, $3, $4)
         RETURNING id, feedback_type, message, rating, created_at`,
        [userId, feedbackType, message, rating || null]
      );

      res.status(201).json({
        success: true,
        data: result[0],
        message: 'Feedback submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/feedback — List all feedback (admin only)
   */
  async getFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = (page - 1) * limit;

      const feedback = await AppDataSource.query(
        `SELECT f.id, f.feedback_type, f.message, f.rating, f.created_at,
                u.email, u.first_name, u.last_name
         FROM feedback f
         LEFT JOIN users u ON u.id = f.user_id
         ORDER BY f.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await AppDataSource.query(`SELECT COUNT(*) as total FROM feedback`);
      const total = parseInt(countResult[0]?.total || '0');

      res.json({
        success: true,
        data: feedback,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        message: 'Feedback retrieved',
      });
    } catch (error) {
      next(error);
    }
  }
}