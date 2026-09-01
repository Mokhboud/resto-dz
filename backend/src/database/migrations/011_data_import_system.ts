import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataImportSystem11000000000001 implements MigrationInterface {
  name = 'DataImportSystem11000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraints for dairas and communes
    await queryRunner.query(`
      ALTER TABLE dairas 
      ADD CONSTRAINT uq_dairas_code UNIQUE (wilaya_id, code)
    `);

    await queryRunner.query(`
      ALTER TABLE communes 
      ADD CONSTRAINT uq_communes_code UNIQUE (wilaya_id, code)
    `);

    // Add indexes for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_dairas_code ON dairas(code);
      CREATE INDEX IF NOT EXISTS idx_communes_code ON communes(code);
      CREATE INDEX IF NOT EXISTS idx_communes_name_ar ON communes(name_ar);
      CREATE INDEX IF NOT EXISTS idx_dairas_name_ar ON dairas(name_ar);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dairas DROP CONSTRAINT IF EXISTS uq_dairas_code;
      ALTER TABLE communes DROP CONSTRAINT IF EXISTS uq_communes_code;
    `);
  }
}