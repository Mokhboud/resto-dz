import { DataSource } from 'typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

const renderDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-dabd9ccs728c73ac9ec0-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'resto_dz_user',
  password: 'TVLkuCna5JfQLQr720XHhu1KA2n4CUy8',
  database: 'resto_dz',
  ssl: { rejectUnauthorized: false },
});

const runMigrations = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected to Render database');

    // Run migrations in correct order using raw SQL
    const queryRunner = renderDataSource.createQueryRunner();
    await queryRunner.connect();

    // Drop all tables if they exist (clean slate)
    await queryRunner.query('DROP SCHEMA public CASCADE');
    await queryRunner.query('CREATE SCHEMA public');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
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
    console.log('✅ users table created');

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE roles (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(50) UNIQUE NOT NULL,
        description text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ roles table created');

    // Create user_roles
    await queryRunner.query(`
      CREATE TABLE user_roles (
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      )
    `);
    console.log('✅ user_roles table created');

    // Seed roles
    const roles = ['USER', 'RESTAURANT_OWNER', 'RESTAURANT_MANAGER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
    for (const role of roles) {
      await queryRunner.query(`INSERT INTO roles (name) VALUES ($1)`, [role]);
    }
    console.log('✅ roles seeded');

    // Create wilayas
    await queryRunner.query(`
      CREATE TABLE wilayas (
        id int PRIMARY KEY,
        code varchar(10) UNIQUE NOT NULL,
        name_fr varchar(100) NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        latitude decimal(10,8),
        longitude decimal(11,8)
      )
    `);
    console.log('✅ wilayas table created');

    // Create dairas
    await queryRunner.query(`
      CREATE TABLE dairas (
        id int PRIMARY KEY,
        wilaya_id int REFERENCES wilayas(id) ON DELETE CASCADE,
        code varchar(10) NOT NULL,
        name_fr varchar(100) NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        UNIQUE(wilaya_id, code)
      )
    `);
    console.log('✅ dairas table created');

    // Create communes
    await queryRunner.query(`
      CREATE TABLE communes (
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
    console.log('✅ communes table created');

    // Create categories
    await queryRunner.query(`
      CREATE TABLE categories (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name_fr varchar(100) UNIQUE NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        icon varchar(255),
        status varchar(20) DEFAULT 'ACTIVE',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ categories table created');

    // Create cuisines
    await queryRunner.query(`
      CREATE TABLE cuisines (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name_fr varchar(100) UNIQUE NOT NULL,
        name_ar varchar(100) NOT NULL,
        name_en varchar(100) NOT NULL,
        icon varchar(255),
        status varchar(20) DEFAULT 'ACTIVE',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ cuisines table created');

    // Create restaurants
    await queryRunner.query(`
      CREATE TABLE restaurants (
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
    console.log('✅ restaurants table created');

    // Create restaurant_categories
    await queryRunner.query(`
      CREATE TABLE restaurant_categories (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, category_id)
      )
    `);

    // Create restaurant_cuisines
    await queryRunner.query(`
      CREATE TABLE restaurant_cuisines (
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
        PRIMARY KEY (restaurant_id, cuisine_id)
      )
    `);

    // Create reviews
    await queryRunner.query(`
      CREATE TABLE reviews (
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
    console.log('✅ reviews table created');

    // Create favorites
    await queryRunner.query(`
      CREATE TABLE favorites (
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, restaurant_id)
      )
    `);
    console.log('✅ favorites table created');

    // Create restaurant_photos
    await queryRunner.query(`
      CREATE TABLE restaurant_photos (
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

    // Create opening_hours
    await queryRunner.query(`
      CREATE TABLE opening_hours (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
        day_of_week int NOT NULL,
        open_time time,
        close_time time,
        is_closed boolean DEFAULT false
      )
    `);

    // Create restaurant_claims
    await queryRunner.query(`
      CREATE TABLE restaurant_claims (
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

    // Create review_responses
    await queryRunner.query(`
      CREATE TABLE review_responses (
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

    // Create notifications
    await queryRunner.query(`
      CREATE TABLE notifications (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        type varchar(50) NOT NULL,
        title varchar(255) NOT NULL,
        message text NOT NULL,
        read boolean DEFAULT false,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports
    await queryRunner.query(`
      CREATE TABLE reports (
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
    console.log('✅ reports table created');

    // Create restaurant_offers
    await queryRunner.query(`
      CREATE TABLE restaurant_offers (
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

    // Create review_photos
    await queryRunner.query(`
      CREATE TABLE review_photos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        url varchar(500) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create review_votes
    await queryRunner.query(`
      CREATE TABLE review_votes (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        vote int NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(review_id, user_id)
      )
    `);

    // Record migrations as done
    await queryRunner.query(`CREATE TABLE migrations (
      id SERIAL PRIMARY KEY,
      timestamp bigint NOT NULL,
      name varchar(255) NOT NULL
    )`);
    
    const migrationNames = [
      'InitialSchema001000000000001',
      'FixUserRoles002000000000001',
      'GeographicTables003000000000001',
      'RestaurantTables004000000000001',
      'AddUniqueConstraints005000000000001',
      'ReviewsTables006000000000001',
      'RestaurantManagement007000000000001',
      'ReviewConstraints008000000000001',
      'ReviewResponsesOffers009000000000001',
      'Reports10000000000001',
      'DataImportSystem11000000000001',
      'EmailVerification12000000000001',
    ];
    
    for (let i = 0; i < migrationNames.length; i++) {
      await queryRunner.query(
        `INSERT INTO migrations (timestamp, name) VALUES ($1, $2)`,
        [1000000000001 * (i + 1), migrationNames[i]]
      );
    }

    console.log('✅ ALL TABLES CREATED SUCCESSFULLY');
    console.log('✅ Migrations recorded');
    
    await queryRunner.release();
    await renderDataSource.destroy();
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();