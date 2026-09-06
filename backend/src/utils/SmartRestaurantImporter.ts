import { Client } from 'pg';
import slugify from 'slugify';
import axios from 'axios';

export interface RawRestaurant {
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  wilaya_id: number;
  latitude: number;
  longitude: number;
  category: string | null;
  cuisine: string | null;
  source: string;
  source_url: string | null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SmartRestaurantImporter {
  private client: Client;
  private stats = {
    totalBefore: 0,
    totalAfter: 0,
    imported: 0,
    skipped: 0,
    duplicates: 0,
    byWilaya: {} as Record<number, number>,
  };

  constructor(connectionString: string) {
    this.client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }

  async connect() {
    await this.client.connect();
    const res = await this.client.query('SELECT COUNT(*) FROM restaurants WHERE status = \'ACTIVE\'');
    this.stats.totalBefore = parseInt(res.rows[0].count, 10);
  }

  async close() {
    const res = await this.client.query('SELECT COUNT(*) FROM restaurants WHERE status = \'ACTIVE\'');
    this.stats.totalAfter = parseInt(res.rows[0].count, 10);
    await this.client.end();
  }

  private generateSlug(name: string, wilaya_id: number, lat: number, lng: number): string {
    const baseSlug = slugify(name, { lower: true, strict: true });
    return `${baseSlug}-${wilaya_id}-${Math.round(lat * 100)}-${Math.round(lng * 100)}`;
  }

  async fetchFromOSM(wilayaId: number, bbox: string, maxRetries: number = 3): Promise<RawRestaurant[]> {
    // NOTE: No "amenity=cafe" — restaurants and fast_food only
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="restaurant"](${bbox});
        node["amenity"="fast_food"](${bbox});
      );
      out body 100;
    `;

    const mirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ];

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const mirror = mirrors[attempt % mirrors.length];

      try {
        const response = await axios.post(mirror, query, {
          headers: {
            'Content-Type': 'text/plain',
            'User-Agent': 'RestoDZ/1.0 (restaurant platform)',
          },
          timeout: 60000,
        });

        const elements = response.data?.elements || [];
        const restaurants: RawRestaurant[] = [];

        for (const el of elements) {
          if (!el.tags?.name) continue;

          restaurants.push({
            name: el.tags.name,
            description: el.tags.description || null,
            phone: el.tags.phone || el.tags['contact:phone'] || null,
            address: el.tags['addr:street']
              ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim()
              : null,
            wilaya_id: wilayaId,
            latitude: el.lat,
            longitude: el.lon,
            category: this.mapCuisine(el.tags.cuisine),
            cuisine: el.tags.cuisine || null,
            source: 'OpenStreetMap',
            source_url: `https://www.openstreetmap.org/node/${el.id}`,
          });
        }

        return restaurants;
      } catch (error: any) {
        const status = error.response?.status;
        console.log(`  🔄 Attempt ${attempt + 1} failed (${status || error.message?.slice(0, 30)})`);
        const waitTime = 5000 * Math.pow(3, attempt);
        await sleep(waitTime);
      }
    }

    console.log(`  ❌ All mirrors failed for wilaya ${wilayaId}`);
    return [];
  }

  private mapCuisine(cuisine: string | undefined): string {
    if (!cuisine) return 'Restaurant';
    const c = cuisine.toLowerCase();
    if (c.includes('pizza')) return 'Pizza';
    if (c.includes('burger') || c.includes('fast_food')) return 'Fast Food';
    if (c.includes('seafood') || c.includes('fish')) return 'Poisson';
    if (c.includes('italian')) return 'Italien';
    if (c.includes('traditional') || c.includes('algerian')) return 'Traditionnel Algérien';
    if (c.includes('asian') || c.includes('chinese') || c.includes('sushi')) return 'Asiatique';
    if (c.includes('grill')) return 'Grill';
    // No café category — if cuisine is cafe/coffee, default to Restaurant
    return 'Restaurant';
  }

  async importOne(rest: RawRestaurant): Promise<'imported' | 'duplicate' | 'error'> {
    if (!rest.latitude || !rest.longitude || !rest.wilaya_id) {
      return 'error';
    }

    const slug = this.generateSlug(rest.name, rest.wilaya_id, rest.latitude, rest.longitude);

    try {
      const existing = await this.client.query(
        `SELECT id FROM restaurants WHERE LOWER(name) = LOWER($1) AND wilaya_id = $2 LIMIT 1`,
        [rest.name, rest.wilaya_id]
      );

      if (existing.rows.length > 0) {
        this.stats.duplicates++;
        return 'duplicate';
      }

      const result = await this.client.query(
        `INSERT INTO restaurants (
          name, slug, description, phone, address, wilaya_id,
          latitude, longitude, price_level,
          status, ownership_status, verified, data_source, source_reference
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, 2,
          'ACTIVE', 'UNCLAIMED', false, $9, $10
        ) RETURNING id`,
        [
          rest.name, slug, rest.description, rest.phone, rest.address,
          rest.wilaya_id, rest.latitude, rest.longitude,
          rest.source, rest.source_url,
        ]
      );

      const restaurantId = result.rows[0].id;

      await this.client.query(
        `UPDATE restaurants SET location = ST_SetSRID(ST_MakePoint($1::double precision, $2::double precision), 4326)::geography WHERE id = $3`,
        [rest.longitude, rest.latitude, restaurantId]
      );

      if (rest.category && rest.category !== 'Restaurant') {
        const catResult = await this.client.query(
          `SELECT id FROM categories WHERE name_fr ILIKE $1 OR name_en ILIKE $1 LIMIT 1`,
          [`%${rest.category}%`]
        );
        if (catResult.rows[0]) {
          await this.client.query(
            `INSERT INTO restaurant_categories (restaurant_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [restaurantId, catResult.rows[0].id]
          );
        }
      }

      this.stats.imported++;
      this.stats.byWilaya[rest.wilaya_id] = (this.stats.byWilaya[rest.wilaya_id] || 0) + 1;
      return 'imported';
    } catch (error: any) {
      this.stats.skipped++;
      return 'error';
    }
  }

  async importWilaya(wilayaId: number, bbox: string, delayBetweenRestaurants: number = 50): Promise<void> {
    console.log(`\n📍 Importing Wilaya ${wilayaId}...`);
    const restaurants = await this.fetchFromOSM(wilayaId, bbox);

    if (restaurants.length === 0) {
      console.log(`  ⏭️ No restaurants found for wilaya ${wilayaId}`);
      return;
    }

    console.log(`  ✅ Fetched ${restaurants.length} restaurants`);

    let imported = 0;
    let duplicates = 0;

    for (const rest of restaurants) {
      const result = await this.importOne(rest);
      if (result === 'imported') {
        imported++;
        console.log(`    ✅ ${rest.name}`);
      } else if (result === 'duplicate') {
        duplicates++;
      }
      await sleep(delayBetweenRestaurants);
    }

    console.log(`  📊 Wilaya ${wilayaId}: ${imported} imported, ${duplicates} duplicates`);
  }

  generateReport() {
    console.log('\n=============================');
    console.log('📊 SMART IMPORT REPORT');
    console.log('=============================');
    console.log(`Total Before: ${this.stats.totalBefore}`);
    console.log(`Total After:  ${this.stats.totalAfter}`);
    console.log(`✅ Imported:   ${this.stats.imported}`);
    console.log(`⏭️ Skipped:    ${this.stats.skipped}`);
    console.log(`  - Duplicates: ${this.stats.duplicates}`);
    console.log('=============================\n');
  }
}