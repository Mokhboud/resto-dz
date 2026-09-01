import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class AdminService {
  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats() {
    const [userStats, restaurantStats, reviewStats, claimStats, reportStats] = await Promise.all([
      AppDataSource.query(
        `SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_users,
          COUNT(*) FILTER (WHERE status = 'SUSPENDED') as suspended_users
        FROM users`
      ),
      AppDataSource.query(
        `SELECT 
          COUNT(*) as total_restaurants,
          COUNT(*) FILTER (WHERE status = 'PENDING') as pending_restaurants,
          COUNT(*) FILTER (WHERE verified = true) as verified_restaurants,
          COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_restaurants
        FROM restaurants`
      ),
      AppDataSource.query(
        `SELECT 
          COUNT(*) as total_reviews,
          COUNT(*) FILTER (WHERE status = 'PENDING') as pending_reviews
        FROM reviews`
      ),
      AppDataSource.query(
        `SELECT COUNT(*) as pending_claims FROM restaurant_claims WHERE status = 'PENDING'`
      ),
      AppDataSource.query(
        `SELECT COUNT(*) as pending_reports FROM reports WHERE status = 'PENDING'`
      ),
    ]);

    return {
      total_users: parseInt(userStats[0]?.total_users || '0'),
      active_users: parseInt(userStats[0]?.active_users || '0'),
      suspended_users: parseInt(userStats[0]?.suspended_users || '0'),
      total_restaurants: parseInt(restaurantStats[0]?.total_restaurants || '0'),
      pending_restaurants: parseInt(restaurantStats[0]?.pending_restaurants || '0'),
      verified_restaurants: parseInt(restaurantStats[0]?.verified_restaurants || '0'),
      deleted_restaurants: parseInt(restaurantStats[0]?.deleted_restaurants || '0'),
      total_reviews: parseInt(reviewStats[0]?.total_reviews || '0'),
      pending_reviews: parseInt(reviewStats[0]?.pending_reviews || '0'),
      pending_claims: parseInt(claimStats[0]?.pending_claims || '0'),
      pending_reports: parseInt(reportStats[0]?.pending_reports || '0'),
    };
  }

  /**
   * Get all users with pagination and search
   */
  async getUsers(page: number = 1, limit: number = 20, search?: string) {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let whereClause = '';

    if (search) {
      params.push(`%${search}%`);
      whereClause = `WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
    }

    params.push(limit, offset);
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.profile_photo, 
             u.status, u.email_verified, u.phone_verified, u.created_at, u.last_login,
             COALESCE(array_agg(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL), '{}') as roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const users = await AppDataSource.query(query, params);

    // Count
    const countResult = await AppDataSource.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params.slice(0, -2)
    );

    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string) {
    const validStatuses = ['ACTIVE', 'SUSPENDED', 'INACTIVE'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, 'Invalid status', 'INVALID_STATUS');
    }

    const result = await AppDataSource.query(
      `UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, status`,
      [status, userId]
    );

    if (!result[0]) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return result[0];
  }

  /**
   * Update user roles
   */
  async updateUserRoles(userId: string, roles: string[]) {
    const validRoles = ['USER', 'RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'MODERATOR', 'ADMIN'];
    // SUPER_ADMIN can only be granted by SUPER_ADMIN (handled in controller)
    
    for (const role of roles) {
      if (!validRoles.includes(role)) {
        throw new AppError(400, `Invalid role: ${role}`, 'INVALID_ROLE');
      }
    }

    // Delete existing roles and insert new ones
    await AppDataSource.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);

    for (const role of roles) {
      await AppDataSource.query(
        `INSERT INTO user_roles (user_id, role_id) SELECT $1, id FROM roles WHERE name = $2 ON CONFLICT DO NOTHING`,
        [userId, role]
      );
    }

    const result = await AppDataSource.query(
      `SELECT u.id, u.email, COALESCE(array_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '{}') as roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (!result[0]) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return result[0];
  }

  /**
   * Get all restaurants for admin
   */
  async getRestaurants(page: number = 1, limit: number = 20, status?: string, search?: string) {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`r.name ILIKE $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);
    const restaurants = await AppDataSource.query(
      `SELECT r.*, 
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count,
        u.email as owner_email
      FROM restaurants r
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      LEFT JOIN users u ON u.id = r.owner_id
      ${whereClause}
      GROUP BY r.id, u.email
      ORDER BY r.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return restaurants;
  }

  /**
   * Update restaurant status
   */
  async updateRestaurantStatus(restaurantId: string, status: string) {
    const validStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'REJECTED', 'DELETED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, 'Invalid status', 'INVALID_STATUS');
    }

    const result = await AppDataSource.query(
      `UPDATE restaurants SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, status`,
      [status, restaurantId]
    );

    if (!result[0]) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    return result[0];
  }

  /**
   * Verify a restaurant
   */
  async verifyRestaurant(restaurantId: string, verified: boolean) {
    const result = await AppDataSource.query(
      `UPDATE restaurants SET verified = $1, verified_at = CASE WHEN $1 THEN CURRENT_TIMESTAMP ELSE NULL END, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, verified`,
      [verified, restaurantId]
    );

    if (!result[0]) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    return result[0];
  }

  /**
   * Get all reviews for admin
   */
  async getReviews(page: number = 1, limit: number = 20, status?: string) {
    const offset = (page - 1) * limit;
    const params: any[] = [];

    if (status) {
      params.push(status);
    }
    params.push(limit, offset);

    const whereClause = status ? `WHERE rev.status = $1` : '';

    const reviews = await AppDataSource.query(
      `SELECT rev.*, 
        r.name as restaurant_name,
        u.email as reviewer_email
      FROM reviews rev
      JOIN restaurants r ON r.id = rev.restaurant_id
      JOIN users u ON u.id = rev.user_id
      ${whereClause}
      ORDER BY rev.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return reviews;
  }

  /**
   * Update review status
   */
  async updateReviewStatus(reviewId: string, status: string) {
    const validStatuses = ['PENDING', 'PUBLISHED', 'HIDDEN', 'REJECTED', 'FLAGGED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, 'Invalid status', 'INVALID_STATUS');
    }

    const result = await AppDataSource.query(
      `UPDATE reviews SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status`,
      [status, reviewId]
    );

    if (!result[0]) {
      throw new AppError(404, 'Review not found', 'REVIEW_NOT_FOUND');
    }

    return result[0];
  }

  /**
   * Delete a review (soft delete - set to HIDDEN)
   */
  async deleteReview(reviewId: string) {
    const result = await AppDataSource.query(
      `UPDATE reviews SET status = 'HIDDEN', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, status`,
      [reviewId]
    );

    if (!result[0]) {
      throw new AppError(404, 'Review not found', 'REVIEW_NOT_FOUND');
    }

    return result[0];
  }
}