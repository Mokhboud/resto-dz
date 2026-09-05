import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class VisitLogs14000000000001 implements MigrationInterface {
  name = 'VisitLogs14000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Visit logs — tracks every page/API visit
    await queryRunner.createTable(
      new Table({
        name: 'visit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'ip_address', type: 'varchar', length: '45' },
          { name: 'user_agent', type: 'text', isNullable: true },
          { name: 'path', type: 'varchar', length: '500' },
          { name: 'method', type: 'varchar', length: '10' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_visit_logs_created_at ON visit_logs(created_at);
      CREATE INDEX idx_visit_logs_user_id ON visit_logs(user_id);
      CREATE INDEX idx_visit_logs_ip ON visit_logs(ip_address);
    `);

    // Login history — tracks every login
    await queryRunner.createTable(
      new Table({
        name: 'login_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'ip_address', type: 'varchar', length: '45' },
          { name: 'user_agent', type: 'text', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_login_history_user_id ON login_history(user_id);
      CREATE INDEX idx_login_history_created_at ON login_history(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('login_history');
    await queryRunner.dropTable('visit_logs');
  }
}