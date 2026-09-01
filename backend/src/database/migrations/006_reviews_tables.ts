import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ReviewsTables006000000000001 implements MigrationInterface {
  name = 'ReviewsTables006000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === REVIEWS ===
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'food_rating', type: 'int', default: 1 },
          { name: 'service_rating', type: 'int', default: 1 },
          { name: 'cleanliness_rating', type: 'int', default: 1 },
          { name: 'price_rating', type: 'int', default: 1 },
          { name: 'atmosphere_rating', type: 'int', default: 1 },
          {
            name: 'overall_rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          { name: 'comment', type: 'text', isNullable: true },
          { name: 'verified_visit', type: 'boolean', default: false },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          {
            name: 'review_trust_score',
            type: 'int',
            default: 50,
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
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
        ],
      }),
      true
    );

    // Indexes
    await queryRunner.query(`
      CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
      CREATE INDEX idx_reviews_user_id ON reviews(user_id);
      CREATE INDEX idx_reviews_status ON reviews(status);
      CREATE INDEX idx_reviews_created_at ON reviews(created_at);
    `);

    // === REVIEW_PHOTOS ===
    await queryRunner.createTable(
      new Table({
        name: 'review_photos',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'review_id', type: 'uuid' },
          { name: 'url', type: 'varchar', length: '500' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['review_id'],
            referencedTableName: 'reviews',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_review_photos_review_id ON review_photos(review_id);
    `);

    // === REVIEW_VOTES ===
    await queryRunner.createTable(
      new Table({
        name: 'review_votes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'review_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'vote', type: 'int' }, // 1 = helpful, -1 = not helpful
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['review_id'],
            referencedTableName: 'reviews',
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

    await queryRunner.query(`
      ALTER TABLE review_votes 
      ADD CONSTRAINT uq_review_votes UNIQUE (review_id, user_id);
    `);

    // === FAVORITES ===
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          { name: 'user_id', type: 'uuid' },
          { name: 'restaurant_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
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
      ALTER TABLE favorites 
      ADD CONSTRAINT uq_favorites UNIQUE (user_id, restaurant_id);
      CREATE INDEX idx_favorites_user_id ON favorites(user_id);
      CREATE INDEX idx_favorites_restaurant_id ON favorites(restaurant_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites');
    await queryRunner.dropTable('review_votes');
    await queryRunner.dropTable('review_photos');
    await queryRunner.dropTable('reviews');
  }
}