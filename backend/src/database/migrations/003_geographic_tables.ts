import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class GeographicTables003000000000001 implements MigrationInterface {
  name = 'GeographicTables003000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === WILAYAS ===
    // Drop old wilayas table and recreate with better structure
    await queryRunner.query(`DROP TABLE IF EXISTS wilayas CASCADE`);

    await queryRunner.createTable(
      new Table({
        name: 'wilayas',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'code', type: 'varchar', length: '10', isUnique: true },
          { name: 'name_fr', type: 'varchar', length: '100' },
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

    // Index on wilaya name for search
    await queryRunner.query(`
      CREATE INDEX idx_wilayas_name_fr ON wilayas(name_fr);
      CREATE INDEX idx_wilayas_name_ar ON wilayas(name_ar);
      CREATE INDEX idx_wilayas_code ON wilayas(code);
    `);

    // === DAIRAS ===
    await queryRunner.createTable(
      new Table({
        name: 'dairas',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'wilaya_id', type: 'int' },
          { name: 'code', type: 'varchar', length: '10' },
          { name: 'name_fr', type: 'varchar', length: '100' },
          { name: 'name_ar', type: 'varchar', length: '100' },
          { name: 'name_en', type: 'varchar', length: '100' },
        ],
        foreignKeys: [
          {
            columnNames: ['wilaya_id'],
            referencedTableName: 'wilayas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_dairas_wilaya_id ON dairas(wilaya_id);
      CREATE INDEX idx_dairas_name_fr ON dairas(name_fr);
    `);

    // === COMMUNES ===
    await queryRunner.createTable(
      new Table({
        name: 'communes',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'daira_id', type: 'int' },
          { name: 'wilaya_id', type: 'int' },
          { name: 'code', type: 'varchar', length: '10' },
          { name: 'name_fr', type: 'varchar', length: '100' },
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
        foreignKeys: [
          {
            columnNames: ['daira_id'],
            referencedTableName: 'dairas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['wilaya_id'],
            referencedTableName: 'wilayas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
      CREATE INDEX idx_communes_daira_id ON communes(daira_id);
      CREATE INDEX idx_communes_wilaya_id ON communes(wilaya_id);
      CREATE INDEX idx_communes_name_fr ON communes(name_fr);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('communes');
    await queryRunner.dropTable('dairas');
    await queryRunner.dropTable('wilayas');
  }
}