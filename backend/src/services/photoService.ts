import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';
import fs from 'fs';
import path from 'path';

export class PhotoService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Upload a restaurant photo
   */
  async uploadRestaurantPhoto(restaurantId: string, userId: string, userRoles: string[], file: any, caption?: string) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    // Check ownership
    if (!isAdmin) {
      const isOwner = await this.restaurantRepository.isOwner(restaurantId, userId);
      if (!isOwner) {
        throw new AppError(403, 'You can only upload photos for your own restaurant', 'INSUFFICIENT_PERMISSIONS');
      }
    }

    // Build file URL
    const relativePath = `/uploads/restaurants/${file.filename}`;

    // Determine if this is the first photo (make it cover)
    const existingPhotos = await AppDataSource.query(
      `SELECT COUNT(*) as count FROM restaurant_photos WHERE restaurant_id = $1`,
      [restaurantId]
    );
    const isFirstPhoto = parseInt(existingPhotos[0]?.count || '0') === 0;

    const result = await AppDataSource.query(
      `INSERT INTO restaurant_photos (restaurant_id, user_id, url, thumbnail_url, caption, is_cover, sort_order, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
       RETURNING id, restaurant_id, url, caption, is_cover, sort_order, status, created_at`,
      [
        restaurantId,
        userId,
        relativePath,
        relativePath, // Same URL for now, can generate thumbnails later
        caption || null,
        isFirstPhoto,
        existingPhotos[0]?.count || 0,
      ]
    );

    return result[0];
  }

  /**
   * Get restaurant photos
   */
  async getRestaurantPhotos(restaurantId: string) {
    const photos = await AppDataSource.query(
      `SELECT id, restaurant_id, url, thumbnail_url, caption, is_cover, sort_order, status, created_at
       FROM restaurant_photos
       WHERE restaurant_id = $1 AND status = 'ACTIVE'
       ORDER BY sort_order ASC`,
      [restaurantId]
    );
    return photos;
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    const photos = await AppDataSource.query(
      `SELECT * FROM restaurant_photos WHERE id = $1`,
      [photoId]
    );
    const photo = photos[0];

    if (!photo) {
      throw new AppError(404, 'Photo not found', 'PHOTO_NOT_FOUND');
    }

    if (!isAdmin && photo.user_id !== userId) {
      throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }

    // Soft delete the photo record
    await AppDataSource.query(
      `UPDATE restaurant_photos SET status = 'DELETED' WHERE id = $1`,
      [photoId]
    );

    // Try to delete the file from disk
    try {
      const filePath = path.join(__dirname, '../..', photo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      // File might not exist — that's OK
    }

    return { id: photoId, deleted: true };
  }

  /**
   * Set cover photo
   */
  async setCoverPhoto(photoId: string, restaurantId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    if (!isAdmin) {
      const isOwner = await this.restaurantRepository.isOwner(restaurantId, userId);
      if (!isOwner) {
        throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
      }
    }

    // Remove cover from all photos of this restaurant
    await AppDataSource.query(
      `UPDATE restaurant_photos SET is_cover = false WHERE restaurant_id = $1`,
      [restaurantId]
    );

    // Set new cover
    const result = await AppDataSource.query(
      `UPDATE restaurant_photos SET is_cover = true WHERE id = $1 AND restaurant_id = $2 RETURNING id, is_cover`,
      [photoId, restaurantId]
    );

    if (!result[0]) {
      throw new AppError(404, 'Photo not found', 'PHOTO_NOT_FOUND');
    }

    return result[0];
  }
}