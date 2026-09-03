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

const addLocationColumn = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    // Try to add geography column
    await renderDataSource.query(`
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS location geography(Point, 4326)
    `);
    console.log('✅ location column added');

    // Create spatial index
    await renderDataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING GIST (location)
    `);
    console.log('✅ spatial index created');

    await renderDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

addLocationColumn();