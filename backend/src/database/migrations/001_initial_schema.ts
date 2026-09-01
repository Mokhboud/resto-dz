import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema001000000000001 implements MigrationInterface {
  name = 'InitialSchema001000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'first_name', type: 'varchar', length: '100' },
          { name: 'last_name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          {
            name: 'profile_photo',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'ACTIVE'",
          },
          { name: 'email_verified', type: 'boolean', default: false },
          { name: 'phone_verified', type: 'boolean', default: false },
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
          { name: 'last_login', type: 'timestamp', isNullable: true },
        ],
      }),
      true
    );

    // Roles table
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '50', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // User roles junction table
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'role_id', type: 'uuid' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    // Wilayas table
    await queryRunner.createTable(
      new Table({
        name: 'wilayas',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'code', type: 'varchar', length: '10', isUnique: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'name_ar', type: 'varchar', length: '100' },
          { name: 'name_en', type: 'varchar', length: '100' },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Indexes
    await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_status ON users(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
    await queryRunner.dropTable('roles');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('wilayas');
  }
}