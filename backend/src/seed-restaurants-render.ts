import { DataSource } from 'typeorm';

const renderDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-dabd9ccs728c73ac9ec0-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'resto_dz_user',
  password: 'TVLkuCna5JfQLQr720XHhu1KA2n4CUy8',
  database: 'resto_dz',
  ssl: { rejectUnauthorized: false },
});

const restaurants = [
  // Alger (16)
  { name: 'Dar El Bahdja', description: 'Restaurant traditionnel algérien au cœur d\'Alger. Couscous royal et plats authentiques.', phone: '021234567', address: '12 Rue Didouche Mourad, Alger Centre', wilaya_id: 16, latitude: 36.7650, longitude: 3.0510, price_level: 2, verified: true },
  { name: 'Pizza Roma', description: 'Pizzas artisanales au feu de bois. Ingrédients importés d\'Italie.', phone: '021345678', address: '45 Boulevard Krim Belkacem, Alger Centre', wilaya_id: 16, latitude: 36.7710, longitude: 3.0550, price_level: 2, verified: true },
  { name: 'Le Grill Algérois', description: 'Grillades et viandes sélectionnées. Spécialité de méchoui.', phone: '021567890', address: '8 Rue des Frères Bouadou, Bir Mourad Rais', wilaya_id: 16, latitude: 36.7400, longitude: 3.0500, price_level: 3, verified: false },
  { name: 'Café Tantonville', description: 'Café historique au centre d\'Alger. Idéal pour le café et les pâtisseries.', phone: '021456789', address: 'Place Maurice Audin, Alger Centre', wilaya_id: 16, latitude: 36.7610, longitude: 3.0550, price_level: 1, verified: false },
  { name: 'Tacos de Bruxelles', description: 'Fast food populaire. Tacos et sandwiches variés.', phone: '0550123456', address: 'Rue Hassiba Ben Bouali, Alger', wilaya_id: 16, latitude: 36.7480, longitude: 3.0600, price_level: 1, verified: false },

  // Oran (31)
  { name: 'Le Petit Resto', description: 'Cuisine méditerranéenne avec vue sur la mer.', phone: '041234567', address: 'Boulevard de la Soummam, Oran', wilaya_id: 31, latitude: 35.7010, longitude: -0.6380, price_level: 2, verified: true },
  { name: 'Pizza Uno Oran', description: 'Pizzas et pâtes fraîches. Ambiance familiale.', phone: '041345678', address: 'Rue Larbi Ben Mhidi, Oran', wilaya_id: 31, latitude: 35.7040, longitude: -0.6450, price_level: 2, verified: false },
  { name: 'Dar El Bahdja Oran', description: 'Cuisine oranaise traditionnelle. Couscous et poissons frais.', phone: '041456789', address: 'Front de Mer, Oran', wilaya_id: 31, latitude: 35.7070, longitude: -0.6420, price_level: 2, verified: true },

  // Constantine (25)
  { name: 'Restaurant Cirta', description: 'Cuisine constantinoise traditionnelle. Chakhchoukha et plats régionaux.', phone: '031234567', address: 'Rue Belouizdad, Constantine', wilaya_id: 25, latitude: 36.3650, longitude: 6.6140, price_level: 2, verified: true },
  { name: 'Fast Food Numidia', description: 'Burgers et fast food rapide au centre-ville.', phone: '031345678', address: 'Avenue de la République, Constantine', wilaya_id: 25, latitude: 36.3590, longitude: 6.6090, price_level: 1, verified: false },

  // Annaba (23)
  { name: 'Restaurant Le Phare', description: 'Fruits de mer et cuisine méditerranéenne avec vue sur mer.', phone: '038234567', address: 'Cours de la Révolution, Annaba', wilaya_id: 23, latitude: 36.9000, longitude: 7.7670, price_level: 3, verified: true },
  { name: 'Café Saf-Saf', description: 'Café traditionnel au cœur d\'Annaba.', phone: '038345678', address: 'Place du 1er Novembre, Annaba', wilaya_id: 23, latitude: 36.8990, longitude: 7.7600, price_level: 1, verified: false },

  // Sétif (19)
  { name: 'Restaurant High Plateau', description: 'Couscous sétifien et grillades. Spécialités régionales.', phone: '036234567', address: 'Rue des Frères Achour, Sétif', wilaya_id: 19, latitude: 36.1910, longitude: 5.4100, price_level: 2, verified: true },

  // Batna (5)
  { name: 'Restaurant Aurès', description: 'Spécialités des Aurès. Méchoui et plats traditionnels.', phone: '033234567', address: 'Avenue de l\'Indépendance, Batna', wilaya_id: 5, latitude: 35.5550, longitude: 6.1740, price_level: 2, verified: false },

  // Tlemcen (13)
  { name: 'Restaurant Les Zianides', description: 'Cuisine tlemcenienne raffinée. Plats traditionnels.', phone: '043234567', address: 'Rue de la Paix, Tlemcen', wilaya_id: 13, latitude: 34.8820, longitude: -1.3150, price_level: 2, verified: true },

  // Blida (9)
  { name: 'Restaurant Les Orangers', description: 'Cuisine algérienne dans un cadre agréable. Spécialité de couscous.', phone: '025234567', address: 'Boulevard des Martyrs, Blida', wilaya_id: 9, latitude: 36.4720, longitude: 2.8280, price_level: 2, verified: false },

  // Boumerdès (35)
  { name: 'Restaurant La Corniche', description: 'Poissons et fruits de mer avec vue sur la Méditerranée.', phone: '024234567', address: 'Boulevard du Front de Mer, Boumerdès', wilaya_id: 35, latitude: 36.7540, longitude: 3.4750, price_level: 3, verified: true },

  // Bouira (10)
  { name: 'Boulangerie Patisserie Atlas', description: 'Boulangerie traditionnelle avec pâtisseries orientales.', phone: '026234567', address: 'Rue de la République, Bouira', wilaya_id: 10, latitude: 36.3750, longitude: 3.9020, price_level: 1, verified: false },
];

const seedRestaurants = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    for (const r of restaurants) {
      const slug = r.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      
      const result = await renderDataSource.query(
        `INSERT INTO restaurants (name, slug, description, phone, address, wilaya_id, latitude, longitude, price_level, status, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE', $10)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [r.name, slug, r.description, r.phone, r.address, r.wilaya_id, r.latitude, r.longitude, r.price_level, r.verified]
      );

      if (result[0]?.id) {
        // Add opening hours (7 days, 10:00-22:00)
        for (let day = 0; day < 7; day++) {
          await renderDataSource.query(
            `INSERT INTO opening_hours (restaurant_id, day_of_week, open_time, close_time, is_closed)
             VALUES ($1, $2, '10:00', '22:00', false)`,
            [result[0].id, day]
          );
        }
        console.log(`✅ Seeded: ${r.name}`);
      } else {
        console.log(`⏭️ Skipped (exists): ${r.name}`);
      }
    }

    console.log('✅ ALL RESTAURANTS SEEDED');
    await renderDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedRestaurants();