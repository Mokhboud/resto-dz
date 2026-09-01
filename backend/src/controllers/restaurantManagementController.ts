import { Request, Response, NextFunction } from 'express';
import { RestaurantManagementService } from '../services/restaurantManagementService';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export class RestaurantManagementController {
  private managementService: RestaurantManagementService;

  constructor() {
    this.managementService = new RestaurantManagementService();
  }

  /**
   * POST /api/restaurants
   */
  async createRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(2).max(255),
        description: z.string().optional(),
        phone: z.string().min(8).max(20).optional(),
        secondary_phone: z.string().max(20).optional(),
        email: z.string().email().optional(),
        website: z.string().max(500).optional(),
        address: z.string().max(500).optional(),
        wilaya_id: z.number().int().positive().optional(),
        daira_id: z.number().int().positive().optional(),
        commune_id: z.number().int().positive().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        price_level: z.number().int().min(1).max(5).optional(),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const restaurant = await this.managementService.createRestaurant(userId, validated);

      res.status(201).json({
        success: true,
        data: restaurant,
        message: 'Restaurant created successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * PUT /api/restaurants/:id
   */
  async updateRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(2).max(255).optional(),
        description: z.string().optional(),
        phone: z.string().min(8).max(20).optional(),
        secondary_phone: z.string().max(20).optional(),
        email: z.string().email().optional(),
        website: z.string().max(500).optional(),
        address: z.string().max(500).optional(),
        wilaya_id: z.number().int().positive().optional(),
        daira_id: z.number().int().positive().optional(),
        commune_id: z.number().int().positive().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        price_level: z.number().int().min(1).max(5).optional(),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;
      const userRoles = req.user?.roles || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const restaurant = await this.managementService.updateRestaurant(
        req.params.id,
        userId,
        userRoles,
        validated
      );

      res.json({
        success: true,
        data: restaurant,
        message: 'Restaurant updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/restaurants/:id
   */
  async deleteRestaurant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRoles = req.user?.roles || [];

      await this.managementService.softDeleteRestaurant(req.params.id, userRoles);

      res.json({
        success: true,
        message: 'Restaurant deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/restaurants/:id/claim
   */
  async submitClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        phone: z.string().min(8).max(20).optional(),
        notes: z.string().max(1000).optional(),
        proofDocument: z.string().max(500).optional(),
      });

      const validated = schema.parse(req.body);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          errorCode: 'AUTHENTICATION_REQUIRED',
        });
      }

      const claim = await this.managementService.submitClaim(userId, req.params.id, validated);

      res.status(201).json({
        success: true,
        data: claim,
        message: 'Claim submitted successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errorCode: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  }
}