import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReviewConstraints008000000000001 implements MigrationInterface {
  name = 'ReviewConstraints008000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint for one review per user per restaurant
    await queryRunner.query(`
      ALTER TABLE reviews 
      ADD CONSTRAINT uq_review_restaurant_user UNIQUE (restaurant_id, user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE reviews 
      DROP CONSTRAINT uq_review_restaurant_user
    `);
  }
}