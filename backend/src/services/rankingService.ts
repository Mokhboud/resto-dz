import { RankingRepository } from '../repositories/rankingRepository';
import { AppError } from '../middleware/errorHandler';

export class RankingService {
  private rankingRepository: RankingRepository;

  constructor() {
    this.rankingRepository = new RankingRepository();
  }

  /**
   * Get ranked restaurants using Bayesian-style formula
   * 
   * Formula:
   * WR = (v / (v + m)) * R + (m / (v + m)) * C
   * 
   * Where:
   * - R = restaurant's average rating
   * - v = number of reviews
   * - C = global average rating
   * - m = configurable minimum review threshold
   */
  async getRankedRestaurants(filters: {
    wilaya_id?: number;
    category_id?: string;
    cuisine_id?: string;
    page?: number;
    limit?: number;
  }) {
    // Validate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    if (page < 1) {
      throw new AppError(400, 'Page must be at least 1', 'INVALID_PAGE');
    }

    if (limit < 1 || limit > 100) {
      throw new AppError(400, 'Limit must be between 1 and 100', 'INVALID_LIMIT');
    }

    return this.rankingRepository.getRankedRestaurants({
      ...filters,
      page,
      limit,
    });
  }
}