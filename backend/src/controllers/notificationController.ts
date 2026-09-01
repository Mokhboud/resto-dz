import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { AuthRequest } from '../middleware/auth';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * GET /api/notifications
   */
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
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

      const result = await this.notificationService.getUserNotifications(userId, page, limit);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        unreadCount: result.unreadCount,
        message: 'Notifications retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/notifications/:id/read
   */
  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.notificationService.markAsRead(req.params.id, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found',
          errorCode: 'NOTIFICATION_NOT_FOUND',
        });
      }

      res.json({
        success: true,
        data: result,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/notifications/read-all
   */
  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        data: result,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
}