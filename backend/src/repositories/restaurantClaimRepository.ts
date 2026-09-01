import { AppDataSource } from '../config/database';

export class RestaurantClaimRepository {
  /**
   * Create a new claim
   */
  async create(data: {
    restaurantId: string;
    userId: string;
    phone?: string;
    notes?: string;
    proofDocument?: string;
  }) {
    const result = await AppDataSource.query(
      `INSERT INTO restaurant_claims (restaurant_id, user_id, phone, notes, proof_document)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.restaurantId, data.userId, data.phone || null, data.notes || null, data.proofDocument || null]
    );
    return result[0];
  }

  /**
   * Check if user already has an active claim for a restaurant
   */
  async hasActiveClaim(restaurantId: string, userId: string): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT id FROM restaurant_claims 
       WHERE restaurant_id = $1 AND user_id = $2 AND status = 'PENDING'`,
      [restaurantId, userId]
    );
    return result.length > 0;
  }

  /**
   * Get all claims (admin)
   */
  async findAll(page: number = 1, limit: number = 20, status?: string) {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let query = `
      SELECT 
        rc.*,
        r.name as restaurant_name,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        reviewer.first_name as reviewer_first_name,
        reviewer.last_name as reviewer_last_name
      FROM restaurant_claims rc
      JOIN restaurants r ON r.id = rc.restaurant_id
      JOIN users u ON u.id = rc.user_id
      LEFT JOIN users reviewer ON reviewer.id = rc.reviewed_by
    `;

    if (status) {
      params.push(status);
      query += ` WHERE rc.status = $1`;
    }

    query += ` ORDER BY rc.created_at DESC`;

    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const claims = await AppDataSource.query(query, params);
    return claims;
  }

  /**
   * Get claim by ID
   */
  async findById(id: string) {
    const result = await AppDataSource.query(
      `SELECT * FROM restaurant_claims WHERE id = $1`,
      [id]
    );
    return result[0] || null;
  }

  /**
   * Update claim status
   */
  async updateStatus(id: string, status: string, reviewedBy: string) {
    const result = await AppDataSource.query(
      `UPDATE restaurant_claims 
       SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, reviewedBy, id]
    );
    return result[0] || null;
  }
}