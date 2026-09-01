import { RestaurantRepository } from '../repositories/restaurantRepository';
import { AppError } from '../middleware/errorHandler';

export class RestaurantService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  /**
   * Get all restaurants with filters
   */
  async getRestaurants(filters: any) {
    return this.restaurantRepository.findAll(filters);
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurantById(id: string) {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found', 'RESTAURANT_NOT_FOUND');
    }

    return restaurant;
  }

  /**
   * Get nearby restaurants
   */
  async getNearbyRestaurants(lat: number, lng: number, radiusKm: number = 5, limit: number = 20) {
    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new AppError(400, 'Invalid coordinates', 'INVALID_COORDINATES');
    }

    // Validate radius
    if (radiusKm <= 0 || radiusKm > 100) {
      throw new AppError(400, 'Radius must be between 0 and 100 km', 'INVALID_RADIUS');
    }

    return this.restaurantRepository.findNearby(lat, lng, radiusKm, limit);
  }
}