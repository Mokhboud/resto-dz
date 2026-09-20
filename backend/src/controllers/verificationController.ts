import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class VerificationController {
  /**
   * GET /api/admin/restaurants/pending
   * Returns PENDING (user-submitted) + ACTIVE unverified (imported)
   */
  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = (page - 1) * limit;

      const restaurants = await AppDataSource.query(
        `SELECT r.id, r.name, r.address, r.phone, r.wilaya_id, r.data_source,
                r.verification_status, r.status, r.created_at,
                w.name_fr as wilaya_name
         FROM restaurants r
         LEFT JOIN wilayas w ON r.wilaya_id = w.id
         WHERE r.deleted_at IS NULL
           AND (
             r.status = 'PENDING'
             OR (r.status = 'ACTIVE' AND r.verification_status = 'UNVERIFIED')
           )
         ORDER BY 
           CASE WHEN r.status = 'PENDING' THEN 1 ELSE 2 END,
           r.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await AppDataSource.query(
        `SELECT COUNT(*) as total FROM restaurants 
         WHERE deleted_at IS NULL
           AND (
             status = 'PENDING'
             OR (status = 'ACTIVE' AND verification_status = 'UNVERIFIED')
           )`
      );
      const total = parseInt(countResult[0]?.total || '0');

      res.json({
        success: true,
        data: restaurants,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        message: 'Pending restaurants retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/restaurants/user-submitted
   */
  async getUserSubmitted(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await AppDataSource.query(
        `SELECT r.id, r.name, r.address, r.phone, r.wilaya_id, r.data_source,
                r.verification_status, r.status, r.created_at, r.owner_id,
                w.name_fr as wilaya_name,
                u.email as submitted_by
         FROM restaurants r
         LEFT JOIN wilayas w ON r.wilaya_id = w.id
         LEFT JOIN users u ON u.id = r.owner_id
         WHERE r.status IN ('PENDING', 'ACTIVE')
           AND (r.data_source = 'USER_SUBMITTED' OR r.owner_id IS NOT NULL)
         ORDER BY r.created_at DESC
         LIMIT 100`
      );

      res.json({
        success: true,
        data: restaurants,
        message: 'User-submitted restaurants retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/restaurants/:id/verify — Mark as verified AND activate
   */
  async verifyRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.query(
        `UPDATE restaurants 
         SET verification_status = 'VERIFIED', 
             verified = true, 
             status = 'ACTIVE',
             verified_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, name, verification_status, status`,
        [req.params.id]
      );

      if (!result[0]) {
        return res.status(404).json({ 
          success: false, 
          message: 'Restaurant not found', 
          errorCode: 'NOT_FOUND' 
        });
      }

      res.json({
        success: true,
        data: result[0],
        message: 'Restaurant verified and activated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/restaurants/:id/reject — Mark as unverified + reject
   */
  async rejectRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.query(
        `UPDATE restaurants 
         SET verification_status = 'UNVERIFIED', 
             verified = false,
             status = 'REJECTED',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, name, verification_status, status`,
        [req.params.id]
      );

      if (!result[0]) {
        return res.status(404).json({ 
          success: false, 
          message: 'Restaurant not found', 
          errorCode: 'NOT_FOUND' 
        });
      }

      res.json({
        success: true,
        data: result[0],
        message: 'Restaurant rejected',
      });
    } catch (error) {
      next(error);
    }
  }
}