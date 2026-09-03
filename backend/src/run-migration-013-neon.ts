import { DataSource } from 'typeorm';

const neonDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_3OaZrgJPEX1m@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const runMigration = async () => {
  try {
    await neonDataSource.initialize();
    console.log('Connected to Neon');

    // Add import tracking columns
    await neonDataSource.query(`
      ALTER TABLE restaurants 
      ADD COLUMN IF NOT EXISTS data_source varchar(50),
      ADD COLUMN IF NOT EXISTS source_reference varchar(255),
      ADD COLUMN IF NOT EXISTS imported_at timestamp,
      ADD COLUMN IF NOT EXISTS ownership_status varchar(20) DEFAULT 'UNCLAIMED'
    `);
    console.log('✅ Import tracking columns added');

    // Create import_history table
    await neonDataSource.query(`
      CREATE TABLE IF NOT EXISTS import_history (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        admin_id uuid REFERENCES users(id) ON DELETE SET NULL,
        data_source varchar(50),
        wilaya_id int,
        search_query text,
        total_discovered int DEFAULT 0,
        total_imported int DEFAULT 0,
        total_skipped int DEFAULT 0,
        total_duplicates int DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ import_history table created');

    // Update existing restaurants to UNCLAIMED
    await neonDataSource.query(`
      UPDATE restaurants SET ownership_status = 'UNCLAIMED' WHERE ownership_status IS NULL
    `);
    console.log('✅ Existing restaurants updated');

    await neonDataSource.destroy();
    console.log('✅ MIGRATION COMPLETE');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();