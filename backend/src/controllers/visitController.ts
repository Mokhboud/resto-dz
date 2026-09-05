import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';

export class VisitController {
  /**
   * GET /api/admin/visits
   */
  async getVisits(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = (page - 1) * limit;

      const visits = await AppDataSource.query(
        `SELECT vl.id, vl.ip_address, vl.path, vl.method, vl.created_at,
                u.email, u.first_name, u.last_name
         FROM visit_logs vl
         LEFT JOIN users u ON u.id = vl.user_id
         ORDER BY vl.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await AppDataSource.query(`SELECT COUNT(*) as total FROM visit_logs`);
      const total = parseInt(countResult[0]?.total || '0');

      res.json({
        success: true,
        data: visits,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        message: 'Visits retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/login-history
   */
  async getLoginHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = (page - 1) * limit;

      const logins = await AppDataSource.query(
        `SELECT lh.id, lh.ip_address, lh.created_at,
                u.email, u.first_name, u.last_name
         FROM login_history lh
         JOIN users u ON u.id = lh.user_id
         ORDER BY lh.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await AppDataSource.query(`SELECT COUNT(*) as total FROM login_history`);
      const total = parseInt(countResult[0]?.total || '0');

      res.json({
        success: true,
        data: logins,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        message: 'Login history retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/stats
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalVisits, todayVisits, totalUsers, totalLogins] = await Promise.all([
        AppDataSource.query(`SELECT COUNT(*) as c FROM visit_logs`),
        AppDataSource.query(`SELECT COUNT(*) as c FROM visit_logs WHERE created_at::date = CURRENT_DATE`),
        AppDataSource.query(`SELECT COUNT(*) as c FROM users`),
        AppDataSource.query(`SELECT COUNT(*) as c FROM login_history`),
      ]);

      res.json({
        success: true,
        data: {
          total_visits: parseInt(totalVisits[0].c),
          today_visits: parseInt(todayVisits[0].c),
          total_users: parseInt(totalUsers[0].c),
          total_logins: parseInt(totalLogins[0].c),
        },
        message: 'Stats retrieved',
      });
    } catch (error) {
      next(error);
    }
  }
}