import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';

export class NotificationService {
  /**
   * Create a notification for a user
   */
  async createNotification(userId: string, type: string, title: string, message: string) {
    try {
      const result = await AppDataSource.query(
        `INSERT INTO notifications (user_id, type, title, message)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, type, title, message, read, created_at`,
        [userId, type, title, message]
      );
      return result[0];
    } catch (error) {
      logger.error(`Failed to create notification: ${error}`);
      return null;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const notifications = await AppDataSource.query(
      `SELECT id, type, title, message, read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await AppDataSource.query(
      `SELECT COUNT(*) as total FROM notifications WHERE user_id = $1`,
      [userId]
    );

    const unreadCount = await AppDataSource.query(
      `SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND read = false`,
      [userId]
    );

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0]?.total || '0'),
      },
      unreadCount: parseInt(unreadCount[0]?.unread || '0'),
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const result = await AppDataSource.query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING id, read`,
      [notificationId, userId]
    );
    return result[0] || null;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    await AppDataSource.query(
      `UPDATE notifications SET read = true WHERE user_id = $1 AND read = false`,
      [userId]
    );
    return { success: true };
  }

  /**
   * Create welcome notification for new user
   */
  async welcomeNotification(userId: string, firstName: string) {
    return this.createNotification(
      userId,
      'WELCOME',
      'Welcome to Resto DZ! 🇩🇿',
      `Hello ${firstName}! Welcome to Resto DZ. Discover, taste, rate, and trust restaurants across Algeria.`
    );
  }

  /**
   * Create review notification for restaurant owner
   */
  async reviewNotification(ownerId: string, restaurantName: string, reviewerName: string) {
    return this.createNotification(
      ownerId,
      'NEW_REVIEW',
      'New Review Received',
      `${reviewerName} left a review on ${restaurantName}.`
    );
  }

  /**
   * Create claim approval notification
   */
  async claimApprovedNotification(userId: string, restaurantName: string) {
    return this.createNotification(
      userId,
      'CLAIM_APPROVED',
      'Claim Approved',
      `Your claim for ${restaurantName} has been approved. You are now the verified owner.`
    );
  }

  /**
   * Create claim rejection notification
   */
  async claimRejectedNotification(userId: string, restaurantName: string) {
    return this.createNotification(
      userId,
      'CLAIM_REJECTED',
      'Claim Rejected',
      `Your claim for ${restaurantName} was rejected. Please contact support for more information.`
    );
  }
}