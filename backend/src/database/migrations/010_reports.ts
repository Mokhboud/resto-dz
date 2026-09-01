import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Reports10000000000001 implements MigrationInterface {
  name = 'Reports10000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'reporter_id', type: 'uuid', isNullable: true },
          {
            name: 'target_type',
            type: 'varchar',
            length: '20',
          },
          { name: 'target_id', type: 'uuid' },
          {
            name: 'reason',
            type: 'varchar',
            length: '100',
          },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          { name: 'reviewed_by', type: 'uuid', isNullable: true },
          { name: 'reviewed_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['reporter_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
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
      CREATE INDEX idx_reports_status ON reports(status);
      CREATE INDEX idx_reports_target_type ON reports(target_type);
      CREATE INDEX idx_reports_target_id ON reports(target_id);
      CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
    `);

    // Prevent duplicate active reports for same target
    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_active_report ON reports(reporter_id, target_type, target_id) 
      WHERE status = 'PENDING'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reports');
  }
}