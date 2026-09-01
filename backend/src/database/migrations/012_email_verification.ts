import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EmailVerification12000000000001 implements MigrationInterface {
  name = 'EmailVerification12000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add reset password fields to users
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_password_token varchar(255),
      ADD COLUMN IF NOT EXISTS reset_password_expires timestamp,
      ADD COLUMN IF NOT EXISTS email_verification_token varchar(255),
      ADD COLUMN IF NOT EXISTS email_verification_expires timestamp
    `);

    // Create notifications table
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
          },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'message', type: 'text' },
          { name: 'read', type: 'boolean', default: false },
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
      CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX idx_notifications_read ON notifications(read);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS reset_password_token,
      DROP COLUMN IF EXISTS reset_password_expires,
      DROP COLUMN IF EXISTS email_verification_token,
      DROP COLUMN IF EXISTS email_verification_expires
    `);
  }
}