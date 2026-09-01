import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

const seedCategories = async () => {
  const categories = [
    { name_fr: 'Pizza', name_ar: 'بيتزا', name_en: 'Pizza', icon: '🍕' },
    { name_fr: 'Burger', name_ar: 'برغر', name_en: 'Burger', icon: '🍔' },
    { name_fr: 'Fast Food', name_ar: 'وجبات سريعة', name_en: 'Fast Food', icon: '🍟' },
    { name_fr: 'Traditionnel Algérien', name_ar: 'تقليدي جزائري', name_en: 'Traditional Algerian', icon: '🍲' },
    { name_fr: 'Grill', name_ar: 'مشاوي', name_en: 'Grill', icon: '🍖' },
    { name_fr: 'Poisson', name_ar: 'سمك', name_en: 'Fish', icon: '🐟' },
    { name_fr: 'Fruits de mer', name_ar: 'مأكولات بحرية', name_en: 'Seafood', icon: '🦞' },
    { name_fr: 'Poulet', name_ar: 'دجاج', name_en: 'Chicken', icon: '🍗' },
    { name_fr: 'Italien', name_ar: 'إيطالي', name_en: 'Italian', icon: '🍝' },
    { name_fr: 'Français', name_ar: 'فرنسي', name_en: 'French', icon: '🥖' },
    { name_fr: 'Asiatique', name_ar: 'آسيوي', name_en: 'Asian', icon: '🍜' },
    { name_fr: 'Turc', name_ar: 'تركي', name_en: 'Turkish', icon: '🥙' },
    { name_fr: 'Café', name_ar: 'مقهى', name_en: 'Café', icon: '☕' },
    { name_fr: 'Boulangerie', name_ar: 'مخبزة', name_en: 'Bakery', icon: '🥐' },
    { name_fr: 'Dessert', name_ar: 'حلويات', name_en: 'Dessert', icon: '🍰' },
    { name_fr: 'Gastronomique', name_ar: 'راقي', name_en: 'Fine Dining', icon: '🍽️' },
    { name_fr: 'Familial', name_ar: 'عائلي', name_en: 'Family Restaurant', icon: '👨‍👩‍👧‍👦' },
  ];

  for (const cat of categories) {
    await AppDataSource.query(
      `INSERT INTO categories (name_fr, name_ar, name_en, icon) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (name_fr) DO NOTHING`,
      [cat.name_fr, cat.name_ar, cat.name_en, cat.icon]
    );
  }

  logger.info(`Seeded ${categories.length} categories`);
};

const seedCuisines = async () => {
  const cuisines = [
    { name_fr: 'Algérienne', name_ar: 'جزائرية', name_en: 'Algerian', icon: '🇩🇿' },
    { name_fr: 'Méditerranéenne', name_ar: 'متوسطية', name_en: 'Mediterranean', icon: '🫒' },
    { name_fr: 'Orientale', name_ar: 'شرقية', name_en: 'Oriental', icon: '🕌' },
    { name_fr: 'Française', name_ar: 'فرنسية', name_en: 'French', icon: '🥖' },
    { name_fr: 'Italienne', name_ar: 'إيطالية', name_en: 'Italian', icon: '🍕' },
    { name_fr: 'Asiatique', name_ar: 'آسيوية', name_en: 'Asian', icon: '🥢' },
    { name_fr: 'Turque', name_ar: 'تركية', name_en: 'Turkish', icon: '🥙' },
    { name_fr: 'Américaine', name_ar: 'أمريكية', name_en: 'American', icon: '🍔' },
  ];

  for (const cuisine of cuisines) {
    await AppDataSource.query(
      `INSERT INTO cuisines (name_fr, name_ar, name_en, icon) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (name_fr) DO NOTHING`,
      [cuisine.name_fr, cuisine.name_ar, cuisine.name_en, cuisine.icon]
    );
  }

  logger.info(`Seeded ${cuisines.length} cuisines`);
};

export const runCategoriesCuisinesSeed = async () => {
  try {
    await seedCategories();
    await seedCuisines();
    logger.info('Categories and cuisines seed completed successfully');
  } catch (error) {
    logger.error('Failed to seed categories and cuisines:', error);
    throw error;
  }
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => runCategoriesCuisinesSeed())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}