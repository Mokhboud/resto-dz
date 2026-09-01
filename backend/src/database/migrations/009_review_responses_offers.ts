import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ReviewResponsesOffers009000000000001 implements MigrationInterface {
  name = 'ReviewResponsesOffers009000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === REVIEW_RESPONSES ===
    await queryRunner.createTable(
      new Table({
        name: 'review_responses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'review_id', type: 'uuid' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'response', type: 'text' },
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
            columnNames: ['review_id'],
            referencedTableName: 'reviews',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
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
        ],
      }),
      true
    );

    // One response per review
    await queryRunner.query(`
      ALTER TABLE review_responses 
      ADD CONSTRAINT uq_review_response UNIQUE (review_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_review_responses_review_id ON review_responses(review_id);
      CREATE INDEX idx_review_responses_restaurant_id ON review_responses(restaurant_id);
    `);

    // === RESTAURANT_OFFERS ===
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_offers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'discount_percentage',
            type: 'int',
            isNullable: true,
          },
          { name: 'start_date', type: 'timestamp' },
          { name: 'end_date', type: 'timestamp' },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'ACTIVE'",
          },
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
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_restaurant_offers_restaurant_id ON restaurant_offers(restaurant_id);
      CREATE INDEX idx_restaurant_offers_status ON restaurant_offers(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('restaurant_offers');
    await queryRunner.dropTable('review_responses');
  }
}