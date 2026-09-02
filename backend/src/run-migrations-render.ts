import { DataSource } from 'typeorm';

const renderDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-dabd9ccs728c73ac9ec0-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'resto_dz_user',
  password: 'TVLkuCna5JfQLQr720XHhu1KA2n4CUy8',
  database: 'resto_dz',
  ssl: { rejectUnauthorized: false },
  entities: ['src/models/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});

const runMigrations = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected to Render database');
    
    const migrations = await renderDataSource.runMigrations();
    console.log(`Executed ${migrations.length} migrations`);
    
    await renderDataSource.destroy();
    console.log('Migrations complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();