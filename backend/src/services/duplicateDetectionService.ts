import { AppDataSource } from '../config/database';

interface DuplicateCheck {
  isDuplicate: boolean;
  level: 'STRONG' | 'POSSIBLE' | 'PHONE' | 'NONE';
  matchedRestaurantId?: string;
  matchedRestaurantName?: string;
  reason?: string;
}

export class DuplicateDetectionService {
  /**
   * Check if a restaurant is a duplicate
   */
  async checkDuplicate(data: {
    name: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
  }): Promise<DuplicateCheck> {
    const normalizedName = this.normalizeName(data.name);

    // Level 1: Same name + very close coordinates
    if (data.latitude && data.longitude) {
      const strongMatch = await AppDataSource.query(
        `SELECT id, name FROM restaurants 
         WHERE LOWER(REPLACE(name, ' ', '')) = $1 
           AND latitude IS NOT NULL 
           AND longitude IS NOT NULL
           AND ABS(latitude - $2) < 0.001 
           AND ABS(longitude - $3) < 0.001`,
        [normalizedName, data.latitude, data.longitude]
      );

      if (strongMatch.length > 0) {
        return {
          isDuplicate: true,
          level: 'STRONG',
          matchedRestaurantId: strongMatch[0].id,
          matchedRestaurantName: strongMatch[0].name,
          reason: 'Same name and very close coordinates',
        };
      }
    }

    // Level 3: Phone match
    if (data.phone) {
      const phoneMatch = await AppDataSource.query(
        `SELECT id, name FROM restaurants WHERE phone = $1`,
        [data.phone]
      );

      if (phoneMatch.length > 0) {
        return {
          isDuplicate: true,
          level: 'PHONE',
          matchedRestaurantId: phoneMatch[0].id,
          matchedRestaurantName: phoneMatch[0].name,
          reason: 'Phone number already exists',
        };
      }
    }

    // Level 2: Similar name (same wilaya)
    const similarMatch = await AppDataSource.query(
      `SELECT id, name FROM restaurants 
       WHERE LOWER(REPLACE(name, ' ', '')) = $1`,
      [normalizedName]
    );

    if (similarMatch.length > 0) {
      return {
        isDuplicate: true,
        level: 'POSSIBLE',
        matchedRestaurantId: similarMatch[0].id,
        matchedRestaurantName: similarMatch[0].name,
        reason: 'Similar name found',
      };
    }

    return {
      isDuplicate: false,
      level: 'NONE',
    };
  }

  /**
   * Normalize restaurant name for comparison
   */
  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special chars
      .trim();
  }
}

export const duplicateDetectionService = new DuplicateDetectionService();
export default duplicateDetectionService;