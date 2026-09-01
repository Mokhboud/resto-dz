import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';

export class ReviewResponseService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Create a response to a review
   */
  async createResponse(userId: string, reviewId: string, responseText: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    // Find the review
    const reviews = await AppDataSource.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [reviewId]
    );
    const review = reviews[0];

    if (!review) {
      throw new AppError(404, 'Review not found', 'REVIEW_NOT_FOUND');
    }

    // Check authorization
    if (!isAdmin) {
      const isOwner = await this.restaurantRepository.isOwner(review.restaurant_id, userId);
      if (!isOwner) {
        throw new AppError(403, 'You can only respond to reviews of your own restaurant', 'INSUFFICIENT_PERMISSIONS');
      }
    }

    // Check for existing response
    const existing = await AppDataSource.query(
      `SELECT id FROM review_responses WHERE review_id = $1`,
      [reviewId]
    );

    if (existing.length > 0) {
      throw new AppError(409, 'This review already has a response', 'RESPONSE_ALREADY_EXISTS');
    }

    // Create response
    const result = await AppDataSource.query(
      `INSERT INTO review_responses (review_id, restaurant_id, user_id, response)
       VALUES ($1, $2, $3, $4)
       RETURNING id, review_id, restaurant_id, user_id, response, created_at, updated_at`,
      [reviewId, review.restaurant_id, userId, responseText]
    );

    return result[0];
  }

  /**
   * Update a response
   */
  async updateResponse(responseId: string, userId: string, responseText: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    const responses = await AppDataSource.query(
      `SELECT * FROM review_responses WHERE id = $1`,
      [responseId]
    );
    const response = responses[0];

    if (!response) {
      throw new AppError(404, 'Response not found', 'RESPONSE_NOT_FOUND');
    }

    if (!isAdmin && response.user_id !== userId) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    const result = await AppDataSource.query(
      `UPDATE review_responses SET response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [responseText, responseId]
    );

    return result[0];
  }

  /**
   * Delete a response
   */
  async deleteResponse(responseId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    const responses = await AppDataSource.query(
      `SELECT * FROM review_responses WHERE id = $1`,
      [responseId]
    );
    const response = responses[0];

    if (!response) {
      throw new AppError(404, 'Response not found', 'RESPONSE_NOT_FOUND');
    }

    if (!isAdmin && response.user_id !== userId) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    await AppDataSource.query(
      `DELETE FROM review_responses WHERE id = $1`,
      [responseId]
    );

    return { id: responseId, deleted: true };
  }
}