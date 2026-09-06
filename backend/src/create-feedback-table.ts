import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_Iw3PtWc1nJCL@ep-bold-salad-b1fsfjk9-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

const createFeedbackTable = async () => {
  try {
    await ds.initialize();
    console.log('Connected');

    await ds.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        feedback_type varchar(30) NOT NULL,
        message text NOT NULL,
        rating int,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ feedback table created');

    await ds.query(`CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at)`);
    console.log('✅ feedback index created');

    await ds.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

createFeedbackTable();