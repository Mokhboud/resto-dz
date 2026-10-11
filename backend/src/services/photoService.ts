import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RestaurantRepository } from '../repositories/restaurantRepository';
import { getStorageProvider } from './storage';

function extractPublicId(url: string): string {
  if (url.startsWith('/uploads/')) {
    return url.split('/').pop() || '';
  }
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/);
  if (!match) return '';
  return match[1].replace(/\.[a-zA-Z0-9]+$/, '');
}

export class PhotoService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  async uploadRestaurantPhoto(
    restaurantId: string,
    userId: string,
    userRoles: string[],
    file: any,
    caption?: string
  ) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    if (!isAdmin) {
      const isOwner = await this.restaurantRepository.isOwner(restaurantId, userId);
      if (!isOwner) {
        throw new AppError(403, 'You can only upload photos for your own restaurant', 'INSUFFICIENT_PERMISSIONS');
      }
    }

    const storage = getStorageProvider();
    const uploaded = await storage.upload(file, 'restaurants');

    const existingPhotos = await AppDataSource.query(
      `SELECT COUNT(*) as count FROM restaurant_photos WHERE restaurant_id = $1`,
      [restaurantId]
    );
    const isFirstPhoto = parseInt(existingPhotos[0]?.count || '0') === 0;

    const result = await AppDataSource.query(
      `INSERT INTO restaurant_photos (restaurant_id, user_id, url, thumbnail_url, caption, is_cover, sort_order, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
       RETURNING id, restaurant_id, url, thumbnail_url, caption, is_cover, sort_order, status, created_at`,
      [
        restaurantId,
        userId,
        uploaded.url,
        uploaded.thumbnailUrl,
        caption || null,
        isFirstPhoto,
        parseInt(existingPhotos[0]?.count || '0'),
      ]
    );

    return result[0];
  }

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

    await AppDataSource.query(
      `UPDATE restaurant_photos SET status = 'DELETED' WHERE id = $1`,
      [photoId]
    );

    try {
      const storage = getStorageProvider();
      const publicId = extractPublicId(photo.url);
      if (publicId) {
        await storage.delete(publicId);
      }
    } catch {
      // Photo may already be gone - ignore
    }

    return { id: photoId, deleted: true };
  }

  async setCoverPhoto(photoId: string, restaurantId: string, userId: string, userRoles: string[]) {
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN');

    if (!isAdmin) {
      const isOwner = await this.restaurantRepository.isOwner(restaurantId, userId);
      if (!isOwner) {
        throw new AppError(403, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
      }
    }

    await AppDataSource.query(
      `UPDATE restaurant_photos SET is_cover = false WHERE restaurant_id = $1`,
      [restaurantId]
    );

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
