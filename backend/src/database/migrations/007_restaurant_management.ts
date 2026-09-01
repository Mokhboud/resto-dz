import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RestaurantManagement007000000000001 implements MigrationInterface {
  name = 'RestaurantManagement007000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add deleted_at to restaurants
    await queryRunner.query(`
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS deleted_at timestamp
    `);

    // Create restaurant_claims table
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_claims',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          {
            name: 'proof_document',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'reviewed_by', type: 'uuid', isNullable: true },
          { name: 'reviewed_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
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
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['reviewed_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true
    );

    // Indexes
    await queryRunner.query(`
      CREATE INDEX idx_restaurants_deleted_at ON restaurants(deleted_at);
      CREATE INDEX idx_restaurant_claims_restaurant_id ON restaurant_claims(restaurant_id);
      CREATE INDEX idx_restaurant_claims_user_id ON restaurant_claims(user_id);
      CREATE INDEX idx_restaurant_claims_status ON restaurant_claims(status);
    `);

    // Unique constraint to prevent duplicate active claims
    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_active_claim ON restaurant_claims(restaurant_id, user_id) 
      WHERE status = 'PENDING'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('restaurant_claims');
    await queryRunner.query(`
      ALTER TABLE restaurants DROP COLUMN IF EXISTS deleted_at
    `);
  }
}