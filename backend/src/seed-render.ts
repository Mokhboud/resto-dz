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

const wilayas = [
  { id: 1, code: '01', name_fr: 'Adrar', name_ar: 'أدرار', name_en: 'Adrar' },
  { id: 16, code: '16', name_fr: 'Alger', name_ar: 'الجزائر', name_en: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
  { id: 31, code: '31', name_fr: 'Oran', name_ar: 'وهران', name_en: 'Oran', latitude: 35.6987, longitude: -0.6349 },
];

const categories = [
  { name_fr: 'Pizza', name_ar: 'بيتزا', name_en: 'Pizza', icon: '🍕' },
  { name_fr: 'Burger', name_ar: 'برغر', name_en: 'Burger', icon: '🍔' },
  { name_fr: 'Fast Food', name_ar: 'وجبات سريعة', name_en: 'Fast Food', icon: '🍟' },
  { name_fr: 'Traditionnel Algérien', name_ar: 'تقليدي جزائري', name_en: 'Traditional Algerian', icon: '🍲' },
  { name_fr: 'Grill', name_ar: 'مشاوي', name_en: 'Grill', icon: '🍖' },
  { name_fr: 'Café', name_ar: 'مقهى', name_en: 'Café', icon: '☕' },
];

const cuisines = [
  { name_fr: 'Algérienne', name_ar: 'جزائرية', name_en: 'Algerian', icon: '🇩🇿' },
  { name_fr: 'Italienne', name_ar: 'إيطالية', name_en: 'Italian', icon: '🍕' },
  { name_fr: 'Méditerranéenne', name_ar: 'متوسطية', name_en: 'Mediterranean', icon: '🫒' },
];

const seedData = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    // Seed wilayas
    for (const w of wilayas) {
      await renderDataSource.query(
        `INSERT INTO wilayas (id, code, name_fr, name_ar, name_en, latitude, longitude) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [w.id, w.code, w.name_fr, w.name_ar, w.name_en, w.latitude, w.longitude]
      );
    }
    console.log('✅ Wilayas seeded');

    // Seed categories
    for (const c of categories) {
      await renderDataSource.query(
        `INSERT INTO categories (name_fr, name_ar, name_en, icon) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (name_fr) DO NOTHING`,
        [c.name_fr, c.name_ar, c.name_en, c.icon]
      );
    }
    console.log('✅ Categories seeded');

    // Seed cuisines
    for (const c of cuisines) {
      await renderDataSource.query(
        `INSERT INTO cuisines (name_fr, name_ar, name_en, icon) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (name_fr) DO NOTHING`,
        [c.name_fr, c.name_ar, c.name_en, c.icon]
      );
    }
    console.log('✅ Cuisines seeded');

    await renderDataSource.destroy();
    console.log('✅ ALL SEED DATA INSERTED');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();