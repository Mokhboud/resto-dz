import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserRoles002000000000001 implements MigrationInterface {
  name = 'FixUserRoles002000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add composite primary key to user_roles table
    await queryRunner.query(`
      ALTER TABLE user_roles 
      ADD CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove composite primary key
    await queryRunner.query(`
      ALTER TABLE user_roles 
      DROP CONSTRAINT pk_user_roles
    `);
  }
}