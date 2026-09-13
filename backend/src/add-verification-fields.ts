import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_Iw3PtWc1nJCL@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const addFields = async () => {
  try {
    await ds.initialize();
    console.log('Connected');

    // Add verification_status field
    await ds.query(`
      ALTER TABLE restaurants 
      ADD COLUMN IF NOT EXISTS verification_status varchar(20) DEFAULT 'UNVERIFIED'
    `);
    console.log('✅ verification_status field added');

    // Set existing OSM restaurants to UNVERIFIED
    await ds.query(`
      UPDATE restaurants 
      SET verification_status = 'UNVERIFIED' 
      WHERE verification_status IS NULL
    `);
    console.log('✅ All existing restaurants set to UNVERIFIED');

    // Set verified=true ones to VERIFIED
    await ds.query(`
      UPDATE restaurants 
      SET verification_status = 'VERIFIED' 
      WHERE verified = true
    `);
    console.log('✅ Verified restaurants updated');

    // Add indexes
    await ds.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_verification_status ON restaurants(verification_status)
    `);
    console.log('✅ Index created');

    // Verify data_source exists
    const dataSourceCheck = await ds.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'data_source'
    `);
    console.log('data_source exists:', dataSourceCheck.length > 0);

    // Set data_source for existing
    await ds.query(`
      UPDATE restaurants 
      SET data_source = 'OSM' 
      WHERE data_source IS NULL
    `);
    console.log('✅ data_source set');

    // Count by status
    const stats = await ds.query(`
      SELECT verification_status, COUNT(*) as count 
      FROM restaurants 
      WHERE status = 'ACTIVE'
      GROUP BY verification_status
    `);
    console.log('\n📊 Restaurant verification stats:');
    stats.forEach((s: any) => console.log(`  ${s.verification_status}: ${s.count}`));

    await ds.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

addFields();