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

const enablePostGIS = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    // Enable PostGIS
    await renderDataSource.query('CREATE EXTENSION IF NOT EXISTS postgis');
    console.log('✅ PostGIS enabled');

    await renderDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ uuid-ossp enabled');

    // Now add the location column
    await renderDataSource.query(`
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS location geography(Point, 4326)
    `);
    console.log('✅ location column added');

    await renderDataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING GIST (location)
    `);
    console.log('✅ spatial index created');

    // Update existing restaurants with location from lat/lng
    await renderDataSource.query(`
      UPDATE restaurants 
      SET location = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)::geography
      WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL
    `);
    console.log('✅ existing restaurant locations updated');

    await renderDataSource.destroy();
    console.log('✅ COMPLETE');
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

enablePostGIS();