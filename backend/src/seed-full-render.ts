import { DataSource } from 'typeorm';

const renderDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-dabd9ccs728c73ac9ec0-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'resto_dz_user',
  password: 'TVLkuCna5JfQLQr720XHhu1KA2n4CUy8',
  database: 'resto_dz',
  ssl: { rejectUnauthorized: false },
});

// All 58 Wilayas
const wilayas = [
  { id: 1, code: '01', name_fr: 'Adrar', name_ar: 'أدرار', name_en: 'Adrar' },
  { id: 2, code: '02', name_fr: 'Chlef', name_ar: 'الشلف', name_en: 'Chlef' },
  { id: 3, code: '03', name_fr: 'Laghouat', name_ar: 'الأغواط', name_en: 'Laghouat' },
  { id: 4, code: '04', name_fr: 'Oum El Bouaghi', name_ar: 'أم البواقي', name_en: 'Oum El Bouaghi' },
  { id: 5, code: '05', name_fr: 'Batna', name_ar: 'باتنة', name_en: 'Batna' },
  { id: 6, code: '06', name_fr: 'Béjaïa', name_ar: 'بجاية', name_en: 'Bejaia' },
  { id: 7, code: '07', name_fr: 'Biskra', name_ar: 'بسكرة', name_en: 'Biskra' },
  { id: 8, code: '08', name_fr: 'Béchar', name_ar: 'بشار', name_en: 'Bechar' },
  { id: 9, code: '09', name_fr: 'Blida', name_ar: 'البليدة', name_en: 'Blida' },
  { id: 10, code: '10', name_fr: 'Bouira', name_ar: 'البويرة', name_en: 'Bouira' },
  { id: 11, code: '11', name_fr: 'Tamanrasset', name_ar: 'تمنراست', name_en: 'Tamanrasset' },
  { id: 12, code: '12', name_fr: 'Tébessa', name_ar: 'تبسة', name_en: 'Tebessa' },
  { id: 13, code: '13', name_fr: 'Tlemcen', name_ar: 'تلمسان', name_en: 'Tlemcen' },
  { id: 14, code: '14', name_fr: 'Tiaret', name_ar: 'تيارت', name_en: 'Tiaret' },
  { id: 15, code: '15', name_fr: 'Tizi Ouzou', name_ar: 'تيزي وزو', name_en: 'Tizi Ouzou' },
  { id: 16, code: '16', name_fr: 'Alger', name_ar: 'الجزائر', name_en: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
  { id: 17, code: '17', name_fr: 'Djelfa', name_ar: 'الجلفة', name_en: 'Djelfa' },
  { id: 18, code: '18', name_fr: 'Jijel', name_ar: 'جيجل', name_en: 'Jijel' },
  { id: 19, code: '19', name_fr: 'Sétif', name_ar: 'سطيف', name_en: 'Setif' },
  { id: 20, code: '20', name_fr: 'Saïda', name_ar: 'سعيدة', name_en: 'Saida' },
  { id: 21, code: '21', name_fr: 'Skikda', name_ar: 'سكيكدة', name_en: 'Skikda' },
  { id: 22, code: '22', name_fr: 'Sidi Bel Abbès', name_ar: 'سيدي بلعباس', name_en: 'Sidi Bel Abbes' },
  { id: 23, code: '23', name_fr: 'Annaba', name_ar: 'عنابة', name_en: 'Annaba' },
  { id: 24, code: '24', name_fr: 'Guelma', name_ar: 'قالمة', name_en: 'Guelma' },
  { id: 25, code: '25', name_fr: 'Constantine', name_ar: 'قسنطينة', name_en: 'Constantine' },
  { id: 26, code: '26', name_fr: 'Médéa', name_ar: 'المدية', name_en: 'Medea' },
  { id: 27, code: '27', name_fr: 'Mostaganem', name_ar: 'مستغانم', name_en: 'Mostaganem' },
  { id: 28, code: '28', name_fr: "M'Sila", name_ar: 'المسيلة', name_en: "M'Sila" },
  { id: 29, code: '29', name_fr: 'Mascara', name_ar: 'معسكر', name_en: 'Mascara' },
  { id: 30, code: '30', name_fr: 'Ouargla', name_ar: 'ورقلة', name_en: 'Ouargla' },
  { id: 31, code: '31', name_fr: 'Oran', name_ar: 'وهران', name_en: 'Oran', latitude: 35.6987, longitude: -0.6349 },
  { id: 32, code: '32', name_fr: 'El Bayadh', name_ar: 'البيض', name_en: 'El Bayadh' },
  { id: 33, code: '33', name_fr: 'Illizi', name_ar: 'إليزي', name_en: 'Illizi' },
  { id: 34, code: '34', name_fr: 'Bordj Bou Arreridj', name_ar: 'برج بوعريريج', name_en: 'Bordj Bou Arreridj' },
  { id: 35, code: '35', name_fr: 'Boumerdès', name_ar: 'بومرداس', name_en: 'Boumerdes' },
  { id: 36, code: '36', name_fr: 'El Tarf', name_ar: 'الطارف', name_en: 'El Tarf' },
  { id: 37, code: '37', name_fr: 'Tindouf', name_ar: 'تندوف', name_en: 'Tindouf' },
  { id: 38, code: '38', name_fr: 'Tissemsilt', name_ar: 'تيسمسيلت', name_en: 'Tissemsilt' },
  { id: 39, code: '39', name_fr: 'El Oued', name_ar: 'الوادي', name_en: 'El Oued' },
  { id: 40, code: '40', name_fr: 'Khenchela', name_ar: 'خنشلة', name_en: 'Khenchela' },
  { id: 41, code: '41', name_fr: 'Souk Ahras', name_ar: 'سوق أهراس', name_en: 'Souk Ahras' },
  { id: 42, code: '42', name_fr: 'Tipaza', name_ar: 'تيبازة', name_en: 'Tipaza' },
  { id: 43, code: '43', name_fr: 'Mila', name_ar: 'ميلة', name_en: 'Mila' },
  { id: 44, code: '44', name_fr: 'Aïn Defla', name_ar: 'عين الدفلى', name_en: 'Ain Defla' },
  { id: 45, code: '45', name_fr: 'Naâma', name_ar: 'النعامة', name_en: 'Naama' },
  { id: 46, code: '46', name_fr: 'Aïn Témouchent', name_ar: 'عين تموشنت', name_en: 'Ain Temouchent' },
  { id: 47, code: '47', name_fr: 'Ghardaïa', name_ar: 'غرداية', name_en: 'Ghardaia' },
  { id: 48, code: '48', name_fr: 'Relizane', name_ar: 'غليزان', name_en: 'Relizane' },
  { id: 49, code: '49', name_fr: 'Timimoun', name_ar: 'تيميمون', name_en: 'Timimoun' },
  { id: 50, code: '50', name_fr: 'Bordj Badji Mokhtar', name_ar: 'برج باجي مختار', name_en: 'Bordj Badji Mokhtar' },
  { id: 51, code: '51', name_fr: 'Ouled Djellal', name_ar: 'أولاد جلال', name_en: 'Ouled Djellal' },
  { id: 52, code: '52', name_fr: 'Béni Abbès', name_ar: 'بني عباس', name_en: 'Beni Abbes' },
  { id: 53, code: '53', name_fr: 'In Salah', name_ar: 'عين صالح', name_en: 'In Salah' },
  { id: 54, code: '54', name_fr: 'In Guezzam', name_ar: 'عين قزام', name_en: 'In Guezzam' },
  { id: 55, code: '55', name_fr: 'Touggourt', name_ar: 'تقرت', name_en: 'Touggourt' },
  { id: 56, code: '56', name_fr: 'Djanet', name_ar: 'جانت', name_en: 'Djanet' },
  { id: 57, code: '57', name_fr: "El M'Ghair", name_ar: 'المغير', name_en: "El M'Ghair" },
  { id: 58, code: '58', name_fr: 'El Meniaa', name_ar: 'المنيعة', name_en: 'El Meniaa' },
];

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

const seedFullData = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected to Render DB');

    // Seed all 58 wilayas
    for (const w of wilayas) {
      await renderDataSource.query(
        `INSERT INTO wilayas (id, code, name_fr, name_ar, name_en, latitude, longitude) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET
           name_fr = EXCLUDED.name_fr, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en`,
        [w.id, w.code, w.name_fr, w.name_ar, w.name_en, w.latitude || null, w.longitude || null]
      );
    }
    console.log('✅ All 58 wilayas seeded');

    // Seed all 17 categories
    for (const c of categories) {
      await renderDataSource.query(
        `INSERT INTO categories (name_fr, name_ar, name_en, icon) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (name_fr) DO NOTHING`,
        [c.name_fr, c.name_ar, c.name_en, c.icon]
      );
    }
    console.log('✅ All 17 categories seeded');

    // Seed all 8 cuisines
    for (const c of cuisines) {
      await renderDataSource.query(
        `INSERT INTO cuisines (name_fr, name_ar, name_en, icon) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (name_fr) DO NOTHING`,
        [c.name_fr, c.name_ar, c.name_en, c.icon]
      );
    }
    console.log('✅ All 8 cuisines seeded');

    await renderDataSource.destroy();
    console.log('✅ COMPLETE DATA SEEDED');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedFullData();