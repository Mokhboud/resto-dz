import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurantService';

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  /**
   * GET /api/restaurants
   */
  async getRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        wilaya_id: req.query.wilaya_id ? parseInt(req.query.wilaya_id as string) : undefined,
        category_id: req.query.category_id as string,
        cuisine_id: req.query.cuisine_id as string,
        min_rating: req.query.min_rating ? parseFloat(req.query.min_rating as string) : undefined,
        price_level: req.query.price_level ? parseInt(req.query.price_level as string) : undefined,
        verified: req.query.verified ? req.query.verified === 'true' : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sort: req.query.sort as string,
      };

      const result = await this.restaurantService.getRestaurants(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Restaurants retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/restaurants/:id
   */
  async getRestaurantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurant = await this.restaurantService.getRestaurantById(id);

      res.json({
        success: true,
        data: restaurant,
        message: 'Restaurant retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/restaurants/nearby
   */
  async getNearbyRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 5;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          success: false,
          message: 'Valid lat and lng query parameters are required',
          errorCode: 'INVALID_COORDINATES',
        });
      }

      const restaurants = await this.restaurantService.getNearbyRestaurants(lat, lng, radius, limit);

      res.json({
        success: true,
        data: restaurants,
        message: 'Nearby restaurants retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}