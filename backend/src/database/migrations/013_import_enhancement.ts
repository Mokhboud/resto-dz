import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ImportEnhancement13000000000001 implements MigrationInterface {
  name = 'ImportEnhancement13000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add import tracking columns to restaurants
    await queryRunner.query(`
      ALTER TABLE restaurants 
      ADD COLUMN IF NOT EXISTS data_source varchar(50),
      ADD COLUMN IF NOT EXISTS source_reference varchar(255),
      ADD COLUMN IF NOT EXISTS imported_at timestamp,
      ADD COLUMN IF NOT EXISTS imported_by uuid REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS ownership_status varchar(20) DEFAULT 'UNCLAIMED'
    `);

    // Create import_history table
    await queryRunner.createTable(
      new Table({
        name: 'import_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'admin_id', type: 'uuid' },
          { name: 'data_source', type: 'varchar', length: '50' },
          { name: 'wilaya_id', type: 'int', isNullable: true },
          { name: 'search_query', type: 'text', isNullable: true },
          { name: 'total_discovered', type: 'int', default: 0 },
          { name: 'total_imported', type: 'int', default: 0 },
          { name: 'total_skipped', type: 'int', default: 0 },
          { name: 'total_duplicates', type: 'int', default: 0 },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['admin_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_ownership_status ON restaurants(ownership_status);
      CREATE INDEX IF NOT EXISTS idx_restaurants_data_source ON restaurants(data_source);
      CREATE INDEX IF NOT EXISTS idx_import_history_created_at ON import_history(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('import_history');
    await queryRunner.query(`
      ALTER TABLE restaurants 
      DROP COLUMN IF EXISTS data_source,
      DROP COLUMN IF EXISTS source_reference,
      DROP COLUMN IF EXISTS imported_at,
      DROP COLUMN IF EXISTS imported_by,
      DROP COLUMN IF EXISTS ownership_status
    `);
  }
}