import { DataSource } from 'typeorm';
import fs from 'fs';
import path from 'path';

const renderDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-dabd9ccs728c73ac9ec0-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'resto_dz_user',
  password: 'TVLkuCna5JfQLQr720XHhu1KA2n4CUy8',
  database: 'resto_dz',
  ssl: { rejectUnauthorized: false },
});

const backupDatabase = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected to Render DB');

    const tables = [
      'users', 'roles', 'user_roles',
      'wilayas', 'dairas', 'communes',
      'categories', 'cuisines',
      'restaurants', 'restaurant_categories', 'restaurant_cuisines',
      'opening_hours', 'restaurant_photos',
      'reviews', 'review_photos', 'review_votes', 'review_responses',
      'favorites', 'restaurant_claims', 'notifications', 'reports', 'restaurant_offers',
    ];

    const backup: any = {};

    for (const table of tables) {
      try {
        const result = await renderDataSource.query(`SELECT * FROM ${table}`);
        backup[table] = result;
        console.log(`✅ ${table}: ${result.length} rows`);
      } catch (error: any) {
        console.log(`⏭️ ${table}: skipped (${error.message?.slice(0, 50)})`);
      }
    }

    // Save to file
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

    console.log(`✅ BACKUP SAVED TO: ${backupFile}`);
    await renderDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
};

backupDatabase();