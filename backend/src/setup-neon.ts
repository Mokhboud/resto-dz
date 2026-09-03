import { DataSource } from 'typeorm';

const neonDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_3OaZrgJPEX1m@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const setupNeon = async () => {
  try {
    await neonDataSource.initialize();
    console.log('Connected to Neon');

    // Enable PostGIS
    await neonDataSource.query('CREATE EXTENSION IF NOT EXISTS postgis');
    console.log('✅ PostGIS enabled');

    // Enable uuid-ossp
    await neonDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ uuid-ossp enabled');

    // Create all tables (same as before)
    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        phone varchar(20),
        password_hash varchar(255) NOT NULL,
        profile_photo varchar(500),
        status varchar(20) DEFAULT 'ACTIVE',
        email_verified boolean DEFAULT false,
        phone_verified boolean DEFAULT false,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        last_login timestamp,
        reset_password_token varchar(255),
        reset_password_expires timestamp,
        email_verification_token varchar(255),
        email_verification_expires timestamp
      )
    `);
    console.log('✅ users');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(50) UNIQUE NOT NULL,
        description text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ roles');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      )
    `);
    console.log('✅ user_roles');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS wilayas (
        id int PRIMARY KEY,
        code varchar(10) UNIQUE NOT NULL,
        name_fr varchar(100) NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        latitude decimal(10,8),
        longitude decimal(11,8)
      )
    `);
    console.log('✅ wilayas');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS dairas (
        id int PRIMARY KEY,
        wilaya_id int REFERENCES wilayas(id) ON DELETE CASCADE,
        code varchar(10) NOT NULL,
        name_fr varchar(100) NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        UNIQUE(wilaya_id, code)
      )
    `);
    console.log('✅ dairas');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS communes (
        id int PRIMARY KEY,
        daira_id int REFERENCES dairas(id) ON DELETE CASCADE,
        wilaya_id int REFERENCES wilayas(id) ON DELETE CASCADE,
        code varchar(10) NOT NULL,
        name_fr varchar(100) NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        latitude decimal(10,8),
        longitude decimal(11,8),
        UNIQUE(wilaya_id, code)
      )
    `);
    console.log('✅ communes');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name_fr varchar(100) UNIQUE NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        icon varchar(255),
        status varchar(20) DEFAULT 'ACTIVE',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ categories');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS cuisines (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name_fr varchar(100) UNIQUE NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        icon varchar(255),
        status varchar(20) DEFAULT 'ACTIVE',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ cuisines');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(255) NOT NULL,
        slug varchar(255) UNIQUE NOT NULL,
        description text,
        phone varchar(20),
        secondary_phone varchar(20),
        email varchar(255),
        website varchar(500),
        address text,
        wilaya_id int REFERENCES wilayas(id) ON DELETE SET NULL,
        daira_id int REFERENCES dairas(id) ON DELETE SET NULL,
        commune_id int REFERENCES communes(id) ON DELETE SET NULL,
        latitude decimal(10,8),
        longitude decimal(11,8),
        location geography(Point, 4326),
        price_level int DEFAULT 1,
        status varchar(20) DEFAULT 'PENDING',
        verified boolean DEFAULT false,
        verified_at timestamp,
        owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamp
      )
    `);
    console.log('✅ restaurants');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_categories (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, category_id)
      )
    `);
    console.log('✅ restaurant_categories');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS restaurant_cuisines (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, cuisine_id)
      )
    `);
    console.log('✅ restaurant_cuisines');

    await neonDataSource.query(`
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

    await neonDataSource.query(`
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

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        food_rating int DEFAULT 1,
        service_rating int DEFAULT 1,
        cleanliness_rating int DEFAULT 1,
        price_rating int DEFAULT 1,
        atmosphere_rating int DEFAULT 1,
        overall_rating decimal(3,2),
        comment text,
        verified_visit boolean DEFAULT false,
        status varchar(20) DEFAULT 'PENDING',
        review_trust_score int DEFAULT 50,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(restaurant_id, user_id)
      )
    `);
    console.log('✅ reviews');

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, restaurant_id)
      )
    `);
    console.log('✅ favorites');

    await neonDataSource.query(`
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

    await neonDataSource.query(`
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

    await neonDataSource.query(`
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

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        reporter_id uuid REFERENCES users(id) ON DELETE SET NULL,
        target_type varchar(20) NOT NULL,
        target_id uuid NOT NULL,
        reason varchar(100) NOT NULL,
        description text,
        status varchar(20) DEFAULT 'PENDING',
        reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at timestamp,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ reports');

    await neonDataSource.query(`
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

    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS review_photos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        url varchar(500) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ review_photos');

    await neonDataSource.query(`
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

    // Seed roles
    const roles = ['USER', 'RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
    for (const role of roles) {
      await neonDataSource.query(`INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [role]);
    }
    console.log('✅ roles seeded');

    // Seed wilayas
    const wilayas = [
      { id: 1, code: '01', name_fr: 'Adrar', name_ar: 'أدرار', name_en: 'Adrar' },
      { id: 16, code: '16', name_fr: 'Alger', name_ar: 'الجزائر', name_en: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
      { id: 31, code: '31', name_fr: 'Oran', name_ar: 'وهران', name_en: 'Oran', latitude: 35.6987, longitude: -0.6349 },
    ];
    for (const w of wilayas) {
      await neonDataSource.query(
        `INSERT INTO wilayas (id, code, name_fr, name_ar, name_en, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [w.id, w.code, w.name_fr, w.name_ar, w.name_en, w.latitude, w.longitude]
      );
    }
    console.log('✅ wilayas seeded');

    console.log('✅ NEON DATABASE FULLY SET UP');
    await neonDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupNeon();