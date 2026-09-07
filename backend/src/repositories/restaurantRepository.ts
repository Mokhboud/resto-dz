import { DataSource } from 'typeorm';

const neonDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_3OaZrgJPEX1m@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const assignCategories = async () => {
  try {
    await neonDataSource.initialize();
    console.log('Connected to Neon');

    // Check if restaurant_categories table exists
    const tableCheck = await neonDataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'restaurant_categories'
      ) as exists
    `);
    console.log('restaurant_categories exists:', tableCheck[0].exists);

    if (!tableCheck[0].exists) {
      await neonDataSource.query(`
        CREATE TABLE restaurant_categories (
          restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
          category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
          PRIMARY KEY (restaurant_id, category_id)
        )
      `);
      console.log('✅ restaurant_categories table created');
    }

    // Also check restaurant_cuisines
    const cuisineTableCheck = await neonDataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'restaurant_cuisines'
      ) as exists
    `);

    if (!cuisineTableCheck[0].exists) {
      await neonDataSource.query(`
        CREATE TABLE restaurant_cuisines (
          restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
          cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
          PRIMARY KEY (restaurant_id, cuisine_id)
        )
      `);
      console.log('✅ restaurant_cuisines table created');
    }

    // Get all categories
    const categories = await neonDataSource.query(`SELECT id, name_fr FROM categories`);
    console.log(`Found ${categories.length} categories`);

    // Get all cuisines
    const cuisines = await neonDataSource.query(`SELECT id, name_fr FROM cuisines`);
    console.log(`Found ${cuisines.length} cuisines`);

    // Get all restaurants
    const restaurants = await neonDataSource.query(`SELECT id, name FROM restaurants`);
    console.log(`Found ${restaurants.length} restaurants`);

    let categoryCount = 0;
    let cuisineCount = 0;

    for (const r of restaurants) {
      const nameLower = r.name.toLowerCase();
      let categoryId: string | null = null;
      let cuisineId: string | null = null;

      // Determine category based on name
      if (nameLower.includes('pizza') || nameLower.includes('pizzeria')) {
        categoryId = categories.find((c: any) => c.name_fr === 'Pizza')?.id || null;
        cuisineId = cuisines.find((c: any) => c.name_fr === 'Italienne')?.id || null;
      } else if (nameLower.includes('café') || nameLower.includes('cafe')) {
        categoryId = categories.find((c: any) => c.name_fr === 'Café')?.id || null;
        cuisineId = cuisines.find((c: any) => c.name_fr === 'Algérienne')?.id || null;
      } else if (nameLower.includes('fast food') || nameLower.includes('tacos') || nameLower.includes('burger')) {
        categoryId = categories.find((c: any) => c.name_fr === 'Fast Food')?.id || null;
        cuisineId = cuisines.find((c: any) => c.name_fr === 'Américaine')?.id || null;
      } else if (nameLower.includes('grill') || nameLower.includes('grillade')) {
        categoryId = categories.find((c: any) => c.name_fr === 'Grill')?.id || null;
        cuisineId = cuisines.find((c: any) => c.name_fr === 'Algérienne')?.id || null;
      } else {
        // Default to Traditional Algerian
        categoryId = categories.find((c: any) => c.name_fr === 'Traditionnel Algérien')?.id || null;
        cuisineId = cuisines.find((c: any) => c.name_fr === 'Algérienne')?.id || null;
      }

      if (categoryId) {
        await neonDataSource.query(
          `INSERT INTO restaurant_categories (restaurant_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [r.id, categoryId]
        );
        categoryCount++;
      }

      if (cuisineId) {
        await neonDataSource.query(
          `INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [r.id, cuisineId]
        );
        cuisineCount++;
      }
    }

    console.log(`✅ ${categoryCount} restaurant-category assignments`);
    console.log(`✅ ${cuisineCount} restaurant-cuisine assignments`);

    // Verify
    const catCount = await neonDataSource.query(`SELECT COUNT(*) as total FROM restaurant_categories`);
    const cuiCount = await neonDataSource.query(`SELECT COUNT(*) as total FROM restaurant_cuisines`);
    console.log(`✅ Total categories: ${catCount[0].total}`);
    console.log(`✅ Total cuisines: ${cuiCount[0].total}`);

    await neonDataSource.destroy();
    console.log('✅ DONE');
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

assignCategories();