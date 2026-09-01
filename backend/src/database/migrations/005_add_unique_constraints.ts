import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraints005000000000001 implements MigrationInterface {
  name = 'AddUniqueConstraints005000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint on categories.name_fr
    await queryRunner.query(`
      ALTER TABLE categories ADD CONSTRAINT uq_categories_name_fr UNIQUE (name_fr)
    `);

    // Add unique constraint on cuisines.name_fr
    await queryRunner.query(`
      ALTER TABLE cuisines ADD CONSTRAINT uq_cuisines_name_fr UNIQUE (name_fr)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE categories DROP CONSTRAINT uq_categories_name_fr
    `);
    await queryRunner.query(`
      ALTER TABLE cuisines DROP CONSTRAINT uq_cuisines_name_fr
    `);
  }
}