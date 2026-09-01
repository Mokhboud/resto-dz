import { Request, Response, NextFunction } from 'express';
import { PhotoService } from '../services/photoService';
import { AuthRequest } from '../middleware/auth';

export class PhotoController {
  private photoService: PhotoService;

  constructor() {
    this.photoService = new PhotoService();
  }

  /**
   * GET /api/restaurants/:id/photos
   */
  async getRestaurantPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const photos = await this.photoService.getRestaurantPhotos(req.params.id);

      res.json({
        success: true,
        data: photos,
        message: 'Photos retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/restaurants/:id/photos (multipart/form-data)
   */
  async uploadRestaurantPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file;
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          errorCode: 'FILE_REQUIRED',
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const caption = req.body.caption;

      const photo = await this.photoService.uploadRestaurantPhoto(
        req.params.id,
        userId,
        userRoles,
        file,
        caption
      );

      res.status(201).json({
        success: true,
        data: photo,
        message: 'Photo uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/restaurant-photos/:photoId
   */
  async deletePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.photoService.deletePhoto(req.params.photoId, userId, userRoles);

      res.json({
        success: true,
        data: result,
        message: 'Photo deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/restaurants/:id/photos/:photoId/cover
   */
  async setCoverPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const result = await this.photoService.setCoverPhoto(
        req.params.photoId,
        req.params.id,
        userId,
        userRoles
      );

      res.json({
        success: true,
        data: result,
        message: 'Cover photo updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}