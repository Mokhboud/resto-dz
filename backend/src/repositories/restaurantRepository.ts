import { AppDataSource } from '../config/database';

export class RestaurantRepository {
  /**
   * Get all restaurants with filters and pagination
   */
  async findAll(filters: {
    search?: string;
    wilaya_id?: number;
    category_id?: string;
    cuisine_id?: string;
    min_rating?: number;
    price_level?: number;
    verified?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    const {
      search,
      wilaya_id,
      category_id,
      cuisine_id,
      min_rating,
      price_level,
      verified,
      page = 1,
      limit = 20,
      sort = 'created_at',
    } = filters;

    const offset = (page - 1) * limit;

    let query = `
      SELECT DISTINCT 
        r.id, r.name, r.slug, r.description, r.phone, r.address,
        r.latitude, r.longitude, r.price_level, r.status, r.verified,
        r.created_at,
        w.name_fr as wilaya_name, w.name_ar as wilaya_name_ar,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count
      FROM restaurants r
      LEFT JOIN wilayas w ON r.wilaya_id = w.id
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      LEFT JOIN restaurant_categories rc ON rc.restaurant_id = r.id
      LEFT JOIN restaurant_cuisines rcu ON rcu.restaurant_id = r.id
      WHERE r.status = 'ACTIVE' AND r.deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.name ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`;
      paramIndex++;
    }

    if (wilaya_id) {
      params.push(wilaya_id);
      query += ` AND r.wilaya_id = $${paramIndex}`;
      paramIndex++;
    }

    if (category_id) {
      params.push(category_id);
      query += ` AND rc.category_id = $${paramIndex}`;
      paramIndex++;
    }

    if (cuisine_id) {
      params.push(cuisine_id);
      query += ` AND rcu.cuisine_id = $${paramIndex}`;
      paramIndex++;
    }

    if (price_level) {
      params.push(price_level);
      query += ` AND r.price_level = $${paramIndex}`;
      paramIndex++;
    }

    if (verified !== undefined) {
      params.push(verified);
      query += ` AND r.verified = $${paramIndex}`;
      paramIndex++;
    }

    query += ` GROUP BY r.id, w.name_fr, w.name_ar`;

    if (min_rating) {
      params.push(min_rating);
      query += ` HAVING COALESCE(AVG(rev.overall_rating), 0) >= $${paramIndex}`;
      paramIndex++;
    }

    // Sorting
    const sortOptions: Record<string, string> = {
      created_at: 'r.created_at DESC',
      rating: 'avg_rating DESC',
      name: 'r.name ASC',
      review_count: 'review_count DESC',
    };
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.created_at}`;

    // Pagination
    params.push(limit);
    query += ` LIMIT $${paramIndex}`;
    paramIndex++;

    params.push(offset);
    query += ` OFFSET $${paramIndex}`;

    const restaurants = await AppDataSource.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM restaurants r
      LEFT JOIN restaurant_categories rc ON rc.restaurant_id = r.id
      LEFT JOIN restaurant_cuisines rcu ON rcu.restaurant_id = r.id
      WHERE r.status = 'ACTIVE'
    `;
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (r.name ILIKE $${countParamIndex} OR r.description ILIKE $${countParamIndex})`;
      countParamIndex++;
    }
    if (wilaya_id) {
      countParams.push(wilaya_id);
      countQuery += ` AND r.wilaya_id = $${countParamIndex}`;
      countParamIndex++;
    }
    if (category_id) {
      countParams.push(category_id);
      countQuery += ` AND rc.category_id = $${countParamIndex}`;
      countParamIndex++;
    }
    if (cuisine_id) {
      countParams.push(cuisine_id);
      countQuery += ` AND rcu.cuisine_id = $${countParamIndex}`;
      countParamIndex++;
    }
    if (price_level) {
      countParams.push(price_level);
      countQuery += ` AND r.price_level = $${countParamIndex}`;
      countParamIndex++;
    }
    if (verified !== undefined) {
      countParams.push(verified);
      countQuery += ` AND r.verified = $${countParamIndex}`;
      countParamIndex++;
    }

    const countResult = await AppDataSource.query(countQuery, countParams);
    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find restaurant by ID with all details
   */
  async findById(id: string) {
    const restaurant = await AppDataSource.query(
      `SELECT 
        r.*,
        w.name_fr as wilaya_name, w.name_ar as wilaya_name_ar,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count
      FROM restaurants r
      LEFT JOIN wilayas w ON r.wilaya_id = w.id
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      WHERE r.id = $1 AND r.status = 'ACTIVE' AND r.deleted_at IS NULL
      GROUP BY r.id, w.name_fr, w.name_ar`,
      [id]
    );

    if (!restaurant[0]) return null;

    // Get categories
    const categories = await AppDataSource.query(
      `SELECT c.id, c.name_fr, c.name_ar, c.name_en, c.icon
       FROM categories c
       JOIN restaurant_categories rc ON rc.category_id = c.id
       WHERE rc.restaurant_id = $1`,
      [id]
    );

    // Get cuisines
    const cuisines = await AppDataSource.query(
      `SELECT c.id, c.name_fr, c.name_ar, c.name_en, c.icon
       FROM cuisines c
       JOIN restaurant_cuisines rcu ON rcu.cuisine_id = c.id
       WHERE rcu.restaurant_id = $1`,
      [id]
    );

    // Get opening hours
    const openingHours = await AppDataSource.query(
      `SELECT day_of_week, open_time, close_time, is_closed
       FROM opening_hours
       WHERE restaurant_id = $1
       ORDER BY day_of_week`,
      [id]
    );

    // Get photos
    const photos = await AppDataSource.query(
      `SELECT id, url, thumbnail_url, caption, is_cover, sort_order
       FROM restaurant_photos
       WHERE restaurant_id = $1 AND status = 'ACTIVE'
       ORDER BY sort_order`,
      [id]
    );

    return {
      ...restaurant[0],
      categories,
      cuisines,
      opening_hours: openingHours,
      photos,
    };
  }

  /**
   * Find restaurants near coordinates using PostGIS
   */
  async findNearby(lat: number, lng: number, radiusKm: number = 5, limit: number = 20) {
    const restaurants = await AppDataSource.query(
      `SELECT 
        r.id, r.name, r.slug, r.description, r.address,
        r.latitude, r.longitude, r.price_level, r.status, r.verified,
        w.name_fr as wilaya_name,
        ST_Distance(r.location, ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography) / 1000 as distance_km,
        COALESCE(AVG(rev.overall_rating), 0) as avg_rating,
        COUNT(rev.id) as review_count
      FROM restaurants r
      LEFT JOIN wilayas w ON r.wilaya_id = w.id
      LEFT JOIN reviews rev ON rev.restaurant_id = r.id AND rev.status = 'PUBLISHED'
      WHERE r.status = 'ACTIVE' AND r.deleted_at IS NULL
        AND r.location IS NOT NULL
        AND ST_DWithin(r.location, ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography, $3 * 1000)
      GROUP BY r.id, w.name_fr
      ORDER BY distance_km ASC
      LIMIT $4`,
      [lng, lat, radiusKm, limit]
    );

    return restaurants;
  }

  /**
   * Create a new restaurant (for authenticated users)
   */
  async createRestaurant(data: {
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    secondary_phone?: string;
    email?: string;
    website?: string;
    address?: string;
    wilaya_id?: number;
    daira_id?: number;
    commune_id?: number;
    latitude?: number;
    longitude?: number;
    price_level?: number;
    owner_id: string;
  }) {
    const result = await AppDataSource.query(
      `INSERT INTO restaurants (name, slug, description, phone, secondary_phone, email, website, address, wilaya_id, daira_id, commune_id, latitude, longitude, price_level, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'PENDING', $15)
       RETURNING *`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.phone || null,
        data.secondary_phone || null,
        data.email || null,
        data.website || null,
        data.address || null,
        data.wilaya_id || null,
        data.daira_id || null,
        data.commune_id || null,
        data.latitude || null,
        data.longitude || null,
        data.price_level || 1,
        data.owner_id,
      ]
    );

    // Set location using PostGIS
    if (data.latitude && data.longitude) {
      await AppDataSource.query(
        `UPDATE restaurants 
         SET location = ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography 
         WHERE id = $3`,
        [data.longitude, data.latitude, result[0].id]
      );
    }

    return result[0];
  }

  /**
   * Update a restaurant
   */
  async updateRestaurant(id: string, data: any) {
    const allowedFields = [
      'name', 'description', 'phone', 'secondary_phone', 'email', 'website',
      'address', 'wilaya_id', 'daira_id', 'commune_id', 'latitude', 'longitude',
      'price_level', 'status',
    ];

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        params.push(data[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return null;
    }

    params.push(id);
    const query = `
      UPDATE restaurants 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await AppDataSource.query(query, params);

    // Update location if lat/lng provided
    if (data.latitude && data.longitude) {
      await AppDataSource.query(
        `UPDATE restaurants 
         SET location = ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography 
         WHERE id = $3`,
        [data.longitude, data.latitude, id]
      );
    }

    return result[0] || null;
  }

  /**
   * Soft delete a restaurant
   */
  async softDeleteRestaurant(id: string) {
    const result = await AppDataSource.query(
      `UPDATE restaurants 
       SET status = 'DELETED', deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );
    return result[0] || null;
  }

  /**
   * Check if user is the owner of a restaurant
   */
  async isOwner(restaurantId: string, userId: string): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2`,
      [restaurantId, userId]
    );
    return result.length > 0;
  }

  /**
   * Get restaurant by ID (including deleted) for management
   */
  async findByIdForManagement(id: string) {
    const result = await AppDataSource.query(
      `SELECT * FROM restaurants WHERE id = $1`,
      [id]
    );
    return result[0] || null;
  }
}