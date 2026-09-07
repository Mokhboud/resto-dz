import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menuService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  /**
   * GET /api/restaurants/:id/menu — Public
   */
  async getMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const menu = await this.menuService.getRestaurantMenu(req.params.id);
      res.json({
        success: true,
        data: menu,
        message: 'Menu retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/restaurants/:id/menu/categories — Owner only
   */
  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(2).max(100),
        name_ar: z.string().max(100).optional(),
        display_order: z.number().int().optional(),
      });
      const validated = schema.parse(req.body);
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required', errorCode: 'AUTHENTICATION_REQUIRED' });
      }

      const category = await this.menuService.createCategory(req.params.id, userId, userRoles, validated);
      res.status(201).json({ success: true, data: category, message: 'Category created' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Validation error', errorCode: 'VALIDATION_ERROR', details: error.errors });
      }
      next(error);
    }
  }

  /**
   * POST /api/restaurants/:id/menu/items — Owner only
   */
  async createItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        category_id: z.string().uuid(),
        name: z.string().min(1).max(200),
        name_ar: z.string().max(200).optional(),
        description: z.string().max(1000).optional(),
        price: z.number().min(0).optional(),
        is_available: z.boolean().optional(),
        is_popular: z.boolean().optional(),
        is_spicy: z.boolean().optional(),
        is_vegetarian: z.boolean().optional(),
        display_order: z.number().int().optional(),
      });
      const validated = schema.parse(req.body);
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required', errorCode: 'AUTHENTICATION_REQUIRED' });
      }

      const item = await this.menuService.createItem(req.params.id, userId, userRoles, validated);
      res.status(201).json({ success: true, data: item, message: 'Item created' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Validation error', errorCode: 'VALIDATION_ERROR', details: error.errors });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/menu/categories/:id — Owner only
   */
  async deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required', errorCode: 'AUTHENTICATION_REQUIRED' });
      }
      const result = await this.menuService.deleteCategory(req.params.id, userId, userRoles);
      res.json({ success: true, data: result, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/menu/items/:id — Owner only
   */
  async deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required', errorCode: 'AUTHENTICATION_REQUIRED' });
      }
      const result = await this.menuService.deleteItem(req.params.id, userId, userRoles);
      res.json({ success: true, data: result, message: 'Item deleted' });
    } catch (error) {
      next(error);
    }
  }
}