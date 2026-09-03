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

const dairas = [
  // Alger (16)
  { id: 1601, wilaya_id: 16, code: '1601', name_fr: 'Alger Centre', name_ar: 'الجزائر الوسطى' },
  { id: 1602, wilaya_id: 16, code: '1602', name_fr: 'Bab El Oued', name_ar: 'باب الوادي' },
  { id: 1603, wilaya_id: 16, code: '1603', name_fr: 'Baraki', name_ar: 'براقي' },
  { id: 1604, wilaya_id: 16, code: '1604', name_fr: 'Bir Mourad Raïs', name_ar: 'بير مراد رايس' },
  { id: 1605, wilaya_id: 16, code: '1605', name_fr: 'Birtouta', name_ar: 'بير توتة' },
  { id: 1606, wilaya_id: 16, code: '1606', name_fr: 'Bouzareah', name_ar: 'بوزريعة' },
  { id: 1607, wilaya_id: 16, code: '1607', name_fr: 'Cheraga', name_ar: 'الشراقة' },
  { id: 1608, wilaya_id: 16, code: '1608', name_fr: 'Dar El Beïda', name_ar: 'الدار البيضاء' },
  { id: 1609, wilaya_id: 16, code: '1609', name_fr: 'Draria', name_ar: 'الدرارية' },
  { id: 1610, wilaya_id: 16, code: '1610', name_fr: 'El Harrach', name_ar: 'الحراش' },
  { id: 1611, wilaya_id: 16, code: '1611', name_fr: 'Hussein Dey', name_ar: 'حسين داي' },
  { id: 1612, wilaya_id: 16, code: '1612', name_fr: 'Rouïba', name_ar: 'الرويبة' },
  { id: 1613, wilaya_id: 16, code: '1613', name_fr: 'Zéralda', name_ar: 'زرالدة' },

  // Oran (31)
  { id: 3101, wilaya_id: 31, code: '3101', name_fr: 'Oran', name_ar: 'وهران' },
  { id: 3102, wilaya_id: 31, code: '3102', name_fr: 'Aïn El Turk', name_ar: 'عين الترك' },
  { id: 3103, wilaya_id: 31, code: '3103', name_fr: 'Arzew', name_ar: 'أرزيو' },
  { id: 3104, wilaya_id: 31, code: '3104', name_fr: 'Bethioua', name_ar: 'بطيوة' },
  { id: 3105, wilaya_id: 31, code: '3105', name_fr: 'Bir El Djir', name_ar: 'بئر الجير' },
  { id: 3106, wilaya_id: 31, code: '3106', name_fr: 'Boutlélis', name_ar: 'بوتليليس' },
  { id: 3107, wilaya_id: 31, code: '3107', name_fr: 'Es Sénia', name_ar: 'السانية' },
  { id: 3108, wilaya_id: 31, code: '3108', name_fr: 'Gdyel', name_ar: 'قديل' },
  { id: 3109, wilaya_id: 31, code: '3109', name_fr: 'Oued Tlélat', name_ar: 'وادي تليلات' },

  // Batna (5)
  { id: 501, wilaya_id: 5, code: '0501', name_fr: 'Batna', name_ar: 'باتنة' },
  { id: 502, wilaya_id: 5, code: '0502', name_fr: 'Aïn Djasser', name_ar: 'عين جاسر' },
  { id: 503, wilaya_id: 5, code: '0503', name_fr: 'Aïn Touta', name_ar: 'عين التوتة' },
  { id: 504, wilaya_id: 5, code: '0504', name_fr: 'Arris', name_ar: 'آريس' },
  { id: 505, wilaya_id: 5, code: '0505', name_fr: 'Barika', name_ar: 'بريكة' },

  // Constantine (25)
  { id: 2501, wilaya_id: 25, code: '2501', name_fr: 'Constantine', name_ar: 'قسنطينة' },
  { id: 2502, wilaya_id: 25, code: '2502', name_fr: 'Aïn Abid', name_ar: 'عين عبيد' },
  { id: 2503, wilaya_id: 25, code: '2503', name_fr: 'El Khroub', name_ar: 'الخروب' },
  { id: 2504, wilaya_id: 25, code: '2504', name_fr: 'Hamma Bouziane', name_ar: 'حامة بوزيان' },
  { id: 2505, wilaya_id: 25, code: '2505', name_fr: 'Ibn Ziad', name_ar: 'ابن زياد' },
  { id: 2506, wilaya_id: 25, code: '2506', name_fr: 'Zighoud Youcef', name_ar: 'زيغود يوسف' },

  // Sétif (19)
  { id: 1901, wilaya_id: 19, code: '1901', name_fr: 'Sétif', name_ar: 'سطيف' },
  { id: 1902, wilaya_id: 19, code: '1902', name_fr: 'Aïn Arnat', name_ar: 'عين أرنات' },
  { id: 1903, wilaya_id: 19, code: '1903', name_fr: 'Aïn Azel', name_ar: 'عين أزال' },
  { id: 1904, wilaya_id: 19, code: '1904', name_fr: 'El Eulma', name_ar: 'العلمة' },
  { id: 1905, wilaya_id: 19, code: '1905', name_fr: 'Djémila', name_ar: 'جميلة' },

  // Blida (9)
  { id: 901, wilaya_id: 9, code: '0901', name_fr: 'Blida', name_ar: 'البليدة' },
  { id: 902, wilaya_id: 9, code: '0902', name_fr: 'Boufarik', name_ar: 'بوفاريك' },
  { id: 903, wilaya_id: 9, code: '0903', name_fr: 'Bougara', name_ar: 'بوقرة' },
  { id: 904, wilaya_id: 9, code: '0904', name_fr: 'El Affroun', name_ar: 'العفرون' },

  // Tlemcen (13)
  { id: 1301, wilaya_id: 13, code: '1301', name_fr: 'Tlemcen', name_ar: 'تلمسان' },
  { id: 1302, wilaya_id: 13, code: '1302', name_fr: 'Maghnia', name_ar: 'مغنية' },
  { id: 1303, wilaya_id: 13, code: '1303', name_fr: 'Nedroma', name_ar: 'ندرومة' },

  // Annaba (23)
  { id: 2301, wilaya_id: 23, code: '2301', name_fr: 'Annaba', name_ar: 'عنابة' },
  { id: 2302, wilaya_id: 23, code: '2302', name_fr: 'El Bouni', name_ar: 'البوني' },
  { id: 2303, wilaya_id: 23, code: '2303', name_fr: 'El Hadjar', name_ar: 'الحجار' },

  // Boumerdès (35)
  { id: 3501, wilaya_id: 35, code: '3501', name_fr: 'Boumerdès', name_ar: 'بومرداس' },
  { id: 3502, wilaya_id: 35, code: '3502', name_fr: 'Bordj Menaiel', name_ar: 'برج منايل' },
  { id: 3503, wilaya_id: 35, code: '3503', name_fr: 'Dellys', name_ar: 'دلس' },
];

const seedDairas = async () => {
  try {
    await renderDataSource.initialize();
    console.log('Connected');

    for (const d of dairas) {
      await renderDataSource.query(
        `INSERT INTO dairas (id, wilaya_id, code, name_fr, name_ar, name_en) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [d.id, d.wilaya_id, d.code, d.name_fr, d.name_ar, d.name_fr]
      );
    }

    console.log(`✅ ${dairas.length} dairas seeded`);
    await renderDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDairas();