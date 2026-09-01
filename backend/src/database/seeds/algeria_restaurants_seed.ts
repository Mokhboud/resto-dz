import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';
import { ImportService } from '../../services/importService';

const algeriaRestaurants = [
  // Alger (16)
  { name: 'Le Gourmet', description: 'French fine dining', phone: '021234567', address: 'Rue Didouche Mourad, Alger Centre', wilaya_id: 16, latitude: 36.7650, longitude: 3.0510, price_level: 3, categories: ['Gastronomique', 'Français'] },
  { name: 'Café Tantonville', description: 'Historic café in downtown Alger', phone: '021345678', address: 'Place Maurice Audin, Alger Centre', wilaya_id: 16, latitude: 36.7610, longitude: 3.0550, price_level: 1, categories: ['Café'] },
  { name: 'Restaurant El Djenina', description: 'Traditional Algerian couscous', phone: '021456789', address: 'Boulevard Zirout Youcef, Alger Centre', wilaya_id: 16, latitude: 36.7630, longitude: 3.0490, price_level: 2, categories: ['Traditionnel Algérien'] },
  { name: 'Tacos de Bruxelles', description: 'Popular fast food tacos', phone: '0550123456', address: 'Rue Hassiba Ben Bouali, Alger', wilaya_id: 16, latitude: 36.7480, longitude: 3.0600, price_level: 1, categories: ['Fast Food'] },
  { name: 'Dar Zellij', description: 'Upscale Algerian cuisine', phone: '021567890', address: 'Chemin de la Madeleine, El Biar', wilaya_id: 16, latitude: 36.7540, longitude: 3.0300, price_level: 4, categories: ['Gastronomique', 'Traditionnel Algérien'] },

  // Oran (31)
  { name: 'Le Petit Resto', description: 'Mediterranean cuisine', phone: '041234567', address: 'Boulevard de la Soummam, Oran', wilaya_id: 31, latitude: 35.7010, longitude: -0.6380, price_level: 2, categories: ['Traditionnel Algérien'] },
  { name: 'Pizza Uno Oran', description: 'Italian pizza and pasta', phone: '041345678', address: 'Rue Larbi Ben Mhidi, Oran', wilaya_id: 31, latitude: 35.7040, longitude: -0.6450, price_level: 2, categories: ['Pizza', 'Italien'] },
  { name: 'Dar El Bahdja Oran', description: 'Traditional Algerian', phone: '041456789', address: 'Front de Mer, Oran', wilaya_id: 31, latitude: 35.7070, longitude: -0.6420, price_level: 2, categories: ['Traditionnel Algérien'] },

  // Constantine (25)
  { name: 'Restaurant Cirta', description: 'Constantine traditional cuisine', phone: '031234567', address: 'Rue Belouizdad, Constantine', wilaya_id: 25, latitude: 36.3650, longitude: 6.6140, price_level: 2, categories: ['Traditionnel Algérien'] },
  { name: 'Fast Food Numidia', description: 'Quick bites and burgers', phone: '031345678', address: 'Avenue de la République, Constantine', wilaya_id: 25, latitude: 36.3590, longitude: 6.6090, price_level: 1, categories: ['Fast Food', 'Burger'] },

  // Annaba (23)
  { name: 'Restaurant Le Phare', description: 'Seafood and Mediterranean', phone: '038234567', address: 'Cours de la Révolution, Annaba', wilaya_id: 23, latitude: 36.9000, longitude: 7.7670, price_level: 3, categories: ['Fruits de mer', 'Poisson'] },
  { name: 'Café Saf-Saf', description: 'Traditional café', phone: '038345678', address: 'Place du 1er Novembre, Annaba', wilaya_id: 23, latitude: 36.8990, longitude: 7.7600, price_level: 1, categories: ['Café'] },

  // Tlemcen (13)
  { name: 'Restaurant Les Zianides', description: 'Tlemcen traditional dishes', phone: '043234567', address: 'Rue de la Paix, Tlemcen', wilaya_id: 13, latitude: 34.8820, longitude: -1.3150, price_level: 2, categories: ['Traditionnel Algérien'] },

  // Batna (5)
  { name: 'Restaurant Aurès', description: 'Aurès region specialties', phone: '033234567', address: 'Avenue de l\'Indépendance, Batna', wilaya_id: 5, latitude: 35.5550, longitude: 6.1740, price_level: 2, categories: ['Traditionnel Algérien', 'Grill'] },

  // Setif (19)
  { name: 'Restaurant High Plateau', description: 'Setif couscous and grill', phone: '036234567', address: 'Rue des Frères Achour, Sétif', wilaya_id: 19, latitude: 36.1910, longitude: 5.4100, price_level: 2, categories: ['Traditionnel Algérien', 'Grill'] },

  // Blida (9)
  { name: 'Restaurant Les Orangers', description: 'Orange grove themed restaurant', phone: '025234567', address: 'Boulevard des Martyrs, Blida', wilaya_id: 9, latitude: 36.4720, longitude: 2.8280, price_level: 2, categories: ['Traditionnel Algérien'] },
];

export const seedAlgeriaRestaurants = async () => {
  try {
    // Get admin user ID for ownership
    const adminResult = await AppDataSource.query(
      `SELECT id FROM users WHERE email = 'admin@resto.dz' LIMIT 1`
    );
    const adminId = adminResult[0]?.id;

    const importService = new ImportService();
    const results = await importService.importRestaurants(algeriaRestaurants, adminId || '00000000-0000-0000-0000-000000000000');

    logger.info(`Algeria restaurants import completed: ${results.imported} imported, ${results.skipped} skipped`);
    return results;
  } catch (error) {
    logger.error('Algeria restaurants seed failed:', error);
    throw error;
  }
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => seedAlgeriaRestaurants())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}