import { AppDataSource } from './config/database';

const runMigrations = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
    
    const migrations = await AppDataSource.runMigrations();
    console.log(`Executed ${migrations.length} migrations`);
    
    await AppDataSource.destroy();
    console.log('Migrations complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();