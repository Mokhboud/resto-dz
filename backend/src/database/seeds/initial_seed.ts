import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

const seedRoles = async () => {
  const roles = [
    { name: 'USER', description: 'Regular user' },
    { name: 'RESTAURANT_OWNER', description: 'Restaurant owner' },
    { name: 'RESTAURANT_MANAGER', description: 'Restaurant manager' },
    { name: 'MODERATOR', description: 'Content moderator' },
    { name: 'ADMIN', description: 'Administrator' },
    { name: 'SUPER_ADMIN', description: 'Super administrator' },
  ];

  for (const role of roles) {
    await AppDataSource.query(
      `INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
      [role.name, role.description]
    );
  }

  logger.info('Demo roles seeded successfully');
};

const seedWilayas = async () => {
  const wilayas = [
    { id: 1, code: '01', name: 'Adrar', name_ar: 'أدرار', name_en: 'Adrar' },
    { id: 2, code: '02', name: 'Chlef', name_ar: 'الشلف', name_en: 'Chlef' },
    { id: 3, code: '03', name: 'Laghouat', name_ar: 'الأغواط', name_en: 'Laghouat' },
    { id: 16, code: '16', name: 'Alger', name_ar: 'الجزائر', name_en: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
    { id: 31, code: '31', name: 'Oran', name_ar: 'وهران', name_en: 'Oran', latitude: 35.6987, longitude: -0.6349 },
  ];

  for (const wilaya of wilayas) {
    await AppDataSource.query(
      `INSERT INTO wilayas (id, code, name, name_ar, name_en, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (id) DO UPDATE SET 
         name = EXCLUDED.name,
         name_ar = EXCLUDED.name_ar,
         name_en = EXCLUDED.name_en`,
      [wilaya.id, wilaya.code, wilaya.name, wilaya.name_ar, wilaya.name_en, wilaya.latitude, wilaya.longitude]
    );
  }

  logger.info('Demo wilayas seeded successfully');
};

export const runSeeds = async () => {
  try {
    await seedRoles();
    await seedWilayas();
    logger.info('All seeds completed successfully');
  } catch (error) {
    logger.error('Failed to run seeds:', error);
    throw error;
  }
};

// Run if invoked directly
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => runSeeds())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}