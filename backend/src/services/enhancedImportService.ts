import { AppDataSource } from '../config/database';
import { osmSearchService } from './osmSearchService';
import { duplicateDetectionService } from './duplicateDetectionService';
import { logger } from '../config/logger';

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  duplicates: number;
  restaurants: any[];
}

export class EnhancedImportService {
  /**
   * Search restaurants from OSM
   */
  async searchRestaurants(wilayaId: number, radiusKm: number = 5) {
    return osmSearchService.searchByWilaya(wilayaId, radiusKm);
  }

  /**
   * Preview import — check duplicates without saving
   */
  async previewImport(restaurants: any[]) {
    const preview = [];

    for (const r of restaurants) {
      const dupCheck = await duplicateDetectionService.checkDuplicate({
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
      });

      preview.push({
        ...r,
        duplicate_status: dupCheck.level,
        duplicate_reason: dupCheck.reason,
        matched_restaurant: dupCheck.matchedRestaurantName || null,
        ready_to_import: !dupCheck.isDuplicate,
      });
    }

    return preview;
  }

  /**
   * Bulk import selected restaurants
   */
  async importRestaurants(restaurants: any[], adminId: string, wilayaId: number, source: string) {
    const result: ImportResult = {
      total: restaurants.length,
      imported: 0,
      skipped: 0,
      duplicates: 0,
      restaurants: [],
    };

    for (const r of restaurants) {
      const dupCheck = await duplicateDetectionService.checkDuplicate({
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
      });

      if (dupCheck.isDuplicate) {
        result.duplicates++;
        result.skipped++;
        continue;
      }

      try {
        const slug = this.generateSlug(r.name);
        const inserted = await AppDataSource.query(
          `INSERT INTO restaurants (name, slug, description, phone, address, wilaya_id, latitude, longitude, status, verified, ownership_status, data_source, source_reference, imported_at, imported_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', false, 'UNCLAIMED', $9, $10, CURRENT_TIMESTAMP, $11)
           ON CONFLICT (slug) DO NOTHING
           RETURNING id, name`,
          [
            r.name,
            slug,
            r.cuisine ? `${r.cuisine} restaurant` : null,
            r.phone || null,
            r.address || null,
            wilayaId,
            r.latitude,
            r.longitude,
            source,
            r.osm_id,
            adminId,
          ]
        );

        if (inserted[0]?.id) {
          // Set PostGIS location
          await AppDataSource.query(
            `UPDATE restaurants SET location = ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography WHERE id = $3`,
            [r.longitude, r.latitude, inserted[0].id]
          );

          result.imported++;
          result.restaurants.push(inserted[0]);
        } else {
          result.skipped++;
        }
      } catch (error: any) {
        logger.error(`Import error for ${r.name}: ${error.message}`);
        result.skipped++;
      }
    }

    // Save import history
    await AppDataSource.query(
      `INSERT INTO import_history (admin_id, data_source, wilaya_id, total_discovered, total_imported, total_skipped, total_duplicates)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [adminId, source, wilayaId, result.total, result.imported, result.skipped, result.duplicates]
    );

    return result;
  }

  /**
   * Get import history
   */
  async getImportHistory(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const history = await AppDataSource.query(
      `SELECT ih.*, u.email as admin_email
       FROM import_history ih
       LEFT JOIN users u ON u.id = ih.admin_id
       ORDER BY ih.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await AppDataSource.query(`SELECT COUNT(*) as total FROM import_history`);
    const total = parseInt(countResult[0]?.total || '0');

    return {
      data: history,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const enhancedImportService = new EnhancedImportService();
export default enhancedImportService;