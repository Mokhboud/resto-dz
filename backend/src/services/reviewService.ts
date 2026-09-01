import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';

export class ReviewService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Create a review
   */
  async createReview(userId: string, restaurantId: string, data: {
    rating: number;
    comment?: string;
    foodRating?: number;
    serviceRating?: number;
    cleanlinessRating?: number;
    priceRating?: number;
    atmosphereRating?: number;
  }) {
    // Check if restaurant exists and not deleted
    const restaurant = await this.restaurantRepository.findByIdForManagement(restaurantId);
    if (!restaurant || restaurant.deleted_at) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    // Calculate overall rating
    const foodRating = data.foodRating || data.rating;
    const serviceRating = data.serviceRating || data.rating;
    const cleanlinessRating = data.cleanlinessRating || data.rating;
    const priceRating = data.priceRating || data.rating;
    const atmosphereRating = data.atmosphereRating || data.rating;

    const overallRating = (
      foodRating * 0.35 +
      serviceRating * 0.20 +
      cleanlinessRating * 0.20 +
      priceRating * 0.15 +
      atmosphereRating * 0.10
    ).toFixed(2);

    try {
      const result = await AppDataSource.query(
        `INSERT INTO reviews (restaurant_id, user_id, food_rating, service_rating, cleanliness_rating, price_rating, atmosphere_rating, overall_rating, comment, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PUBLISHED')
         RETURNING id, restaurant_id, user_id, food_rating, service_rating, cleanliness_rating, price_rating, atmosphere_rating, overall_rating, comment, verified_visit, status, created_at, updated_at`,
        [
          restaurantId,
          userId,
          foodRating,
          serviceRating,
          cleanlinessRating,
          priceRating,
          atmosphereRating,
          overallRating,
          data.comment || null,
        ]
      );

      return result[0];
    } catch (error: any) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        throw new AppError(409, 'You have already reviewed this restaurant', 'REVIEW_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Get reviews for a restaurant
   */
  async getRestaurantReviews(restaurantId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const reviews = await AppDataSource.query(
      `SELECT 
        rev.id, rev.restaurant_id,
        rev.food_rating, rev.service_rating, rev.cleanliness_rating, 
        rev.price_rating, rev.atmosphere_rating, rev.overall_rating,
        rev.comment, rev.verified_visit, rev.status, rev.created_at, rev.updated_at,
        u.id as reviewer_id, u.first_name as reviewer_first_name, u.last_name as reviewer_last_name
      FROM reviews rev
      JOIN users u ON u.id = rev.user_id
      WHERE rev.restaurant_id = $1 AND rev.status = 'PUBLISHED'
      ORDER BY rev.created_at DESC
      LIMIT $2 OFFSET $3`,
      [restaurantId, limit, offset]
    );

    // Total count
    const countResult = await AppDataSource.query(
      `SELECT COUNT(*) as total FROM reviews WHERE restaurant_id = $1 AND status = 'PUBLISHED'`,
      [restaurantId]
    );

    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a review
   */
  async updateReview(reviewId: string, userId: string, userRoles: string[], data: {
    rating?: number;
    comment?: string;
    foodRating?: number;
    serviceRating?: number;
    cleanlinessRating?: number;
    priceRating?: number;
    atmosphereRating?: number;
  }) {
    // Find review
    const reviews = await AppDataSource.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [reviewId]
    );
    const review = reviews[0];

    if (!review) {
      throw new AppError(404, 'Review not found', 'REVIEW_NOT_FOUND');
    }

    // Authorization
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');
    const isOwner = review.user_id === userId;

    if (!isAdmin && !isOwner) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.rating !== undefined) {
      updates.push(`food_rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
      updates.push(`service_rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
      updates.push(`cleanliness_rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
      updates.push(`price_rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
      updates.push(`atmosphere_rating = $${paramIndex}`);
      params.push(data.rating);
      paramIndex++;
    }

    if (data.foodRating !== undefined) {
      updates.push(`food_rating = $${paramIndex}`);
      params.push(data.foodRating);
      paramIndex++;
    }
    if (data.serviceRating !== undefined) {
      updates.push(`service_rating = $${paramIndex}`);
      params.push(data.serviceRating);
      paramIndex++;
    }
    if (data.cleanlinessRating !== undefined) {
      updates.push(`cleanliness_rating = $${paramIndex}`);
      params.push(data.cleanlinessRating);
      paramIndex++;
    }
    if (data.priceRating !== undefined) {
      updates.push(`price_rating = $${paramIndex}`);
      params.push(data.priceRating);
      paramIndex++;
    }
    if (data.atmosphereRating !== undefined) {
      updates.push(`atmosphere_rating = $${paramIndex}`);
      params.push(data.atmosphereRating);
      paramIndex++;
    }

    if (data.comment !== undefined) {
      updates.push(`comment = $${paramIndex}`);
      params.push(data.comment);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new AppError(400, 'No valid fields to update', 'NO_FIELDS_TO_UPDATE');
    }

    // Recalculate overall rating
    updates.push(`overall_rating = ROUND((food_rating * 0.35 + service_rating * 0.20 + cleanliness_rating * 0.20 + price_rating * 0.15 + atmosphere_rating * 0.10)::numeric, 2)`);
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    params.push(reviewId);
    const result = await AppDataSource.query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    return result[0];
  }

  /**
   * Delete a review (soft delete — set status to HIDDEN)
   */
  async deleteReview(reviewId: string, userId: string, userRoles: string[]) {
    const reviews = await AppDataSource.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [reviewId]
    );
    const review = reviews[0];

    if (!review) {
      throw new AppError(404, 'Review not found', 'REVIEW_NOT_FOUND');
    }

    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');
    const isOwner = review.user_id === userId;

    if (!isAdmin && !isOwner) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    const result = await AppDataSource.query(
      `UPDATE reviews SET status = 'HIDDEN', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [reviewId]
    );

    return result[0];
  }
}