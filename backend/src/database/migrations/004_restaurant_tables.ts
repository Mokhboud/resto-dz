import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RestaurantTables004000000000001 implements MigrationInterface {
  name = 'RestaurantTables004000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === CATEGORIES ===
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name_fr', type: 'varchar', length: '100' },
          { name: 'name_ar', type: 'varchar', length: '100' },
          { name: 'name_en', type: 'varchar', length: '100' },
          { name: 'icon', type: 'varchar', length: '255', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'ACTIVE'" },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // === CUISINES ===
    await queryRunner.createTable(
      new Table({
        name: 'cuisines',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name_fr', type: 'varchar', length: '100' },
          { name: 'name_ar', type: 'varchar', length: '100' },
          { name: 'name_en', type: 'varchar', length: '100' },
          { name: 'icon', type: 'varchar', length: '255', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'ACTIVE'" },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // === RESTAURANTS ===
    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'slug', type: 'varchar', length: '255', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'secondary_phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '255', isNullable: true },
          { name: 'website', type: 'varchar', length: '500', isNullable: true },
          { name: 'address', type: 'text', isNullable: true },
          { name: 'wilaya_id', type: 'int', isNullable: true },
          { name: 'daira_id', type: 'int', isNullable: true },
          { name: 'commune_id', type: 'int', isNullable: true },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
            isNullable: true,
          },
          // PostGIS location field
          { name: 'location', type: 'geography(Point, 4326)', isNullable: true },
          { name: 'price_level', type: 'int', default: 1, isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          { name: 'verified', type: 'boolean', default: false },
          { name: 'verified_at', type: 'timestamp', isNullable: true },
          { name: 'owner_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['wilaya_id'],
            referencedTableName: 'wilayas',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['daira_id'],
            referencedTableName: 'dairas',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['commune_id'],
            referencedTableName: 'communes',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['owner_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true
    );

    // Indexes for restaurants
    await queryRunner.query(`
      CREATE INDEX idx_restaurants_name ON restaurants(name);
      CREATE INDEX idx_restaurants_slug ON restaurants(slug);
      CREATE INDEX idx_restaurants_wilaya_id ON restaurants(wilaya_id);
      CREATE INDEX idx_restaurants_daira_id ON restaurants(daira_id);
      CREATE INDEX idx_restaurants_commune_id ON restaurants(commune_id);
      CREATE INDEX idx_restaurants_status ON restaurants(status);
      CREATE INDEX idx_restaurants_verified ON restaurants(verified);
      CREATE INDEX idx_restaurants_price_level ON restaurants(price_level);
      
      -- PostGIS spatial index
      CREATE INDEX idx_restaurants_location ON restaurants USING GIST (location);
    `);

    // === RESTAURANT_CATEGORIES ===
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_categories',
        columns: [
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'category_id', type: 'uuid' },
        ],
        foreignKeys: [
          {
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      ALTER TABLE restaurant_categories 
      ADD CONSTRAINT pk_restaurant_categories PRIMARY KEY (restaurant_id, category_id)
    `);

    // === RESTAURANT_CUISINES ===
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_cuisines',
        columns: [
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'cuisine_id', type: 'uuid' },
        ],
        foreignKeys: [
          {
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['cuisine_id'],
            referencedTableName: 'cuisines',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      ALTER TABLE restaurant_cuisines 
      ADD CONSTRAINT pk_restaurant_cuisines PRIMARY KEY (restaurant_id, cuisine_id)
    `);

    // === OPENING_HOURS ===
    await queryRunner.createTable(
      new Table({
        name: 'opening_hours',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'day_of_week', type: 'int' }, // 0=Sunday, 1=Monday...6=Saturday
          { name: 'open_time', type: 'time', isNullable: true },
          { name: 'close_time', type: 'time', isNullable: true },
          { name: 'is_closed', type: 'boolean', default: false },
        ],
        foreignKeys: [
          {
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_opening_hours_restaurant_id ON opening_hours(restaurant_id);
    `);

    // === RESTAURANT_PHOTOS ===
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_photos',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'url', type: 'varchar', length: '500' },
          { name: 'thumbnail_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'caption', type: 'text', isNullable: true },
          { name: 'is_cover', type: 'boolean', default: false },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'status', type: 'varchar', length: '20', default: "'PENDING'" },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_restaurant_photos_restaurant_id ON restaurant_photos(restaurant_id);
      CREATE INDEX idx_restaurant_photos_status ON restaurant_photos(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('restaurant_photos');
    await queryRunner.dropTable('opening_hours');
    await queryRunner.dropTable('restaurant_cuisines');
    await queryRunner.dropTable('restaurant_categories');
    await queryRunner.dropTable('restaurants');
    await queryRunner.dropTable('cuisines');
    await queryRunner.dropTable('categories');
  }
}