import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

/**
 * Complete Geographic Data for Algeria
 * 
 * This module provides the import function for the complete dataset.
 * 
 * Data source: Official Algerian government data (ONS - Office National des Statistiques)
 * 
 * For production use, download the full dataset from:
 * https://www.ons.dz/ or https://www.data.gov.dz/
 * 
 * The data should be provided as JSON with this structure:
 * {
 *   "dairas": [
 *     { "id": 101, "wilaya_id": 1, "code": "0101", "name_fr": "Adrar", "name_ar": "أدرار" }
 *   ],
 *   "communes": [
 *     { "id": 10101, "daira_id": 101, "wilaya_id": 1, "code": "0101", "name_fr": "Adrar", "name_ar": "أدرار", "latitude": 27.87, "longitude": -0.28 }
 *   ]
 * }
 */

interface DairaImport {
  id: number;
  wilaya_id: number;
  code: string;
  name_fr: string;
  name_ar: string;
}

interface CommuneImport {
  id: number;
  daira_id: number;
  wilaya_id: number;
  code: string;
  name_fr: string;
  name_ar: string;
  latitude?: number;
  longitude?: number;
}

const dairasData: DairaImport[] = [
  // Wilaya 4 - Oum El Bouaghi (12 dairas)
  { id: 401, wilaya_id: 4, code: '0401', name_fr: 'Oum El Bouaghi', name_ar: 'أم البواقي' },
  { id: 402, wilaya_id: 4, code: '0402', name_fr: 'Aïn Babouche', name_ar: 'عين بابوش' },
  { id: 403, wilaya_id: 4, code: '0403', name_fr: 'Aïn Beïda', name_ar: 'عين البيضاء' },
  { id: 404, wilaya_id: 4, code: '0404', name_fr: 'Aïn Fakroun', name_ar: 'عين فكرون' },
  { id: 405, wilaya_id: 4, code: '0405', name_fr: 'Aïn Kechra', name_ar: 'عين كرشة' },
  { id: 406, wilaya_id: 4, code: '0406', name_fr: 'Aïn M\'Lila', name_ar: 'عين مليلة' },
  { id: 407, wilaya_id: 4, code: '0407', name_fr: 'Dhalaa', name_ar: 'الضلعة' },
  { id: 408, wilaya_id: 4, code: '0408', name_fr: 'F\'Kirina', name_ar: 'فكيرينة' },
  { id: 409, wilaya_id: 4, code: '0409', name_fr: 'Ksar Sbahi', name_ar: 'قصر صباحي' },
  { id: 410, wilaya_id: 4, code: '0410', name_fr: 'Meskiana', name_ar: 'مسكيانة' },
  { id: 411, wilaya_id: 4, code: '0411', name_fr: 'Souk Naamane', name_ar: 'سوق نعمان' },
  { id: 412, wilaya_id: 4, code: '0412', name_fr: 'Sigus', name_ar: 'سيقوس' },

  // Wilaya 5 - Batna (21 dairas)
  { id: 501, wilaya_id: 5, code: '0501', name_fr: 'Batna', name_ar: 'باتنة' },
  { id: 502, wilaya_id: 5, code: '0502', name_fr: 'Aïn Djasser', name_ar: 'عين جاسر' },
  { id: 503, wilaya_id: 5, code: '0503', name_fr: 'Aïn Touta', name_ar: 'عين التوتة' },
  { id: 504, wilaya_id: 5, code: '0504', name_fr: 'Arris', name_ar: 'آريس' },
  { id: 505, wilaya_id: 5, code: '0505', name_fr: 'Barika', name_ar: 'بريكة' },
  { id: 506, wilaya_id: 5, code: '0506', name_fr: 'Bouzina', name_ar: 'بوزينة' },
  { id: 507, wilaya_id: 5, code: '0507', name_fr: 'Chemora', name_ar: 'الشمرة' },
  { id: 508, wilaya_id: 5, code: '0508', name_fr: 'Djezzar', name_ar: 'الجزار' },
  { id: 509, wilaya_id: 5, code: '0509', name_fr: 'El Madher', name_ar: 'المعذر' },
  { id: 510, wilaya_id: 5, code: '0510', name_fr: 'Ichmoul', name_ar: 'إشمول' },
  { id: 511, wilaya_id: 5, code: '0511', name_fr: 'Menaa', name_ar: 'منعة' },
  { id: 512, wilaya_id: 5, code: '0512', name_fr: 'Merouana', name_ar: 'مروانة' },
  { id: 513, wilaya_id: 5, code: '0513', name_fr: 'N\'Gaous', name_ar: 'نقاوس' },
  { id: 514, wilaya_id: 5, code: '0514', name_fr: 'Ouled Si Slimane', name_ar: 'أولاد سي سليمان' },
  { id: 515, wilaya_id: 5, code: '0515', name_fr: 'Ras El Aioun', name_ar: 'رأس العيون' },
  { id: 516, wilaya_id: 5, code: '0516', name_fr: 'Seggana', name_ar: 'سقانة' },
  { id: 517, wilaya_id: 5, code: '0517', name_fr: 'Seriana', name_ar: 'سريانة' },
  { id: 518, wilaya_id: 5, code: '0518', name_fr: 'Tazoult', name_ar: 'تازولت' },
  { id: 519, wilaya_id: 5, code: '0519', name_fr: 'Théniet El Abed', name_ar: 'ثنية العابد' },
  { id: 520, wilaya_id: 5, code: '0520', name_fr: 'Timgad', name_ar: 'تيمقاد' },
  { id: 521, wilaya_id: 5, code: '0521', name_fr: 'T\'Kout', name_ar: 'تكوت' },

  // Wilaya 6 - Béjaïa (19 dairas)
  { id: 601, wilaya_id: 6, code: '0601', name_fr: 'Béjaïa', name_ar: 'بجاية' },
  { id: 602, wilaya_id: 6, code: '0602', name_fr: 'Adekar', name_ar: 'أدكار' },
  { id: 603, wilaya_id: 6, code: '0603', name_fr: 'Akbou', name_ar: 'أقبو' },
  { id: 604, wilaya_id: 6, code: '0604', name_fr: 'Amizour', name_ar: 'أميزور' },
  { id: 605, wilaya_id: 6, code: '0605', name_fr: 'Aokas', name_ar: 'أوقاس' },
  { id: 606, wilaya_id: 6, code: '0606', name_fr: 'Barbacha', name_ar: 'برباشة' },
  { id: 607, wilaya_id: 6, code: '0607', name_fr: 'Beni Maouche', name_ar: 'بني معوش' },
  { id: 608, wilaya_id: 6, code: '0608', name_fr: 'Chemini', name_ar: 'شميني' },
  { id: 609, wilaya_id: 6, code: '0609', name_fr: 'Darguina', name_ar: 'درقينة' },
  { id: 610, wilaya_id: 6, code: '0610', name_fr: 'El Kseur', name_ar: 'القصر' },
  { id: 611, wilaya_id: 6, code: '0611', name_fr: 'Ighil Ali', name_ar: 'إغيل علي' },
  { id: 612, wilaya_id: 6, code: '0612', name_fr: 'Kherrata', name_ar: 'خراطة' },
  { id: 613, wilaya_id: 6, code: '0613', name_fr: 'Ouzellaguen', name_ar: 'أوزلاقن' },
  { id: 614, wilaya_id: 6, code: '0614', name_fr: 'Seddouk', name_ar: 'صدوق' },
  { id: 615, wilaya_id: 6, code: '0615', name_fr: 'Sidi Aïch', name_ar: 'سيدي عيش' },
  { id: 616, wilaya_id: 6, code: '0616', name_fr: 'Souk El Ténine', name_ar: 'سوق الإثنين' },
  { id: 617, wilaya_id: 6, code: '0617', name_fr: 'Tazmalt', name_ar: 'تازمالت' },
  { id: 618, wilaya_id: 6, code: '0618', name_fr: 'Tichy', name_ar: 'تيشي' },
  { id: 619, wilaya_id: 6, code: '0619', name_fr: 'Timezrit', name_ar: 'تيمزريت' },

  // Wilaya 7 - Biskra (12 dairas)
  { id: 701, wilaya_id: 7, code: '0701', name_fr: 'Biskra', name_ar: 'بسكرة' },
  { id: 702, wilaya_id: 7, code: '0702', name_fr: 'Djemorah', name_ar: 'جمورة' },
  { id: 703, wilaya_id: 7, code: '0703', name_fr: 'El Kantara', name_ar: 'القنطرة' },
  { id: 704, wilaya_id: 7, code: '0704', name_fr: 'El Outaya', name_ar: 'الوطاية' },
  { id: 705, wilaya_id: 7, code: '0705', name_fr: 'Foughala', name_ar: 'فوغالة' },
  { id: 706, wilaya_id: 7, code: '0706', name_fr: 'M\'Chouneche', name_ar: 'مشونش' },
  { id: 707, wilaya_id: 7, code: '0707', name_fr: 'Ouled Djellal', name_ar: 'أولاد جلال' },
  { id: 708, wilaya_id: 7, code: '0708', name_fr: 'Sidi Khaled', name_ar: 'سيدي خالد' },
  { id: 709, wilaya_id: 7, code: '0709', name_fr: 'Sidi Okba', name_ar: 'سيدي عقبة' },
  { id: 710, wilaya_id: 7, code: '0710', name_fr: 'Tolga', name_ar: 'طولقة' },
  { id: 711, wilaya_id: 7, code: '0711', name_fr: 'Zeribet El Oued', name_ar: 'زريبة الوادي' },

  // Wilaya 9 - Blida (10 dairas)
  { id: 901, wilaya_id: 9, code: '0901', name_fr: 'Blida', name_ar: 'البليدة' },
  { id: 902, wilaya_id: 9, code: '0902', name_fr: 'Boufarik', name_ar: 'بوفاريك' },
  { id: 903, wilaya_id: 9, code: '0903', name_fr: 'Bougara', name_ar: 'بوقرة' },
  { id: 904, wilaya_id: 9, code: '0904', name_fr: 'Bouinan', name_ar: 'بوعينان' },
  { id: 905, wilaya_id: 9, code: '0905', name_fr: 'El Affroun', name_ar: 'العفرون' },
  { id: 906, wilaya_id: 9, code: '0906', name_fr: 'Larbaa', name_ar: 'الأربعاء' },
  { id: 907, wilaya_id: 9, code: '0907', name_fr: 'Mouzaia', name_ar: 'موزاية' },
  { id: 908, wilaya_id: 9, code: '0908', name_fr: 'Oued El Alleug', name_ar: 'وادي العلايق' },
  { id: 909, wilaya_id: 9, code: '0909', name_fr: 'Ouled Yaïch', name_ar: 'أولاد يعيش' },
  { id: 910, wilaya_id: 9, code: '0910', name_fr: 'Soumaa', name_ar: 'الصومعة' },

  // Wilaya 10 - Bouira (12 dairas)
  { id: 1001, wilaya_id: 10, code: '1001', name_fr: 'Bouira', name_ar: 'البويرة' },
  { id: 1002, wilaya_id: 10, code: '1002', name_fr: 'Aïn Bessam', name_ar: 'عين بسام' },
  { id: 1003, wilaya_id: 10, code: '1003', name_fr: 'Bechloul', name_ar: 'بشلول' },
  { id: 1004, wilaya_id: 10, code: '1004', name_fr: 'Bir Ghbalou', name_ar: 'بئر غبالو' },
  { id: 1005, wilaya_id: 10, code: '1005', name_fr: 'Bordj Okhriss', name_ar: 'برج أوخريس' },
  { id: 1006, wilaya_id: 10, code: '1006', name_fr: 'Haizer', name_ar: 'حيزر' },
  { id: 1007, wilaya_id: 10, code: '1007', name_fr: 'Kadiria', name_ar: 'قادرية' },
  { id: 1008, wilaya_id: 10, code: '1008', name_fr: 'Lakhdaria', name_ar: 'الأخضرية' },
  { id: 1009, wilaya_id: 10, code: '1009', name_fr: 'M\'Chedallah', name_ar: 'مشدالة' },
  { id: 1010, wilaya_id: 10, code: '1010', name_fr: 'Souk El Khemis', name_ar: 'سوق الخميس' },
  { id: 1011, wilaya_id: 10, code: '1011', name_fr: 'Sour El Ghozlane', name_ar: 'سور الغزلان' },
];

// Major communes with coordinates for key wilayas
const communesData: CommuneImport[] = [
  // Wilaya 4 - Oum El Bouaghi major communes
  { id: 40101, daira_id: 401, wilaya_id: 4, code: '0401', name_fr: 'Oum El Bouaghi', name_ar: 'أم البواقي', latitude: 35.8700, longitude: 7.1150 },
  { id: 40301, daira_id: 403, wilaya_id: 4, code: '0403', name_fr: 'Aïn Beïda', name_ar: 'عين البيضاء', latitude: 35.7960, longitude: 7.3920 },
  { id: 40401, daira_id: 404, wilaya_id: 4, code: '0404', name_fr: 'Aïn Fakroun', name_ar: 'عين فكرون', latitude: 35.9700, longitude: 6.8700 },

  // Wilaya 5 - Batna major communes
  { id: 50101, daira_id: 501, wilaya_id: 5, code: '0501', name_fr: 'Batna', name_ar: 'باتنة', latitude: 35.5550, longitude: 6.1740 },
  { id: 50301, daira_id: 503, wilaya_id: 5, code: '0503', name_fr: 'Aïn Touta', name_ar: 'عين التوتة', latitude: 35.3880, longitude: 5.8950 },
  { id: 50501, daira_id: 505, wilaya_id: 5, code: '0505', name_fr: 'Barika', name_ar: 'بريكة', latitude: 35.3890, longitude: 5.3650 },

  // Wilaya 6 - Béjaïa major communes
  { id: 60101, daira_id: 601, wilaya_id: 6, code: '0601', name_fr: 'Béjaïa', name_ar: 'بجاية', latitude: 36.7510, longitude: 5.0640 },
  { id: 60301, daira_id: 603, wilaya_id: 6, code: '0603', name_fr: 'Akbou', name_ar: 'أقبو', latitude: 36.4570, longitude: 4.5340 },

  // Wilaya 7 - Biskra major communes
  { id: 70101, daira_id: 701, wilaya_id: 7, code: '0701', name_fr: 'Biskra', name_ar: 'بسكرة', latitude: 34.8500, longitude: 5.7280 },
  { id: 70501, daira_id: 705, wilaya_id: 7, code: '0705', name_fr: 'Foughala', name_ar: 'فوغالة', latitude: 34.7220, longitude: 5.3240 },

  // Wilaya 9 - Blida major communes
  { id: 90101, daira_id: 901, wilaya_id: 9, code: '0901', name_fr: 'Blida', name_ar: 'البليدة', latitude: 36.4720, longitude: 2.8280 },
  { id: 90201, daira_id: 902, wilaya_id: 9, code: '0902', name_fr: 'Boufarik', name_ar: 'بوفاريك', latitude: 36.5740, longitude: 2.9120 },

  // Wilaya 10 - Bouira major communes
  { id: 100101, daira_id: 1001, wilaya_id: 10, code: '1001', name_fr: 'Bouira', name_ar: 'البويرة', latitude: 36.3750, longitude: 3.9020 },
  { id: 100701, daira_id: 1007, wilaya_id: 10, code: '1007', name_fr: 'Kadiria', name_ar: 'قادرية', latitude: 36.5330, longitude: 3.6830 },
];

export const seedCompleteGeographicData = async () => {
  try {
    let importedDairas = 0;
    let importedCommunes = 0;

    for (const daira of dairasData) {
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

    for (const commune of communesData) {
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
        [commune.id, commune.daira_id, commune.wilaya_id, commune.code, commune.name_fr, commune.name_ar, commune.name_fr, commune.latitude || null, commune.longitude || null]
      );
      importedCommunes++;
    }

    logger.info(`Complete geographic data import: ${importedDairas} dairas, ${importedCommunes} communes`);
    return { dairas: importedDairas, communes: importedCommunes };
  } catch (error) {
    logger.error('Complete geographic data seed failed:', error);
    throw error;
  }
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => seedCompleteGeographicData())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}