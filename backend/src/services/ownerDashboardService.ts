import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class OwnerDashboardService {
  /**
   * Get dashboard statistics for the authenticated owner
   */
  async getDashboardStats(userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    // Build ownership condition
    let ownershipCondition = `r.owner_id = $1`;
    const params: any[] = [userId];

    if (isAdmin) {
      // Admins see all restaurants
      ownershipCondition = `1=1`;
      params.length = 0;
    }

    const stats = await AppDataSource.query(
      `SELECT 
        COUNT(DISTINCT r.id) as restaurants_count,
        COALESCE(SUM(rev_stats.review_count), 0) as total_reviews,
        COALESCE(AVG(rev_stats.avg_rating), 0) as average_rating,
        COALESCE(SUM(fav_stats.fav_count), 0) as total_favorites
      FROM restaurants r
      LEFT JOIN (
        SELECT restaurant_id, COUNT(*) as review_count, AVG(overall_rating) as avg_rating
        FROM reviews
        WHERE status = 'PUBLISHED'
        GROUP BY restaurant_id
      ) rev_stats ON rev_stats.restaurant_id = r.id
      LEFT JOIN (
        SELECT restaurant_id, COUNT(*) as fav_count
        FROM favorites
        GROUP BY restaurant_id
      ) fav_stats ON fav_stats.restaurant_id = r.id
      WHERE ${ownershipCondition} AND r.deleted_at IS NULL`,
      params
    );

    const result = stats[0];
    return {
      restaurants_count: parseInt(result?.restaurants_count || '0'),
      total_reviews: parseInt(result?.total_reviews || '0'),
      average_rating: parseFloat(result?.average_rating || '0').toFixed(2),
      total_favorites: parseInt(result?.total_favorites || '0'),
    };
  }

  /**
   * Get restaurants owned by the user
   */
  async getMyRestaurants(userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    let whereClause = `r.owner_id = $1`;
    const params: any[] = [userId];

    if (isAdmin) {
      whereClause = `1=1`;
      params.length = 0;
    }

    const restaurants = await AppDataSource.query(
      `SELECT 
        r.id, r.name, r.slug, r.description, r.address,
        r.status, r.verified, r.created_at,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count,
        (SELECT COUNT(*) FROM favorites f WHERE f.restaurant_id = r.id) as favorite_count
      FROM restaurants r
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      WHERE ${whereClause} AND r.deleted_at IS NULL
      GROUP BY r.id
      ORDER BY r.created_at DESC`,
      params
    );

    return restaurants;
  }

  /**
   * Get a single owned restaurant
   */
  async getMyRestaurantById(restaurantId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    let whereClause = `r.id = $1 AND r.owner_id = $2`;
    const params: any[] = [restaurantId, userId];

    if (isAdmin) {
      whereClause = `r.id = $1`;
      params.length = 1;
    }

    const result = await AppDataSource.query(
      `SELECT 
        r.*,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count,
        (SELECT COUNT(*) FROM favorites f WHERE f.restaurant_id = r.id) as favorite_count
      FROM restaurants r
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      WHERE ${whereClause} AND r.deleted_at IS NULL
      GROUP BY r.id`,
      params
    );

    const restaurant = result[0];

    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found or not authorized', 'RESTAURANT_NOT_FOUND');
    }

    return restaurant;
  }
}