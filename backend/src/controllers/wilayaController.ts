import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';

export class WilayaController {
  /**
   * GET /api/wilayas
   */
  async getWilayas(req: Request, res: Response, next: NextFunction) {
    try {
      const wilayas = await AppDataSource.query(
        `SELECT id, code, name_fr, name_ar, name_en, latitude, longitude
         FROM wilayas
         ORDER BY id ASC`
      );

      res.json({
        success: true,
        data: wilayas,
        message: 'Wilayas retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wilayas/:id/communes
   */
  async getCommunesByWilaya(req: Request, res: Response, next: NextFunction) {
    try {
      const wilayaId = parseInt(req.params.id);

      if (isNaN(wilayaId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid wilaya ID',
          errorCode: 'INVALID_WILAYA_ID',
        });
      }

      const communes = await AppDataSource.query(
        `SELECT id, code, name_fr, name_ar, name_en
         FROM communes
         WHERE wilaya_id = $1
         ORDER BY name_fr ASC`,
        [wilayaId]
      );

      res.json({
        success: true,
        data: communes,
        message: 'Communes retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wilayas/:id/dairas
   */
  async getDairasByWilaya(req: Request, res: Response, next: NextFunction) {
    try {
      const wilayaId = parseInt(req.params.id);

      if (isNaN(wilayaId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid wilaya ID',
          errorCode: 'INVALID_WILAYA_ID',
        });
      }

      const dairas = await AppDataSource.query(
        `SELECT id, code, name_fr, name_ar, name_en
         FROM dairas
         WHERE wilaya_id = $1
         ORDER BY name_fr ASC`,
        [wilayaId]
      );

      res.json({
        success: true,
        data: dairas,
        message: 'Dairas retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}