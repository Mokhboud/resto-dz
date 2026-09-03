import axios from 'axios';
import { logger } from '../config/logger';

interface OSMRestaurant {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  cuisine?: string;
  category?: string;
  opening_hours?: string;
  osm_id: string;
}

export class OSMSearchService {
  private baseUrl = 'https://overpass-api.de/api/interpreter';

  /**
   * Search restaurants using OpenStreetMap Overpass API
   */
  async searchRestaurants(lat: number, lng: number, radiusKm: number = 5): Promise<OSMRestaurant[]> {
    const radiusMeters = radiusKm * 1000;

    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
        node["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      );
      out body;
    `;

    try {
      const response = await axios.post(this.baseUrl, query, {
        headers: { 'Content-Type': 'text/plain' },
        timeout: 30000,
      });

      const elements = response.data?.elements || [];

      const restaurants: OSMRestaurant[] = elements.map((el: any) => ({
        name: el.tags?.name || 'Unknown',
        address: [
          el.tags?.['addr:street'],
          el.tags?.['addr:housenumber'],
          el.tags?.['addr:city'],
        ].filter(Boolean).join(' '),
        latitude: el.lat,
        longitude: el.lon,
        phone: el.tags?.phone || el.tags?.['contact:phone'] || undefined,
        website: el.tags?.website || el.tags?.['contact:website'] || undefined,
        cuisine: el.tags?.cuisine || undefined,
        category: el.tags?.amenity || undefined,
        opening_hours: el.tags?.opening_hours || undefined,
        osm_id: `${el.type}-${el.id}`,
      }));

      logger.info(`OSM search found ${restaurants.length} restaurants`);
      return restaurants;
    } catch (error: any) {
      logger.error(`OSM search failed: ${error.message}`);
      // Return empty array on error — don't break the whole import
      return [];
    }
  }

  /**
   * Search restaurants by wilaya coordinates
   */
  async searchByWilaya(wilayaId: number, radiusKm: number = 10): Promise<OSMRestaurant[]> {
    // Wilaya center coordinates (major cities)
    const wilayaCenters: Record<number, { lat: number; lng: number }> = {
      1: { lat: 27.87, lng: -0.28 },    // Adrar
      2: { lat: 36.17, lng: 1.33 },     // Chlef
      3: { lat: 33.80, lng: 2.87 },     // Laghouat
      4: { lat: 35.87, lng: 7.12 },     // Oum El Bouaghi
      5: { lat: 35.55, lng: 6.17 },     // Batna
      6: { lat: 36.75, lng: 5.06 },     // Bejaia
      7: { lat: 34.85, lng: 5.73 },     // Biskra
      8: { lat: 31.61, lng: -2.23 },    // Bechar
      9: { lat: 36.47, lng: 2.83 },     // Blida
      10: { lat: 36.37, lng: 3.90 },    // Bouira
      11: { lat: 22.79, lng: 5.53 },    // Tamanrasset
      12: { lat: 35.40, lng: 8.12 },    // Tebessa
      13: { lat: 34.88, lng: -1.32 },   // Tlemcen
      14: { lat: 35.37, lng: 1.32 },    // Tiaret
      15: { lat: 36.72, lng: 4.05 },    // Tizi Ouzou
      16: { lat: 36.75, lng: 3.06 },    // Alger
      17: { lat: 34.67, lng: 3.25 },    // Djelfa
      18: { lat: 36.82, lng: 5.77 },    // Jijel
      19: { lat: 36.19, lng: 5.41 },    // Setif
      20: { lat: 34.83, lng: 0.15 },    // Saida
      21: { lat: 36.88, lng: 6.91 },    // Skikda
      22: { lat: 35.19, lng: -0.63 },   // Sidi Bel Abbes
      23: { lat: 36.90, lng: 7.77 },    // Annaba
      24: { lat: 36.46, lng: 7.43 },    // Guelma
      25: { lat: 36.37, lng: 6.61 },    // Constantine
      26: { lat: 36.27, lng: 2.75 },    // Medea
      27: { lat: 35.94, lng: 0.09 },    // Mostaganem
      28: { lat: 35.70, lng: 4.54 },    // M'Sila
      29: { lat: 35.40, lng: 0.14 },    // Mascara
      30: { lat: 31.95, lng: 5.33 },    // Ouargla
      31: { lat: 35.70, lng: -0.63 },   // Oran
      32: { lat: 33.68, lng: 1.02 },    // El Bayadh
      33: { lat: 26.51, lng: 8.48 },    // Illizi
      34: { lat: 36.07, lng: 4.76 },    // Bordj Bou Arreridj
      35: { lat: 36.77, lng: 3.48 },    // Boumerdes
      36: { lat: 36.77, lng: 8.31 },    // El Tarf
      37: { lat: 27.67, lng: -8.14 },   // Tindouf
      38: { lat: 35.61, lng: 1.81 },    // Tissemsilt
      39: { lat: 33.37, lng: 6.86 },    // El Oued
      40: { lat: 35.44, lng: 7.15 },    // Khenchela
      41: { lat: 36.28, lng: 7.95 },    // Souk Ahras
      42: { lat: 36.59, lng: 2.45 },    // Tipaza
      43: { lat: 36.45, lng: 6.26 },    // Mila
      44: { lat: 36.27, lng: 1.97 },    // Ain Defla
      45: { lat: 33.27, lng: -0.31 },   // Naama
      46: { lat: 35.31, lng: -1.14 },   // Ain Temouchent
      47: { lat: 32.49, lng: 3.67 },    // Ghardaia
      48: { lat: 35.74, lng: 0.56 },    // Relizane
      49: { lat: 29.26, lng: 0.23 },    // Timimoun
      50: { lat: 21.03, lng: 0.88 },    // Bordj Badji Mokhtar
      51: { lat: 34.43, lng: 5.22 },    // Ouled Djellal
      52: { lat: 30.13, lng: -2.10 },   // Beni Abbes
      53: { lat: 27.20, lng: 2.48 },    // In Salah
      54: { lat: 19.57, lng: 5.75 },    // In Guezzam
      55: { lat: 33.10, lng: 6.06 },    // Touggourt
      56: { lat: 24.55, lng: 9.49 },    // Djanet
      57: { lat: 33.64, lng: 5.92 },    // El M'Ghair
      58: { lat: 30.57, lng: 2.88 },    // El Meniaa
    };

    const center = wilayaCenters[wilayaId];
    if (!center) {
      throw new Error(`No coordinates for wilaya ${wilayaId}`);
    }

    return this.searchRestaurants(center.lat, center.lng, radiusKm);
  }
}

export const osmSearchService = new OSMSearchService();
export default osmSearchService;