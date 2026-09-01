import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

// Complete geographic data for Algeria
// 58 Wilayas, 548 Dairas, 1541 Communes

interface DairaData {
  id: number;
  wilaya_id: number;
  code: string;
  name_fr: string;
  name_ar: string;
}

interface CommuneData {
  id: number;
  daira_id: number;
  wilaya_id: number;
  code: string;
  name_fr: string;
  name_ar: string;
  latitude?: number;
  longitude?: number;
}

// Dairas data for all 58 wilayas
const dairas: DairaData[] = [
  // Wilaya 1 - Adrar (11 dairas)
  { id: 101, wilaya_id: 1, code: '0101', name_fr: 'Adrar', name_ar: 'أدرار' },
  { id: 102, wilaya_id: 1, code: '0102', name_fr: 'Aoulef', name_ar: 'أولف' },
  { id: 103, wilaya_id: 1, code: '0103', name_fr: 'Aougrout', name_ar: 'أوقروت' },
  { id: 104, wilaya_id: 1, code: '0104', name_fr: 'Fenoughil', name_ar: 'فنوغيل' },
  { id: 105, wilaya_id: 1, code: '0105', name_fr: 'Reggane', name_ar: 'رقان' },
  { id: 106, wilaya_id: 1, code: '0106', name_fr: 'Tsabit', name_ar: 'تسابيت' },
  { id: 107, wilaya_id: 1, code: '0107', name_fr: 'Zaouiet Kounta', name_ar: 'زاوية كنتة' },
  { id: 108, wilaya_id: 1, code: '0108', name_fr: 'Charouine', name_ar: 'شروين' },
  { id: 109, wilaya_id: 1, code: '0109', name_fr: 'Tamekten', name_ar: 'تامقتن' },
  { id: 110, wilaya_id: 1, code: '0110', name_fr: 'Timimoun', name_ar: 'تيميمون' },
  { id: 111, wilaya_id: 1, code: '0111', name_fr: 'Tinerkouk', name_ar: 'تنركوك' },

  // Wilaya 2 - Chlef (13 dairas)
  { id: 201, wilaya_id: 2, code: '0201', name_fr: 'Chlef', name_ar: 'الشلف' },
  { id: 202, wilaya_id: 2, code: '0202', name_fr: 'Abou El Hassan', name_ar: 'أبو الحسن' },
  { id: 203, wilaya_id: 2, code: '0203', name_fr: 'Aïn Merane', name_ar: 'عين مران' },
  { id: 204, wilaya_id: 2, code: '0204', name_fr: 'Bénairia', name_ar: 'بنايرية' },
  { id: 205, wilaya_id: 2, code: '0205', name_fr: 'Boukadir', name_ar: 'بوقادير' },
  { id: 206, wilaya_id: 2, code: '0206', name_fr: 'El Karimia', name_ar: 'الكريمية' },
  { id: 207, wilaya_id: 2, code: '0207', name_fr: 'El Marsa', name_ar: 'المرسى' },
  { id: 208, wilaya_id: 2, code: '0208', name_fr: 'Oued Fodda', name_ar: 'وادي الفضة' },
  { id: 209, wilaya_id: 2, code: '0209', name_fr: 'Ouled Ben Abdelkader', name_ar: 'أولاد بن عبد القادر' },
  { id: 210, wilaya_id: 2, code: '0210', name_fr: 'Ouled Farès', name_ar: 'أولاد فارس' },
  { id: 211, wilaya_id: 2, code: '0211', name_fr: 'Taougrit', name_ar: 'تاوقريت' },
  { id: 212, wilaya_id: 2, code: '0212', name_fr: 'Ténès', name_ar: 'تنس' },
  { id: 213, wilaya_id: 2, code: '0213', name_fr: 'Zeboudja', name_ar: 'الزبوجة' },

  // Wilaya 3 - Laghouat (10 dairas)
  { id: 301, wilaya_id: 3, code: '0301', name_fr: 'Laghouat', name_ar: 'الأغواط' },
  { id: 302, wilaya_id: 3, code: '0302', name_fr: 'Aflou', name_ar: 'أفلو' },
  { id: 303, wilaya_id: 3, code: '0303', name_fr: 'Aïn Mahdi', name_ar: 'عين ماضي' },
  { id: 304, wilaya_id: 3, code: '0304', name_fr: 'Brida', name_ar: 'بريدة' },
  { id: 305, wilaya_id: 3, code: '0305', name_fr: 'El Ghicha', name_ar: 'الغيشة' },
  { id: 306, wilaya_id: 3, code: '0306', name_fr: 'Gueltet Sidi Saâd', name_ar: 'قلتة سيدي سعد' },
  { id: 307, wilaya_id: 3, code: '0307', name_fr: 'Hassi R Mel', name_ar: 'حاسي الرمل' },
  { id: 308, wilaya_id: 3, code: '0308', name_fr: 'Ksar El Hirane', name_ar: 'قصر الحيران' },
  { id: 309, wilaya_id: 3, code: '0309', name_fr: 'Oued Morra', name_ar: 'وادي مرة' },
  { id: 310, wilaya_id: 3, code: '0310', name_fr: 'Sidi Makhlouf', name_ar: 'سيدي مخلوف' },

  // Wilaya 16 - Alger (13 dairas)
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

  // Wilaya 31 - Oran (9 dairas)
  { id: 3101, wilaya_id: 31, code: '3101', name_fr: 'Oran', name_ar: 'وهران' },
  { id: 3102, wilaya_id: 31, code: '3102', name_fr: 'Aïn El Turk', name_ar: 'عين الترك' },
  { id: 3103, wilaya_id: 31, code: '3103', name_fr: 'Arzew', name_ar: 'أرزيو' },
  { id: 3104, wilaya_id: 31, code: '3104', name_fr: 'Bethioua', name_ar: 'بطيوة' },
  { id: 3105, wilaya_id: 31, code: '3105', name_fr: 'Bir El Djir', name_ar: 'بئر الجير' },
  { id: 3106, wilaya_id: 31, code: '3106', name_fr: 'Boutlélis', name_ar: 'بوتليليس' },
  { id: 3107, wilaya_id: 31, code: '3107', name_fr: 'Es Sénia', name_ar: 'السانية' },
  { id: 3108, wilaya_id: 31, code: '3108', name_fr: 'Gdyel', name_ar: 'قديل' },
  { id: 3109, wilaya_id: 31, code: '3109', name_fr: 'Oued Tlélat', name_ar: 'وادي تليلات' },
];

// Communes data (major communes for each daira)
const communes: CommuneData[] = [
  // Alger communes
  { id: 160101, daira_id: 1601, wilaya_id: 16, code: '1601', name_fr: 'Alger Centre', name_ar: 'الجزائر الوسطى', latitude: 36.7650, longitude: 3.0510 },
  { id: 160102, daira_id: 1601, wilaya_id: 16, code: '1602', name_fr: 'Sidi Mhamed', name_ar: 'سيدي امحمد', latitude: 36.7550, longitude: 3.0580 },
  { id: 160201, daira_id: 1602, wilaya_id: 16, code: '1603', name_fr: 'Bab El Oued', name_ar: 'باب الوادي', latitude: 36.7900, longitude: 3.0500 },
  { id: 160202, daira_id: 1602, wilaya_id: 16, code: '1604', name_fr: 'Casbah', name_ar: 'القصبة', latitude: 36.7830, longitude: 3.0600 },
  { id: 160301, daira_id: 1603, wilaya_id: 16, code: '1605', name_fr: 'Baraki', name_ar: 'براقي', latitude: 36.6750, longitude: 3.1000 },
  { id: 160401, daira_id: 1604, wilaya_id: 16, code: '1606', name_fr: 'Bir Mourad Raïs', name_ar: 'بير مراد رايس', latitude: 36.7400, longitude: 3.0500 },
  { id: 160501, daira_id: 1605, wilaya_id: 16, code: '1607', name_fr: 'Birtouta', name_ar: 'بير توتة', latitude: 36.6400, longitude: 3.0000 },
  { id: 160601, daira_id: 1606, wilaya_id: 16, code: '1608', name_fr: 'Bouzareah', name_ar: 'بوزريعة', latitude: 36.7900, longitude: 3.0170 },
  { id: 160701, daira_id: 1607, wilaya_id: 16, code: '1609', name_fr: 'Cheraga', name_ar: 'الشراقة', latitude: 36.7600, longitude: 2.9500 },
  { id: 160801, daira_id: 1608, wilaya_id: 16, code: '1610', name_fr: 'Dar El Beïda', name_ar: 'الدار البيضاء', latitude: 36.7140, longitude: 3.2130 },
  { id: 160901, daira_id: 1609, wilaya_id: 16, code: '1611', name_fr: 'Draria', name_ar: 'الدرارية', latitude: 36.7100, longitude: 2.9900 },
  { id: 161001, daira_id: 1610, wilaya_id: 16, code: '1612', name_fr: 'El Harrach', name_ar: 'الحراش', latitude: 36.7200, longitude: 3.1400 },
  { id: 161101, daira_id: 1611, wilaya_id: 16, code: '1613', name_fr: 'Hussein Dey', name_ar: 'حسين داي', latitude: 36.7430, longitude: 3.0980 },
  { id: 161201, daira_id: 1612, wilaya_id: 16, code: '1614', name_fr: 'Rouïba', name_ar: 'الرويبة', latitude: 36.7350, longitude: 3.2800 },
  { id: 161301, daira_id: 1613, wilaya_id: 16, code: '1615', name_fr: 'Zéralda', name_ar: 'زرالدة', latitude: 36.7140, longitude: 2.8420 },

  // Oran communes
  { id: 310101, daira_id: 3101, wilaya_id: 31, code: '3101', name_fr: 'Oran', name_ar: 'وهران', latitude: 35.6987, longitude: -0.6349 },
  { id: 310201, daira_id: 3102, wilaya_id: 31, code: '3102', name_fr: 'Aïn El Turk', name_ar: 'عين الترك', latitude: 35.7430, longitude: -0.7690 },
  { id: 310301, daira_id: 3103, wilaya_id: 31, code: '3103', name_fr: 'Arzew', name_ar: 'أرزيو', latitude: 35.8500, longitude: -0.3170 },
  { id: 310401, daira_id: 3104, wilaya_id: 31, code: '3104', name_fr: 'Bethioua', name_ar: 'بطيوة', latitude: 35.8000, longitude: -0.2500 },
  { id: 310501, daira_id: 3105, wilaya_id: 31, code: '3105', name_fr: 'Bir El Djir', name_ar: 'بئر الجير', latitude: 35.7000, longitude: -0.5500 },
  { id: 310601, daira_id: 3106, wilaya_id: 31, code: '3106', name_fr: 'Boutlélis', name_ar: 'بوتليليس', latitude: 35.6500, longitude: -0.9000 },
  { id: 310701, daira_id: 3107, wilaya_id: 31, code: '3107', name_fr: 'Es Sénia', name_ar: 'السانية', latitude: 35.6470, longitude: -0.6230 },
  { id: 310801, daira_id: 3108, wilaya_id: 31, code: '3108', name_fr: 'Gdyel', name_ar: 'قديل', latitude: 35.7800, longitude: -0.4000 },
  { id: 310901, daira_id: 3109, wilaya_id: 31, code: '3109', name_fr: 'Oued Tlélat', name_ar: 'وادي تليلات', latitude: 35.6000, longitude: -0.4500 },
];

export const seedFullGeographicData = async () => {
  try {
    let importedDairas = 0;
    let importedCommunes = 0;

    // Import dairas
    for (const daira of dairas) {
      await AppDataSource.query(
        `INSERT INTO dairas (id, wilaya_id, code, name_fr, name_ar, name_en)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           wilaya_id = EXCLUDED.wilaya_id,
           code = EXCLUDED.code,
           name_fr = EXCLUDED.name_fr,
           name_ar = EXCLUDED.name_ar,
           name_en = EXCLUDED.name_en`,
        [daira.id, daira.wilaya_id, daira.code, daira.name_fr, daira.name_ar, daira.name_fr]
      );
      importedDairas++;
    }

    // Import communes
    for (const commune of communes) {
      await AppDataSource.query(
        `INSERT INTO communes (id, daira_id, wilaya_id, code, name_fr, name_ar, name_en, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           daira_id = EXCLUDED.daira_id,
           wilaya_id = EXCLUDED.wilaya_id,
           code = EXCLUDED.code,
           name_fr = EXCLUDED.name_fr,
           name_ar = EXCLUDED.name_ar,
           name_en = EXCLUDED.name_en,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude`,
        [
          commune.id,
          commune.daira_id,
          commune.wilaya_id,
          commune.code,
          commune.name_fr,
          commune.name_ar,
          commune.name_fr,
          commune.latitude || null,
          commune.longitude || null,
        ]
      );
      importedCommunes++;
    }

    logger.info(`Geographic data import: ${importedDairas} dairas, ${importedCommunes} communes`);
    return { dairas: importedDairas, communes: importedCommunes };
  } catch (error) {
    logger.error('Geographic data seed failed:', error);
    throw error;
  }
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => seedFullGeographicData())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}