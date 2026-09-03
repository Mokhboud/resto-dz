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

const createMissingTables = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    // restaurant_categories
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_categories (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, category_id)
      )
    `);
    console.log('✅ restaurant_categories');

    // restaurant_cuisines
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_cuisines (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, cuisine_id)
      )
    `);
    console.log('✅ restaurant_cuisines');

    // opening_hours
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS opening_hours (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        day_of_week int NOT NULL,
        open_time time,
        close_time time,
        is_closed boolean DEFAULT false
      )
    `);
    console.log('✅ opening_hours');

    // restaurant_photos
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_photos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        url varchar(500) NOT NULL,
        thumbnail_url varchar(500),
        caption text,
        is_cover boolean DEFAULT false,
        sort_order int DEFAULT 0,
        status varchar(20) DEFAULT 'PENDING',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ restaurant_photos');

    // restaurant_claims
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_claims (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        status varchar(20) DEFAULT 'PENDING',
        proof_document varchar(500),
        phone varchar(20),
        notes text,
        reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at timestamp,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ restaurant_claims');

    // review_responses
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS review_responses (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        response text NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(review_id)
      )
    `);
    console.log('✅ review_responses');

    // notifications
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        type varchar(50) NOT NULL,
        title varchar(255) NOT NULL,
        message text NOT NULL,
        read boolean DEFAULT false,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ notifications');

    // restaurant_offers
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_offers (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        title varchar(255) NOT NULL,
        description text,
        discount_percentage int,
        start_date timestamp NOT NULL,
        end_date timestamp NOT NULL,
        status varchar(20) DEFAULT 'ACTIVE',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ restaurant_offers');

    // review_photos
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS review_photos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        url varchar(500) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ review_photos');

    // review_votes
    await renderDataSource.query(`
      CREATE TABLE IF NOT EXISTS review_votes (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        vote int NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(review_id, user_id)
      )
    `);
    console.log('✅ review_votes');

    console.log('✅ ALL MISSING TABLES CREATED');
    await renderDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

createMissingTables();