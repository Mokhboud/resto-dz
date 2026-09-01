import { AppDataSource } from '../config/database';
import { rankingConfig } from '../config/ranking';

export class RankingRepository {
  /**
   * Calculate global average rating (C) from valid published reviews
   */
  async getGlobalAverageRating(): Promise<number> {
    const result = await AppDataSource.query(
      `SELECT COALESCE(AVG(overall_rating), 0) as global_avg
       FROM reviews rev
       JOIN restaurants r ON r.id = rev.restaurant_id
       WHERE rev.status = 'PUBLISHED' 
         AND r.deleted_at IS NULL`
    );

    const avg = parseFloat(result[0]?.global_avg || '0');
    return avg > 0 ? avg : rankingConfig.DEFAULT_GLOBAL_AVERAGE;
  }

  /**
   * Get ranked restaurants using Bayesian-style formula
   */
  async getRankedRestaurants(filters: {
    wilaya_id?: number;
    category_id?: string;
    cuisine_id?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      wilaya_id,
      category_id,
      cuisine_id,
      page = 1,
      limit = rankingConfig.DEFAULT_LIMIT,
    } = filters;

    const offset = (page - 1) * limit;
    const m = rankingConfig.BAYESIAN_MIN_REVIEWS;

    // Get global average
    const C = await this.getGlobalAverageRating();

    let whereClause = `r.deleted_at IS NULL AND r.status = 'ACTIVE'`;
    const params: any[] = [];
    let paramIndex = 1;

    // Optional filters
    if (wilaya_id) {
      params.push(wilaya_id);
      whereClause += ` AND r.wilaya_id = $${paramIndex}`;
      paramIndex++;
    }

    if (category_id) {
      params.push(category_id);
      whereClause += ` AND EXISTS (SELECT 1 FROM restaurant_categories rc WHERE rc.restaurant_id = r.id AND rc.category_id = $${paramIndex})`;
      paramIndex++;
    }

    if (cuisine_id) {
      params.push(cuisine_id);
      whereClause += ` AND EXISTS (SELECT 1 FROM restaurant_cuisines rcu WHERE rcu.restaurant_id = r.id AND rcu.cuisine_id = $${paramIndex})`;
      paramIndex++;
    }

    // Bayesian ranking query
    // WR = (v / (v + m)) * R + (m / (v + m)) * C
    const query = `
      WITH restaurant_stats AS (
        SELECT 
          r.id,
          r.name,
          r.slug,
          r.description,
          r.address,
          r.latitude,
          r.longitude,
          r.price_level,
          r.verified,
          w.name_fr as wilaya_name,
          COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
          COUNT(rev.id) as review_count,
          CASE 
            WHEN COUNT(rev.id) = 0 THEN 0
            ELSE ROUND(
              (COUNT(rev.id)::decimal / (COUNT(rev.id) + ${m})) * AVG(rev.overall_rating) +
              (${m}::decimal / (COUNT(rev.id) + ${m})) * ${C}::decimal,
              4
            )
          END as ranking_score
        FROM restaurants r
        LEFT JOIN wilayas w ON r.wilaya_id = w.id
        LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
        WHERE ${whereClause}
        GROUP BY r.id, w.name_fr
      )
      SELECT 
        rs.*,
        ROW_NUMBER() OVER (ORDER BY rs.ranking_score DESC, rs.review_count DESC, rs.avg_rating DESC) as rank
      FROM restaurant_stats rs
      ORDER BY rs.ranking_score DESC, rs.review_count DESC, rs.avg_rating DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const restaurants = await AppDataSource.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM restaurants r
      WHERE ${whereClause}
    `;
    const countResult = await AppDataSource.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta: {
        bayesian_min_reviews: m,
        global_average_rating: parseFloat(C.toFixed(4)),
      },
    };
  }
}