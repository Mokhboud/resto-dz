import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

const demoRestaurants = [
  {
    name: 'Dar El Bahdja',
    slug: 'dar-el-bahdja',
    description: 'Restaurant traditionnel algérien au cœur d\'Alger. Cuisine authentique et ambiance familiale.',
    phone: '021234567',
    secondary_phone: null,
    email: 'contact@darelbahdja.dz',
    website: null,
    address: '12 Rue Didouche Mourad, Alger Centre',
    wilaya_id: 16,
    latitude: 36.7650,
    longitude: 3.0510,
    price_level: 2,
    status: 'ACTIVE',
    verified: true,
    categories: ['Traditionnel Algérien'],
    cuisines: ['Algérienne'],
  },
  {
    name: 'Pizza Roma',
    slug: 'pizza-roma',
    description: 'Meilleures pizzas artisanales d\'Alger. Pâte fraîche et ingrédients importés d\'Italie.',
    phone: '021345678',
    secondary_phone: '0550123456',
    email: 'info@pizzaroma.dz',
    website: 'www.pizzaroma.dz',
    address: '45 Boulevard Krim Belkacem, Alger Centre',
    wilaya_id: 16,
    latitude: 36.7710,
    longitude: 3.0550,
    price_level: 2,
    status: 'ACTIVE',
    verified: true,
    categories: ['Pizza', 'Italien'],
    cuisines: ['Italienne'],
  },
  {
    name: 'Le Grill Algérois',
    slug: 'le-grill-algerois',
    description: 'Grillades et viandes sélectionnées. Spécialité de méchoui et brochettes.',
    phone: '021567890',
    secondary_phone: null,
    email: null,
    website: null,
    address: '8 Rue des Frères Bouadou, Bir Mourad Rais',
    wilaya_id: 16,
    latitude: 36.7400,
    longitude: 3.0500,
    price_level: 3,
    status: 'ACTIVE',
    verified: false,
    categories: ['Grill'],
    cuisines: ['Algérienne'],
  },
  {
    name: 'Burger Fast Oran',
    slug: 'burger-fast-oran',
    description: 'Fast food américain avec une touche algérienne. Burgers généreux et frites maison.',
    phone: '041234567',
    secondary_phone: null,
    email: 'contact@burgerfast.dz',
    website: null,
    address: '23 Boulevard de la Soummam, Oran',
    wilaya_id: 31,
    latitude: 35.7010,
    longitude: -0.6380,
    price_level: 1,
    status: 'ACTIVE',
    verified: true,
    categories: ['Burger', 'Fast Food'],
    cuisines: ['Américaine'],
  },
  {
    name: 'Restaurant El Bahia',
    slug: 'restaurant-el-bahia',
    description: 'Cuisine oranaise traditionnelle. Couscous royal et plats de poisson frais.',
    phone: '041890123',
    secondary_phone: '0770123456',
    email: 'elbahia@restaurant.dz',
    website: null,
    address: '15 Rue Larbi Ben M\'hidi, Oran',
    wilaya_id: 31,
    latitude: 35.7040,
    longitude: -0.6450,
    price_level: 2,
    status: 'ACTIVE',
    verified: true,
    categories: ['Traditionnel Algérien', 'Poisson'],
    cuisines: ['Algérienne', 'Méditerranéenne'],
  },
  {
    name: 'Café Timgad',
    slug: 'cafe-timgad',
    description: 'Café traditionnel avec pâtisseries algériennes et boissons chaudes.',
    phone: '033123456',
    secondary_phone: null,
    email: null,
    website: null,
    address: '5 Avenue de l\'Indépendance, Batna',
    wilaya_id: 5,
    latitude: 35.5550,
    longitude: 6.1740,
    price_level: 1,
    status: 'ACTIVE',
    verified: false,
    categories: ['Café'],
    cuisines: ['Algérienne'],
  },
  {
    name: 'Pizzeria Constantine',
    slug: 'pizzeria-constantine',
    description: 'Pizzas au feu de bois et pâtes fraîches. Ambiance chaleureuse et service rapide.',
    phone: '031456789',
    secondary_phone: '0661234567',
    email: 'pizzeria@constantine.dz',
    website: null,
    address: '30 Rue Belouizdad, Constantine',
    wilaya_id: 25,
    latitude: 36.3650,
    longitude: 6.6140,
    price_level: 2,
    status: 'ACTIVE',
    verified: true,
    categories: ['Pizza', 'Italien'],
    cuisines: ['Italienne'],
  },
  {
    name: 'Restaurant Zayane',
    slug: 'restaurant-zayane',
    description: 'Spécialités du sud algérien. Méchoui traditionnel et thé saharien.',
    phone: '029123456',
    secondary_phone: null,
    email: 'zayane@restaurant.dz',
    website: null,
    address: 'Route de l\'Aéroport, Tamanrasset',
    wilaya_id: 11,
    latitude: 22.7850,
    longitude: 5.5220,
    price_level: 2,
    status: 'ACTIVE',
    verified: false,
    categories: ['Traditionnel Algérien', 'Grill'],
    cuisines: ['Algérienne', 'Orientale'],
  },
  {
    name: 'Fast Food Blida',
    slug: 'fast-food-blida',
    description: 'Fast food rapide et délicieux. Tacos, burgers et sandwichs variés.',
    phone: '025678901',
    secondary_phone: null,
    email: null,
    website: null,
    address: '18 Boulevard des Martyrs, Blida',
    wilaya_id: 9,
    latitude: 36.4720,
    longitude: 2.8280,
    price_level: 1,
    status: 'ACTIVE',
    verified: false,
    categories: ['Fast Food', 'Burger'],
    cuisines: ['Américaine'],
  },
  {
    name: 'Restaurant Le Bardo',
    slug: 'restaurant-le-bardo',
    description: 'Gastronomie algérienne moderne. Plats raffinés et service professionnel.',
    phone: '026345678',
    secondary_phone: '0550987654',
    email: 'lebardo@restaurant.dz',
    website: 'www.lebardo.dz',
    address: '10 Rue des Frères Achour, Sétif',
    wilaya_id: 19,
    latitude: 36.1910,
    longitude: 5.4100,
    price_level: 3,
    status: 'ACTIVE',
    verified: true,
    categories: ['Gastronomique', 'Traditionnel Algérien'],
    cuisines: ['Algérienne', 'Méditerranéenne'],
  },
  {
    name: 'Sushi House Annaba',
    slug: 'sushi-house-annaba',
    description: 'Restaurant asiatique moderne. Sushis frais et plats asiatiques variés.',
    phone: '038123456',
    secondary_phone: null,
    email: 'sushi@annaba.dz',
    website: null,
    address: '7 Boulevard de la Révolution, Annaba',
    wilaya_id: 23,
    latitude: 36.9000,
    longitude: 7.7670,
    price_level: 3,
    status: 'ACTIVE',
    verified: true,
    categories: ['Asiatique'],
    cuisines: ['Asiatique'],
  },
  {
    name: 'Boulangerie Patisserie Atlas',
    slug: 'boulangerie-patisserie-atlas',
    description: 'Boulangerie traditionnelle avec pâtisseries orientales et viennoiseries.',
    phone: '034567890',
    secondary_phone: null,
    email: null,
    website: null,
    address: '25 Rue de la République, Bouira',
    wilaya_id: 10,
    latitude: 36.3750,
    longitude: 3.9020,
    price_level: 1,
    status: 'ACTIVE',
    verified: false,
    categories: ['Boulangerie', 'Dessert'],
    cuisines: ['Algérienne'],
  },
];

export const seedDemoRestaurants = async () => {
  for (const r of demoRestaurants) {
    // Insert restaurant without location first
    const result = await AppDataSource.query(
      `WITH inserted AS (
         INSERT INTO restaurants (name, slug, description, phone, secondary_phone, email, website, address, wilaya_id, latitude, longitude, price_level, status, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id, longitude, latitude
       )
       UPDATE restaurants r
       SET location = ST_SetSRID(ST_MakePoint(i.longitude::double precision, i.latitude::double precision), 4326)::geography
       FROM inserted i
       WHERE r.id = i.id
       RETURNING r.id`,
      [r.name, r.slug, r.description, r.phone, r.secondary_phone, r.email, r.website, r.address, r.wilaya_id, r.latitude, r.longitude, r.price_level, r.status, r.verified]
    );

    const restaurantId = result[0]?.id;
    if (!restaurantId) continue;

    // Assign categories
    for (const catName of r.categories) {
      await AppDataSource.query(
        `INSERT INTO restaurant_categories (restaurant_id, category_id)
         SELECT $1, id FROM categories WHERE name_fr = $2
         ON CONFLICT DO NOTHING`,
        [restaurantId, catName]
      );
    }

    // Assign cuisines
    for (const cuisineName of r.cuisines) {
      await AppDataSource.query(
        `INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id)
         SELECT $1, id FROM cuisines WHERE name_fr = $2
         ON CONFLICT DO NOTHING`,
        [restaurantId, cuisineName]
      );
    }

    // Add default opening hours (Monday-Sunday: 10:00 - 22:00)
    for (let day = 0; day < 7; day++) {
      await AppDataSource.query(
        `INSERT INTO opening_hours (restaurant_id, day_of_week, open_time, close_time, is_closed)
         VALUES ($1, $2, '10:00', '22:00', false)
         ON CONFLICT DO NOTHING`,
        [restaurantId, day]
      );
    }

    logger.info(`Seeded restaurant: ${r.name}`);
  }

  logger.info(`Demo restaurants seed completed (${demoRestaurants.length} restaurants)`);
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => seedDemoRestaurants())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}