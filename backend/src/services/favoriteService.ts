import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';

export class FavoriteService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Add a restaurant to favorites
   */
  async addFavorite(userId: string, restaurantId: string) {
    // Check if restaurant exists and is not deleted
    const restaurant = await this.restaurantRepository.findByIdForManagement(restaurantId);
    if (!restaurant || restaurant.deleted_at) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    // Insert with ON CONFLICT DO NOTHING (idempotent)
    await AppDataSource.query(
      `INSERT INTO favorites (user_id, restaurant_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, restaurantId]
    );

    return { success: true };
  }

  /**
   * Remove a restaurant from favorites
   */
  async removeFavorite(userId: string, restaurantId: string) {
    await AppDataSource.query(
      `DELETE FROM favorites WHERE user_id = $1 AND restaurant_id = $2`,
      [userId, restaurantId]
    );

    return { success: true };
  }

  /**
   * Get user's favorites with restaurant details
   */
  async getFavorites(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const favorites = await AppDataSource.query(
      `SELECT 
        f.restaurant_id,
        r.name, r.slug, r.description, r.address,
        r.latitude, r.longitude, r.price_level, r.status, r.verified,
        w.name_fr as wilaya_name,
        f.created_at as favorited_at,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count
      FROM favorites f
      JOIN restaurants r ON r.id = f.restaurant_id
      LEFT JOIN wilayas w ON r.wilaya_id = w.id
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      WHERE f.user_id = $1 AND r.deleted_at IS NULL
      GROUP BY f.restaurant_id, r.id, w.name_fr, f.created_at
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await AppDataSource.query(
      `SELECT COUNT(*) as total
       FROM favorites f
       JOIN restaurants r ON r.id = f.restaurant_id
       WHERE f.user_id = $1 AND r.deleted_at IS NULL`,
      [userId]
    );

    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}