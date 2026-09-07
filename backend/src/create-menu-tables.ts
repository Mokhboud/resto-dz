import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_Iw3PtWc1nJCL@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const createMenuTables = async () => {
  try {
    await ds.initialize();
    console.log('Connected to Neon');

    // Menu Categories
    await ds.query(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        name varchar(100) NOT NULL,
        name_ar varchar(100),
        display_order int DEFAULT 0,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ menu_categories created');

    await ds.query(`
      CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id)
    `);

    // Menu Items
    await ds.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
        name varchar(200) NOT NULL,
        name_ar varchar(200),
        description text,
        description_ar text,
        price decimal(10,2),
        image_url varchar(500),
        is_available boolean DEFAULT true,
        is_popular boolean DEFAULT false,
        is_spicy boolean DEFAULT false,
        is_vegetarian boolean DEFAULT false,
        display_order int DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ menu_items created');

    await ds.query(`
      CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id)
    `);

    console.log('✅ MENU TABLES CREATED');
    await ds.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

createMenuTables();