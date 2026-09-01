import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

export class ImportService {
  /**
   * Import restaurants from CSV/JSON data
   */
  async importRestaurants(restaurants: any[], userId: string) {
    const results = {
      total: restaurants.length,
      imported: 0,
      skipped: 0,
      errors: [] as any[],
    };

    for (const data of restaurants) {
      try {
        // Check for duplicate by slug
        const slug = this.generateSlug(data.name);
        const existing = await AppDataSource.query(
          `SELECT id FROM restaurants WHERE slug = $1 OR (name = $2 AND address = $3)`,
          [slug, data.name, data.address || null]
        );

        if (existing.length > 0) {
          results.skipped++;
          results.errors.push({
            name: data.name,
            reason: 'DUPLICATE',
          });
          continue;
        }

        // Insert restaurant
        const result = await AppDataSource.query(
          `INSERT INTO restaurants (name, slug, description, phone, address, wilaya_id, latitude, longitude, price_level, status, verified, owner_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', false, $10)
           RETURNING id`,
          [
            data.name,
            slug,
            data.description || null,
            data.phone || null,
            data.address || null,
            data.wilaya_id || null,
            data.latitude || null,
            data.longitude || null,
            data.price_level || 1,
            userId,
          ]
        );

        const restaurantId = result[0].id;

        // Set PostGIS location
        if (data.latitude && data.longitude) {
          await AppDataSource.query(
            `UPDATE restaurants 
             SET location = ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography 
             WHERE id = $3`,
            [data.longitude, data.latitude, restaurantId]
          );
        }

        // Assign categories
        if (data.categories && Array.isArray(data.categories)) {
          for (const catName of data.categories) {
            await AppDataSource.query(
              `INSERT INTO restaurant_categories (restaurant_id, category_id)
               SELECT $1, id FROM categories WHERE name_fr ILIKE $2 OR name_en ILIKE $2
               ON CONFLICT DO NOTHING`,
              [restaurantId, `%${catName}%`]
            );
          }
        }

        results.imported++;
      } catch (error: any) {
        results.skipped++;
        results.errors.push({
          name: data.name,
          reason: error.message,
        });
        logger.error(`Import error for ${data.name}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Import communes from array data
   */
  async importCommunes(communes: any[]) {
    let imported = 0;
    let skipped = 0;

    for (const commune of communes) {
      try {
        await AppDataSource.query(
          `INSERT INTO communes (id, daira_id, wilaya_id, code, name_fr, name_ar, name_en, latitude, longitude)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
             daira_id = EXCLUDED.daira_id,
             wilaya_id = EXCLUDED.wilaya_id,
             code = EXCLUDED.code,
             name_fr = EXCLUDED.name_fr,
             name_ar = EXCLUDED.name_ar,
             name_en = EXCLUDED.name_en`,
          [
            commune.id,
            commune.daira_id,
            commune.wilaya_id,
            commune.code,
            commune.name_fr,
            commune.name_ar || commune.name_fr,
            commune.name_en || commune.name_fr,
            commune.latitude || null,
            commune.longitude || null,
          ]
        );
        imported++;
      } catch (error) {
        skipped++;
      }
    }

    return { imported, skipped, total: communes.length };
  }

  /**
   * Import dairas from array data
   */
  async importDairas(dairas: any[]) {
    let imported = 0;
    let skipped = 0;

    for (const daira of dairas) {
      try {
        await AppDataSource.query(
          `INSERT INTO dairas (id, wilaya_id, code, name_fr, name_ar, name_en)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             wilaya_id = EXCLUDED.wilaya_id,
             code = EXCLUDED.code,
             name_fr = EXCLUDED.name_fr,
             name_ar = EXCLUDED.name_ar,
             name_en = EXCLUDED.name_en`,
          [
            daira.id,
            daira.wilaya_id,
            daira.code,
            daira.name_fr,
            daira.name_ar || daira.name_fr,
            daira.name_en || daira.name_fr,
          ]
        );
        imported++;
      } catch (error) {
        skipped++;
      }
    }

    return { imported, skipped, total: dairas.length };
  }
}