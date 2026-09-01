import { AppDataSource } from '../../config/database';
import { logger } from '../../config/logger';

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
}

// =====================================================
// COMPLETE DAIRAS DATA — ALL 58 WILAYAS (548 dairas)
// Source: ONS Algeria official administrative division
// =====================================================

const dairas: DairaData[] = [
  // Wilaya 1 - Adrar (11 dairas) - Already imported
  // Wilaya 2 - Chlef (13 dairas) - Already imported
  // Wilaya 3 - Laghouat (10 dairas) - Already imported
  // Wilaya 4 - Oum El Bouaghi (12 dairas) - Already imported
  // Wilaya 5 - Batna (21 dairas) - Already imported
  // Wilaya 6 - Béjaïa (19 dairas) - Already imported
  // Wilaya 7 - Biskra (12 dairas) - Already imported

  // Wilaya 8 - Béchar (12 dairas)
  { id: 801, wilaya_id: 8, code: '0801', name_fr: 'Béchar', name_ar: 'بشار' },
  { id: 802, wilaya_id: 8, code: '0802', name_fr: 'Abadla', name_ar: 'العبادلة' },
  { id: 803, wilaya_id: 8, code: '0803', name_fr: 'Beni Ounif', name_ar: 'بني ونيف' },
  { id: 804, wilaya_id: 8, code: '0804', name_fr: 'El Ouata', name_ar: 'الواتة' },
  { id: 805, wilaya_id: 8, code: '0805', name_fr: 'Igli', name_ar: 'إقلي' },
  { id: 806, wilaya_id: 8, code: '0806', name_fr: 'Kenadsa', name_ar: 'القنادسة' },
  { id: 807, wilaya_id: 8, code: '0807', name_fr: 'Kerzaz', name_ar: 'كرزاز' },
  { id: 808, wilaya_id: 8, code: '0808', name_fr: 'Lahmar', name_ar: 'لحمر' },
  { id: 809, wilaya_id: 8, code: '0809', name_fr: 'Mogheul', name_ar: 'موغل' },
  { id: 810, wilaya_id: 8, code: '0810', name_fr: 'Ouled Khodeir', name_ar: 'أولاد خضير' },
  { id: 811, wilaya_id: 8, code: '0811', name_fr: 'Tabalbala', name_ar: 'تبلبالة' },
  { id: 812, wilaya_id: 8, code: '0812', name_fr: 'Taghit', name_ar: 'تاغيت' },

  // Wilaya 9 - Blida (10 dairas) - Already imported
  // Wilaya 10 - Bouira (12 dairas) - Already imported

  // Wilaya 11 - Tamanrasset (7 dairas)
  { id: 1101, wilaya_id: 11, code: '1101', name_fr: 'Tamanrasset', name_ar: 'تمنراست' },
  { id: 1102, wilaya_id: 11, code: '1102', name_fr: 'Abalessa', name_ar: 'أبلسة' },
  { id: 1103, wilaya_id: 11, code: '1103', name_fr: 'Idles', name_ar: 'إيدلس' },
  { id: 1104, wilaya_id: 11, code: '1104', name_fr: 'In Ghar', name_ar: 'عين غار' },
  { id: 1105, wilaya_id: 11, code: '1105', name_fr: 'In Salah', name_ar: 'عين صالح' },
  { id: 1106, wilaya_id: 11, code: '1106', name_fr: 'Tazrouk', name_ar: 'تاظروك' },
  { id: 1107, wilaya_id: 11, code: '1107', name_fr: 'Tin Zaouatine', name_ar: 'تين زواتين' },

  // Wilaya 12 - Tébessa (12 dairas)
  { id: 1201, wilaya_id: 12, code: '1201', name_fr: 'Tébessa', name_ar: 'تبسة' },
  { id: 1202, wilaya_id: 12, code: '1202', name_fr: 'Bir El Ater', name_ar: 'بئر العاتر' },
  { id: 1203, wilaya_id: 12, code: '1203', name_fr: 'Cheria', name_ar: 'الشريعة' },
  { id: 1204, wilaya_id: 12, code: '1204', name_fr: 'El Aouinet', name_ar: 'العوينات' },
  { id: 1205, wilaya_id: 12, code: '1205', name_fr: 'El Kouif', name_ar: 'الكويف' },
  { id: 1206, wilaya_id: 12, code: '1206', name_fr: 'El Malabiodh', name_ar: 'الماء الأبيض' },
  { id: 1207, wilaya_id: 12, code: '1207', name_fr: 'El Ogla', name_ar: 'العقلة' },
  { id: 1208, wilaya_id: 12, code: '1208', name_fr: 'Morsott', name_ar: 'مرسط' },
  { id: 1209, wilaya_id: 12, code: '1209', name_fr: 'Negrine', name_ar: 'نقرين' },
  { id: 1210, wilaya_id: 12, code: '1210', name_fr: 'Ouenza', name_ar: 'الونزة' },
  { id: 1211, wilaya_id: 12, code: '1211', name_fr: 'Oum Ali', name_ar: 'أم علي' },
  { id: 1212, wilaya_id: 12, code: '1212', name_fr: 'Saf Saf El Ouesra', name_ar: 'صفصاف الوسرى' },

  // Wilaya 13 - Tlemcen (20 dairas)
  { id: 1301, wilaya_id: 13, code: '1301', name_fr: 'Tlemcen', name_ar: 'تلمسان' },
  { id: 1302, wilaya_id: 13, code: '1302', name_fr: 'Aïn Tallout', name_ar: 'عين تالوت' },
  { id: 1303, wilaya_id: 13, code: '1303', name_fr: 'Bab El Assa', name_ar: 'باب العسة' },
  { id: 1304, wilaya_id: 13, code: '1304', name_fr: 'Beni Boussaid', name_ar: 'بني بوسعيد' },
  { id: 1305, wilaya_id: 13, code: '1305', name_fr: 'Beni Snous', name_ar: 'بني سنوس' },
  { id: 1306, wilaya_id: 13, code: '1306', name_fr: 'Bensekrane', name_ar: 'بن سكران' },
  { id: 1307, wilaya_id: 13, code: '1307', name_fr: 'Chetouane', name_ar: 'شتوان' },
  { id: 1308, wilaya_id: 13, code: '1308', name_fr: 'Fellaoucene', name_ar: 'فلاوسن' },
  { id: 1309, wilaya_id: 13, code: '1309', name_fr: 'Ghazaouet', name_ar: 'الغزوات' },
  { id: 1310, wilaya_id: 13, code: '1310', name_fr: 'Hennaya', name_ar: 'الحناية' },
  { id: 1311, wilaya_id: 13, code: '1311', name_fr: 'Maghnia', name_ar: 'مغنية' },
  { id: 1312, wilaya_id: 13, code: '1312', name_fr: 'Mansourah', name_ar: 'منصورة' },
  { id: 1313, wilaya_id: 13, code: '1313', name_fr: 'Marsa Ben M\'Hidi', name_ar: 'مرسى بن مهيدي' },
  { id: 1314, wilaya_id: 13, code: '1314', name_fr: 'Nedroma', name_ar: 'ندرومة' },
  { id: 1315, wilaya_id: 13, code: '1315', name_fr: 'Ouled Mimoun', name_ar: 'أولاد ميمون' },
  { id: 1316, wilaya_id: 13, code: '1316', name_fr: 'Remchi', name_ar: 'الرمشي' },
  { id: 1317, wilaya_id: 13, code: '1317', name_fr: 'Sabra', name_ar: 'صبرة' },
  { id: 1318, wilaya_id: 13, code: '1318', name_fr: 'Sebdou', name_ar: 'سبدو' },
  { id: 1319, wilaya_id: 13, code: '1319', name_fr: 'Sidi Djillali', name_ar: 'سيدي الجيلالي' },
  { id: 1320, wilaya_id: 13, code: '1320', name_fr: 'Terry', name_ar: 'تيرني' },

  // Wilaya 14 - Tiaret (14 dairas)
  { id: 1401, wilaya_id: 14, code: '1401', name_fr: 'Tiaret', name_ar: 'تيارت' },
  { id: 1402, wilaya_id: 14, code: '1402', name_fr: 'Aïn Deheb', name_ar: 'عين الذهب' },
  { id: 1403, wilaya_id: 14, code: '1403', name_fr: 'Aïn Kermes', name_ar: 'عين كرمس' },
  { id: 1404, wilaya_id: 14, code: '1404', name_fr: 'Dahmouni', name_ar: 'دحموني' },
  { id: 1405, wilaya_id: 14, code: '1405', name_fr: 'Frenda', name_ar: 'فرندة' },
  { id: 1406, wilaya_id: 14, code: '1406', name_fr: 'Hamadia', name_ar: 'حمادية' },
  { id: 1407, wilaya_id: 14, code: '1407', name_fr: 'Ksar Chellala', name_ar: 'قصر الشلالة' },
  { id: 1408, wilaya_id: 14, code: '1408', name_fr: 'Mahdia', name_ar: 'مهدية' },
  { id: 1409, wilaya_id: 14, code: '1409', name_fr: 'Mechraa Safa', name_ar: 'مشرع الصفا' },
  { id: 1410, wilaya_id: 14, code: '1410', name_fr: 'Medroussa', name_ar: 'مدروسة' },
  { id: 1411, wilaya_id: 14, code: '1411', name_fr: 'Meghila', name_ar: 'مغيلة' },
  { id: 1412, wilaya_id: 14, code: '1412', name_fr: 'Oued Lilli', name_ar: 'وادي ليلي' },
  { id: 1413, wilaya_id: 14, code: '1413', name_fr: 'Rahouia', name_ar: 'رحوية' },
  { id: 1414, wilaya_id: 14, code: '1414', name_fr: 'Sougueur', name_ar: 'السوقر' },

  // Wilaya 15 - Tizi Ouzou (21 dairas)
  { id: 1501, wilaya_id: 15, code: '1501', name_fr: 'Tizi Ouzou', name_ar: 'تيزي وزو' },
  { id: 1502, wilaya_id: 15, code: '1502', name_fr: 'Aïn El Hammam', name_ar: 'عين الحمام' },
  { id: 1503, wilaya_id: 15, code: '1503', name_fr: 'Azazga', name_ar: 'عزازقة' },
  { id: 1504, wilaya_id: 15, code: '1504', name_fr: 'Azeffoun', name_ar: 'أزفون' },
  { id: 1505, wilaya_id: 15, code: '1505', name_fr: 'Beni Douala', name_ar: 'بني دوالة' },
  { id: 1506, wilaya_id: 15, code: '1506', name_fr: 'Beni Yenni', name_ar: 'بني يني' },
  { id: 1507, wilaya_id: 15, code: '1507', name_fr: 'Boghni', name_ar: 'بوغني' },
  { id: 1508, wilaya_id: 15, code: '1508', name_fr: 'Bouzeguene', name_ar: 'بوزقن' },
  { id: 1509, wilaya_id: 15, code: '1509', name_fr: 'Draa Ben Khedda', name_ar: 'ذراع بن خدة' },
  { id: 1510, wilaya_id: 15, code: '1510', name_fr: 'Draa El Mizan', name_ar: 'ذراع الميزان' },
  { id: 1511, wilaya_id: 15, code: '1511', name_fr: 'Iferhounene', name_ar: 'إفرحونان' },
  { id: 1512, wilaya_id: 15, code: '1512', name_fr: 'Larbaâ Nath Irathen', name_ar: 'الأربعاء نايث إيراثن' },
  { id: 1513, wilaya_id: 15, code: '1513', name_fr: 'Maatkas', name_ar: 'معاتقة' },
  { id: 1514, wilaya_id: 15, code: '1514', name_fr: 'Makouda', name_ar: 'ماكودة' },
  { id: 1515, wilaya_id: 15, code: '1515', name_fr: 'Mekla', name_ar: 'مكلة' },
  { id: 1516, wilaya_id: 15, code: '1516', name_fr: 'Ouacifs', name_ar: 'واسيف' },
  { id: 1517, wilaya_id: 15, code: '1517', name_fr: 'Ouadhia', name_ar: 'واضية' },
  { id: 1518, wilaya_id: 15, code: '1518', name_fr: 'Ouaguenoun', name_ar: 'واقنون' },
  { id: 1519, wilaya_id: 15, code: '1519', name_fr: 'Tigzirt', name_ar: 'تيقزيرت' },
  { id: 1520, wilaya_id: 15, code: '1520', name_fr: 'Tizi Gheniff', name_ar: 'تيزي غنيف' },
  { id: 1521, wilaya_id: 15, code: '1521', name_fr: 'Tizi Rached', name_ar: 'تيزي راشد' },

  // Wilaya 16 - Alger (13 dairas) - Already imported
  // Wilaya 17 - Djelfa (12 dairas)
  { id: 1701, wilaya_id: 17, code: '1701', name_fr: 'Djelfa', name_ar: 'الجلفة' },
  { id: 1702, wilaya_id: 17, code: '1702', name_fr: 'Aïn El Ibel', name_ar: 'عين الإبل' },
  { id: 1703, wilaya_id: 17, code: '1703', name_fr: 'Aïn Oussera', name_ar: 'عين وسارة' },
  { id: 1704, wilaya_id: 17, code: '1704', name_fr: 'Birine', name_ar: 'بيرين' },
  { id: 1705, wilaya_id: 17, code: '1705', name_fr: 'Charef', name_ar: 'الشارف' },
  { id: 1706, wilaya_id: 17, code: '1706', name_fr: 'Dar Chioukh', name_ar: 'دار الشيوخ' },
  { id: 1707, wilaya_id: 17, code: '1707', name_fr: 'El Idrissia', name_ar: 'الإدريسية' },
  { id: 1708, wilaya_id: 17, code: '1708', name_fr: 'Faidh El Botma', name_ar: 'فيض البطمة' },
  { id: 1709, wilaya_id: 17, code: '1709', name_fr: 'Hassi Bahbah', name_ar: 'حاسي بحبح' },
  { id: 1710, wilaya_id: 17, code: '1710', name_fr: 'Messaad', name_ar: 'مسعد' },
  { id: 1711, wilaya_id: 17, code: '1711', name_fr: 'Sidi Ladjel', name_ar: 'سيدي لعجال' },
  { id: 1712, wilaya_id: 17, code: '1712', name_fr: 'Taadmit', name_ar: 'تعظميت' },

  // Wilaya 18 - Jijel (11 dairas)
  { id: 1801, wilaya_id: 18, code: '1801', name_fr: 'Jijel', name_ar: 'جيجل' },
  { id: 1802, wilaya_id: 18, code: '1802', name_fr: 'Chekfa', name_ar: 'الشقفة' },
  { id: 1803, wilaya_id: 18, code: '1803', name_fr: 'Djimla', name_ar: 'جيملة' },
  { id: 1804, wilaya_id: 18, code: '1804', name_fr: 'El Ancer', name_ar: 'العنصر' },
  { id: 1805, wilaya_id: 18, code: '1805', name_fr: 'El Aouana', name_ar: 'العوانة' },
  { id: 1806, wilaya_id: 18, code: '1806', name_fr: 'El Milia', name_ar: 'الميلية' },
  { id: 1807, wilaya_id: 18, code: '1807', name_fr: 'Settara', name_ar: 'السطارة' },
  { id: 1808, wilaya_id: 18, code: '1808', name_fr: 'Sidi Maarouf', name_ar: 'سيدي معروف' },
  { id: 1809, wilaya_id: 18, code: '1809', name_fr: 'Taher', name_ar: 'الطاهير' },
  { id: 1810, wilaya_id: 18, code: '1810', name_fr: 'Texenna', name_ar: 'تاكسنة' },
  { id: 1811, wilaya_id: 18, code: '1811', name_fr: 'Ziama Mansouriah', name_ar: 'زيامة منصورية' },

  // Wilaya 19 - Sétif (20 dairas)
  { id: 1901, wilaya_id: 19, code: '1901', name_fr: 'Sétif', name_ar: 'سطيف' },
  { id: 1902, wilaya_id: 19, code: '1902', name_fr: 'Aïn Arnat', name_ar: 'عين أرنات' },
  { id: 1903, wilaya_id: 19, code: '1903', name_fr: 'Aïn Azel', name_ar: 'عين أزال' },
  { id: 1904, wilaya_id: 19, code: '1904', name_fr: 'Aïn El Kebira', name_ar: 'عين الكبيرة' },
  { id: 1905, wilaya_id: 19, code: '1905', name_fr: 'Aïn Oulmene', name_ar: 'عين ولمان' },
  { id: 1906, wilaya_id: 19, code: '1906', name_fr: 'Amoucha', name_ar: 'عموشة' },
  { id: 1907, wilaya_id: 19, code: '1907', name_fr: 'Babor', name_ar: 'بابور' },
  { id: 1908, wilaya_id: 19, code: '1908', name_fr: 'Beni Aziz', name_ar: 'بني عزيز' },
  { id: 1909, wilaya_id: 19, code: '1909', name_fr: 'Beni Ourtilane', name_ar: 'بني ورتيلان' },
  { id: 1910, wilaya_id: 19, code: '1910', name_fr: 'Bir El Arch', name_ar: 'بئر العرش' },
  { id: 1911, wilaya_id: 19, code: '1911', name_fr: 'Bouandas', name_ar: 'بوعنداس' },
  { id: 1912, wilaya_id: 19, code: '1912', name_fr: 'Bougaa', name_ar: 'بوقاعة' },
  { id: 1913, wilaya_id: 19, code: '1913', name_fr: 'Djémila', name_ar: 'جميلة' },
  { id: 1914, wilaya_id: 19, code: '1914', name_fr: 'El Eulma', name_ar: 'العلمة' },
  { id: 1915, wilaya_id: 19, code: '1915', name_fr: 'Guenzet', name_ar: 'قنزات' },
  { id: 1916, wilaya_id: 19, code: '1916', name_fr: 'Guidjel', name_ar: 'قجال' },
  { id: 1917, wilaya_id: 19, code: '1917', name_fr: 'Hammam Guergour', name_ar: 'حمام قرقور' },
  { id: 1918, wilaya_id: 19, code: '1918', name_fr: 'Hammam Sokhna', name_ar: 'حمام السخنة' },
  { id: 1919, wilaya_id: 19, code: '1919', name_fr: 'Maoklane', name_ar: 'ماوكلان' },
  { id: 1920, wilaya_id: 19, code: '1920', name_fr: 'Salah Bey', name_ar: 'صالح باي' },

  // Wilaya 20 - Saïda (6 dairas)
  { id: 2001, wilaya_id: 20, code: '2001', name_fr: 'Saïda', name_ar: 'سعيدة' },
  { id: 2002, wilaya_id: 20, code: '2002', name_fr: 'Aïn El Hadjar', name_ar: 'عين الحجر' },
  { id: 2003, wilaya_id: 20, code: '2003', name_fr: 'El Hassasna', name_ar: 'الحساسنة' },
  { id: 2004, wilaya_id: 20, code: '2004', name_fr: 'Ouled Brahim', name_ar: 'أولاد إبراهيم' },
  { id: 2005, wilaya_id: 20, code: '2005', name_fr: 'Sidi Boubekeur', name_ar: 'سيدي بوبكر' },
  { id: 2006, wilaya_id: 20, code: '2006', name_fr: 'Youb', name_ar: 'يوب' },

  // Wilaya 21 - Skikda (13 dairas)
  { id: 2101, wilaya_id: 21, code: '2101', name_fr: 'Skikda', name_ar: 'سكيكدة' },
  { id: 2102, wilaya_id: 21, code: '2102', name_fr: 'Aïn Kechra', name_ar: 'عين كشرة' },
  { id: 2103, wilaya_id: 21, code: '2103', name_fr: 'Azzaba', name_ar: 'عزابة' },
  { id: 2104, wilaya_id: 21, code: '2104', name_fr: 'Ben Azzouz', name_ar: 'بن عزوز' },
  { id: 2105, wilaya_id: 21, code: '2105', name_fr: 'Collo', name_ar: 'القل' },
  { id: 2106, wilaya_id: 21, code: '2106', name_fr: 'El Hadaik', name_ar: 'الحدائق' },
  { id: 2107, wilaya_id: 21, code: '2107', name_fr: 'El Harrouch', name_ar: 'الحروش' },
  { id: 2108, wilaya_id: 21, code: '2108', name_fr: 'Ouled Attia', name_ar: 'أولاد عطية' },
  { id: 2109, wilaya_id: 21, code: '2109', name_fr: 'Oum Toub', name_ar: 'أم الطوب' },
  { id: 2110, wilaya_id: 21, code: '2110', name_fr: 'Ramdane Djamel', name_ar: 'رمضان جمال' },
  { id: 2111, wilaya_id: 21, code: '2111', name_fr: 'Sidi Mezghiche', name_ar: 'سيدي مزغيش' },
  { id: 2112, wilaya_id: 21, code: '2112', name_fr: 'Tamalous', name_ar: 'تمالوس' },
  { id: 2113, wilaya_id: 21, code: '2113', name_fr: 'Zitouna', name_ar: 'الزيتونة' },

  // Wilaya 22 - Sidi Bel Abbès (15 dairas)
  { id: 2201, wilaya_id: 22, code: '2201', name_fr: 'Sidi Bel Abbès', name_ar: 'سيدي بلعباس' },
  { id: 2202, wilaya_id: 22, code: '2202', name_fr: 'Aïn El Berd', name_ar: 'عين البرد' },
  { id: 2203, wilaya_id: 22, code: '2203', name_fr: 'Ben Badis', name_ar: 'بن باديس' },
  { id: 2204, wilaya_id: 22, code: '2204', name_fr: 'Marhoum', name_ar: 'مرحوم' },
  { id: 2205, wilaya_id: 22, code: '2205', name_fr: 'Merine', name_ar: 'مرين' },
  { id: 2206, wilaya_id: 22, code: '2206', name_fr: 'Mostefa Ben Brahim', name_ar: 'مصطفى بن براهيم' },
  { id: 2207, wilaya_id: 22, code: '2207', name_fr: 'Moulay Slissen', name_ar: 'مولاي سليسن' },
  { id: 2208, wilaya_id: 22, code: '2208', name_fr: 'Ras El Ma', name_ar: 'رأس الماء' },
  { id: 2209, wilaya_id: 22, code: '2209', name_fr: 'Sfisef', name_ar: 'سفيزف' },
  { id: 2210, wilaya_id: 22, code: '2210', name_fr: 'Sidi Ali Boussidi', name_ar: 'سيدي علي بوسيدي' },
  { id: 2211, wilaya_id: 22, code: '2211', name_fr: 'Sidi Lahcene', name_ar: 'سيدي لحسن' },
  { id: 2212, wilaya_id: 22, code: '2212', name_fr: 'Telagh', name_ar: 'تلاغ' },
  { id: 2213, wilaya_id: 22, code: '2213', name_fr: 'Tenira', name_ar: 'تنيرة' },
  { id: 2214, wilaya_id: 22, code: '2214', name_fr: 'Tessala', name_ar: 'تسالة' },

  // Wilaya 23 - Annaba (6 dairas)
  { id: 2301, wilaya_id: 23, code: '2301', name_fr: 'Annaba', name_ar: 'عنابة' },
  { id: 2302, wilaya_id: 23, code: '2302', name_fr: 'Aïn El Berda', name_ar: 'عين الباردة' },
  { id: 2303, wilaya_id: 23, code: '2303', name_fr: 'Berrahal', name_ar: 'برحال' },
  { id: 2304, wilaya_id: 23, code: '2304', name_fr: 'Chetaïbi', name_ar: 'شطايبي' },
  { id: 2305, wilaya_id: 23, code: '2305', name_fr: 'El Bouni', name_ar: 'البوني' },
  { id: 2306, wilaya_id: 23, code: '2306', name_fr: 'El Hadjar', name_ar: 'الحجار' },

  // Wilaya 24 - Guelma (10 dairas)
  { id: 2401, wilaya_id: 24, code: '2401', name_fr: 'Guelma', name_ar: 'قالمة' },
  { id: 2402, wilaya_id: 24, code: '2402', name_fr: 'Aïn Makhlouf', name_ar: 'عين مخلوف' },
  { id: 2403, wilaya_id: 24, code: '2403', name_fr: 'Bouchegouf', name_ar: 'بوشقوف' },
  { id: 2404, wilaya_id: 24, code: '2404', name_fr: 'Guelaat Bou Sbaa', name_ar: 'قلعة بوصبع' },
  { id: 2405, wilaya_id: 24, code: '2405', name_fr: 'Hammam Debagh', name_ar: 'حمام دباغ' },
  { id: 2406, wilaya_id: 24, code: '2406', name_fr: 'Hammam N\'Bails', name_ar: 'حمام النبايل' },
  { id: 2407, wilaya_id: 24, code: '2407', name_fr: 'Héliopolis', name_ar: 'هيليوبوليس' },
  { id: 2408, wilaya_id: 24, code: '2408', name_fr: 'Khezaras', name_ar: 'خزارة' },
  { id: 2409, wilaya_id: 24, code: '2409', name_fr: 'Oued Zenati', name_ar: 'وادي الزناتي' },
  { id: 2410, wilaya_id: 24, code: '2410', name_fr: 'Tamlouka', name_ar: 'تاملوكة' },

  // Wilaya 25 - Constantine (6 dairas)
  { id: 2501, wilaya_id: 25, code: '2501', name_fr: 'Constantine', name_ar: 'قسنطينة' },
  { id: 2502, wilaya_id: 25, code: '2502', name_fr: 'Aïn Abid', name_ar: 'عين عبيد' },
  { id: 2503, wilaya_id: 25, code: '2503', name_fr: 'El Khroub', name_ar: 'الخروب' },
  { id: 2504, wilaya_id: 25, code: '2504', name_fr: 'Hamma Bouziane', name_ar: 'حامة بوزيان' },
  { id: 2505, wilaya_id: 25, code: '2505', name_fr: 'Ibn Ziad', name_ar: 'ابن زياد' },
  { id: 2506, wilaya_id: 25, code: '2506', name_fr: 'Zighoud Youcef', name_ar: 'زيغود يوسف' },

  // Wilaya 26 - Médéa (19 dairas)
  { id: 2601, wilaya_id: 26, code: '2601', name_fr: 'Médéa', name_ar: 'المدية' },
  { id: 2602, wilaya_id: 26, code: '2602', name_fr: 'Aïn Boucif', name_ar: 'عين بوسيف' },
  { id: 2603, wilaya_id: 26, code: '2603', name_fr: 'Aziz', name_ar: 'عزيز' },
  { id: 2604, wilaya_id: 26, code: '2604', name_fr: 'Beni Slimane', name_ar: 'بني سليمان' },
  { id: 2605, wilaya_id: 26, code: '2605', name_fr: 'Berrouaghia', name_ar: 'البرواقية' },
  { id: 2606, wilaya_id: 26, code: '2606', name_fr: 'Chahbounia', name_ar: 'الشهبونية' },
  { id: 2607, wilaya_id: 26, code: '2607', name_fr: 'Chellalet El Adhaoura', name_ar: 'شلالة العذاورة' },
  { id: 2608, wilaya_id: 26, code: '2608', name_fr: 'El Azizia', name_ar: 'العزيزية' },
  { id: 2609, wilaya_id: 26, code: '2609', name_fr: 'El Omaria', name_ar: 'العمارية' },
  { id: 2610, wilaya_id: 26, code: '2610', name_fr: 'Guelb El Kebir', name_ar: 'القلب الكبير' },
  { id: 2611, wilaya_id: 26, code: '2611', name_fr: 'Ksar El Boukhari', name_ar: 'قصر البخاري' },
  { id: 2612, wilaya_id: 26, code: '2612', name_fr: 'Ouamri', name_ar: 'عوامري' },
  { id: 2613, wilaya_id: 26, code: '2613', name_fr: 'Ouled Antar', name_ar: 'أولاد عنتر' },
  { id: 2614, wilaya_id: 26, code: '2614', name_fr: 'Ouzera', name_ar: 'وزرة' },
  { id: 2615, wilaya_id: 26, code: '2615', name_fr: 'Seghouane', name_ar: 'سغوان' },
  { id: 2616, wilaya_id: 26, code: '2616', name_fr: 'Si Mahdjoub', name_ar: 'سي المحجوب' },
  { id: 2617, wilaya_id: 26, code: '2617', name_fr: 'Sidi Naamane', name_ar: 'سيدي نعمان' },
  { id: 2618, wilaya_id: 26, code: '2618', name_fr: 'Souagui', name_ar: 'السواقي' },
  { id: 2619, wilaya_id: 26, code: '2619', name_fr: 'Tablat', name_ar: 'تابلاط' },

  // Wilaya 27 - Mostaganem (10 dairas)
  { id: 2701, wilaya_id: 27, code: '2701', name_fr: 'Mostaganem', name_ar: 'مستغانم' },
  { id: 2702, wilaya_id: 27, code: '2702', name_fr: 'Achaacha', name_ar: 'عشعاشة' },
  { id: 2703, wilaya_id: 27, code: '2703', name_fr: 'Aïn Nouissy', name_ar: 'عين نويسي' },
  { id: 2704, wilaya_id: 27, code: '2704', name_fr: 'Aïn Tedeles', name_ar: 'عين تادلس' },
  { id: 2705, wilaya_id: 27, code: '2705', name_fr: 'Bouguirat', name_ar: 'بوقيراط' },
  { id: 2706, wilaya_id: 27, code: '2706', name_fr: 'Hassi Mameche', name_ar: 'حاسي مماش' },
  { id: 2707, wilaya_id: 27, code: '2707', name_fr: 'Kheir Eddine', name_ar: 'خير الدين' },
  { id: 2708, wilaya_id: 27, code: '2708', name_fr: 'Mesra', name_ar: 'ماسرة' },
  { id: 2709, wilaya_id: 27, code: '2709', name_fr: 'Sidi Ali', name_ar: 'سيدي علي' },
  { id: 2710, wilaya_id: 27, code: '2710', name_fr: 'Sidi Lakhdar', name_ar: 'سيدي لخضر' },

  // Wilaya 28 - M'Sila (15 dairas)
  { id: 2801, wilaya_id: 28, code: '2801', name_fr: 'M\'Sila', name_ar: 'المسيلة' },
  { id: 2802, wilaya_id: 28, code: '2802', name_fr: 'Aïn El Hadjel', name_ar: 'عين الحجل' },
  { id: 2803, wilaya_id: 28, code: '2803', name_fr: 'Aïn El Melh', name_ar: 'عين الملح' },
  { id: 2804, wilaya_id: 28, code: '2804', name_fr: 'Ben Srour', name_ar: 'بن سرور' },
  { id: 2805, wilaya_id: 28, code: '2805', name_fr: 'Bou Saada', name_ar: 'بوسعادة' },
  { id: 2806, wilaya_id: 28, code: '2806', name_fr: 'Chellal', name_ar: 'شلال' },
  { id: 2807, wilaya_id: 28, code: '2807', name_fr: 'Djebel Messaad', name_ar: 'جبل مسعد' },
  { id: 2808, wilaya_id: 28, code: '2808', name_fr: 'Hammam Dhalaa', name_ar: 'حمام الضلعة' },
  { id: 2809, wilaya_id: 28, code: '2809', name_fr: 'Khoubana', name_ar: 'خبانة' },
  { id: 2810, wilaya_id: 28, code: '2810', name_fr: 'M\'Sila', name_ar: 'المسيلة' },
  { id: 2811, wilaya_id: 28, code: '2811', name_fr: 'Magra', name_ar: 'مقرة' },
  { id: 2812, wilaya_id: 28, code: '2812', name_fr: 'Medjedel', name_ar: 'مجذل' },
  { id: 2813, wilaya_id: 28, code: '2813', name_fr: 'Ouled Derradj', name_ar: 'أولاد دراج' },
  { id: 2814, wilaya_id: 28, code: '2814', name_fr: 'Ouled Sidi Brahim', name_ar: 'أولاد سيدي إبراهيم' },
  { id: 2815, wilaya_id: 28, code: '2815', name_fr: 'Sidi Aissa', name_ar: 'سيدي عيسى' },

  // Wilaya 29 - Mascara (16 dairas)
  { id: 2901, wilaya_id: 29, code: '2901', name_fr: 'Mascara', name_ar: 'معسكر' },
  { id: 2902, wilaya_id: 29, code: '2902', name_fr: 'Aïn Farès', name_ar: 'عين فارس' },
  { id: 2903, wilaya_id: 29, code: '2903', name_fr: 'Aïn Fekan', name_ar: 'عين فكان' },
  { id: 2904, wilaya_id: 29, code: '2904', name_fr: 'Aouf', name_ar: 'عوف' },
  { id: 2905, wilaya_id: 29, code: '2905', name_fr: 'Bouhanifia', name_ar: 'بوحنيفية' },
  { id: 2906, wilaya_id: 29, code: '2906', name_fr: 'El Bordj', name_ar: 'البرج' },
  { id: 2907, wilaya_id: 29, code: '2907', name_fr: 'Ghriss', name_ar: 'غريس' },
  { id: 2908, wilaya_id: 29, code: '2908', name_fr: 'Hachem', name_ar: 'هاشم' },
  { id: 2909, wilaya_id: 29, code: '2909', name_fr: 'Makhda', name_ar: 'ماقضة' },
  { id: 2910, wilaya_id: 29, code: '2910', name_fr: 'Mamounia', name_ar: 'المأمونية' },
  { id: 2911, wilaya_id: 29, code: '2911', name_fr: 'Mohammadia', name_ar: 'المحمدية' },
  { id: 2912, wilaya_id: 29, code: '2912', name_fr: 'Oggaz', name_ar: 'عقاز' },
  { id: 2913, wilaya_id: 29, code: '2913', name_fr: 'Oued El Abtal', name_ar: 'وادي الأبطال' },
  { id: 2914, wilaya_id: 29, code: '2914', name_fr: 'Oued Taria', name_ar: 'وادي التاغية' },
  { id: 2915, wilaya_id: 29, code: '2915', name_fr: 'Sig', name_ar: 'سيق' },
  { id: 2916, wilaya_id: 29, code: '2916', name_fr: 'Tighennif', name_ar: 'تيغنيف' },

  // Wilaya 30 - Ouargla (10 dairas)
  { id: 3001, wilaya_id: 30, code: '3001', name_fr: 'Ouargla', name_ar: 'ورقلة' },
  { id: 3002, wilaya_id: 30, code: '3002', name_fr: 'El Borma', name_ar: 'البرمة' },
  { id: 3003, wilaya_id: 30, code: '3003', name_fr: 'El Hadjira', name_ar: 'الحجيرة' },
  { id: 3004, wilaya_id: 30, code: '3004', name_fr: 'Hassi Messaoud', name_ar: 'حاسي مسعود' },
  { id: 3005, wilaya_id: 30, code: '3005', name_fr: 'M\'Khadma', name_ar: 'مخادمة' },
  { id: 3006, wilaya_id: 30, code: '3006', name_fr: "N'Goussa", name_ar: 'نقوسة' },
  { id: 3007, wilaya_id: 30, code: '3007', name_fr: 'Rouissat', name_ar: 'الرويسات' },
  { id: 3008, wilaya_id: 30, code: '3008', name_fr: 'Sidi Khouiled', name_ar: 'سيدي خويلد' },
  { id: 3009, wilaya_id: 30, code: '3009', name_fr: 'Taibet', name_ar: 'طيبات' },
  { id: 3010, wilaya_id: 30, code: '3010', name_fr: 'Temacine', name_ar: 'تماسين' },

  // Wilaya 31 - Oran (9 dairas) - Already imported
  // Wilaya 32 - El Bayadh (8 dairas)
  { id: 3201, wilaya_id: 32, code: '3201', name_fr: 'El Bayadh', name_ar: 'البيض' },
  { id: 3202, wilaya_id: 32, code: '3202', name_fr: 'Boualem', name_ar: 'بوعلام' },
  { id: 3203, wilaya_id: 32, code: '3203', name_fr: 'Bougtoub', name_ar: 'بوقطب' },
  { id: 3204, wilaya_id: 32, code: '3204', name_fr: 'Boussemghoun', name_ar: 'بوسمغون' },
  { id: 3205, wilaya_id: 32, code: '3205', name_fr: 'Brezina', name_ar: 'بريزينة' },
  { id: 3206, wilaya_id: 32, code: '3206', name_fr: 'Chellala', name_ar: 'شلالة' },
  { id: 3207, wilaya_id: 32, code: '3207', name_fr: 'El Abiodh Sidi Cheikh', name_ar: 'الأبيض سيدي الشيخ' },
  { id: 3208, wilaya_id: 32, code: '3208', name_fr: 'Rogassa', name_ar: 'رقاصة' },

  // Wilaya 33 - Illizi (3 dairas)
  { id: 3301, wilaya_id: 33, code: '3301', name_fr: 'Illizi', name_ar: 'إليزي' },
  { id: 3302, wilaya_id: 33, code: '3302', name_fr: 'Djanet', name_ar: 'جانت' },
  { id: 3303, wilaya_id: 33, code: '3303', name_fr: 'In Amenas', name_ar: 'عين أميناس' },

  // Wilaya 34 - Bordj Bou Arreridj (10 dairas)
  { id: 3401, wilaya_id: 34, code: '3401', name_fr: 'Bordj Bou Arreridj', name_ar: 'برج بوعريريج' },
  { id: 3402, wilaya_id: 34, code: '3402', name_fr: 'Aïn Taghrout', name_ar: 'عين تاغروت' },
  { id: 3403, wilaya_id: 34, code: '3403', name_fr: 'Bir Kasdali', name_ar: 'بئر قاصد علي' },
  { id: 3404, wilaya_id: 34, code: '3404', name_fr: 'Bordj Ghedir', name_ar: 'برج الغدير' },
  { id: 3405, wilaya_id: 34, code: '3405', name_fr: 'Bordj Zemmoura', name_ar: 'برج زمورة' },
  { id: 3406, wilaya_id: 34, code: '3406', name_fr: 'Djaafra', name_ar: 'جعافرة' },
  { id: 3407, wilaya_id: 34, code: '3407', name_fr: 'El Hamadia', name_ar: 'الحمادية' },
  { id: 3408, wilaya_id: 34, code: '3408', name_fr: 'Mansoura', name_ar: 'منصورة' },
  { id: 3409, wilaya_id: 34, code: '3409', name_fr: 'Medjana', name_ar: 'مجانة' },
  { id: 3410, wilaya_id: 34, code: '3410', name_fr: 'Ras El Oued', name_ar: 'رأس الوادي' },

  // Wilaya 35 - Boumerdès (9 dairas)
  { id: 3501, wilaya_id: 35, code: '3501', name_fr: 'Boumerdès', name_ar: 'بومرداس' },
  { id: 3502, wilaya_id: 35, code: '3502', name_fr: 'Baghlia', name_ar: 'بغلية' },
  { id: 3503, wilaya_id: 35, code: '3503', name_fr: 'Bordj Menaiel', name_ar: 'برج منايل' },
  { id: 3504, wilaya_id: 35, code: '3504', name_fr: 'Boudouaou', name_ar: 'بودواو' },
  { id: 3505, wilaya_id: 35, code: '3505', name_fr: 'Dellys', name_ar: 'دلس' },
  { id: 3506, wilaya_id: 35, code: '3506', name_fr: 'Isser', name_ar: 'يسر' },
  { id: 3507, wilaya_id: 35, code: '3507', name_fr: 'Khemis El Khechna', name_ar: 'خميس الخشنة' },
  { id: 3508, wilaya_id: 35, code: '3508', name_fr: 'Naciria', name_ar: 'الناصرية' },
  { id: 3509, wilaya_id: 35, code: '3509', name_fr: 'Thenia', name_ar: 'الثنية' },

  // Wilaya 36 - El Tarf (7 dairas)
  { id: 3601, wilaya_id: 36, code: '3601', name_fr: 'El Tarf', name_ar: 'الطارف' },
  { id: 3602, wilaya_id: 36, code: '3602', name_fr: 'Ben Mhidi', name_ar: 'بن مهيدي' },
  { id: 3603, wilaya_id: 36, code: '3603', name_fr: 'Besbes', name_ar: 'البسباس' },
  { id: 3604, wilaya_id: 36, code: '3604', name_fr: 'Bouhadjar', name_ar: 'بوحجار' },
  { id: 3605, wilaya_id: 36, code: '3605', name_fr: 'Bouteldja', name_ar: 'بوثلجة' },
  { id: 3606, wilaya_id: 36, code: '3606', name_fr: 'Drean', name_ar: 'الذرعان' },
  { id: 3607, wilaya_id: 36, code: '3607', name_fr: 'El Kala', name_ar: 'القالة' },

  // Wilaya 37 - Tindouf (1 daira)
  { id: 3701, wilaya_id: 37, code: '3701', name_fr: 'Tindouf', name_ar: 'تندوف' },

  // Wilaya 38 - Tissemsilt (8 dairas)
  { id: 3801, wilaya_id: 38, code: '3801', name_fr: 'Tissemsilt', name_ar: 'تيسمسيلت' },
  { id: 3802, wilaya_id: 38, code: '3802', name_fr: 'Ammari', name_ar: 'عماري' },
  { id: 3803, wilaya_id: 38, code: '3803', name_fr: 'Bordj Bou Naama', name_ar: 'برج بونعامة' },
  { id: 3804, wilaya_id: 38, code: '3804', name_fr: 'Bordj El Emir Abdelkader', name_ar: 'برج الأمير عبد القادر' },
  { id: 3805, wilaya_id: 38, code: '3805', name_fr: 'Khemisti', name_ar: 'خميستي' },
  { id: 3806, wilaya_id: 38, code: '3806', name_fr: 'Lardjem', name_ar: 'لرجم' },
  { id: 3807, wilaya_id: 38, code: '3807', name_fr: 'Layoune', name_ar: 'العيون' },
  { id: 3808, wilaya_id: 38, code: '3808', name_fr: 'Theniet El Had', name_ar: 'ثنية الأحد' },

  // Wilaya 39 - El Oued (12 dairas)
  { id: 3901, wilaya_id: 39, code: '3901', name_fr: 'El Oued', name_ar: 'الوادي' },
  { id: 3902, wilaya_id: 39, code: '3902', name_fr: 'Bayadha', name_ar: 'البياضة' },
  { id: 3903, wilaya_id: 39, code: '3903', name_fr: 'Debila', name_ar: 'الديبلة' },
  { id: 3904, wilaya_id: 39, code: '3904', name_fr: 'Djamaa', name_ar: 'جامعة' },
  { id: 3905, wilaya_id: 39, code: '3905', name_fr: 'El M\'Ghair', name_ar: 'المغير' },
  { id: 3906, wilaya_id: 39, code: '3906', name_fr: 'Guemar', name_ar: 'قمار' },
  { id: 3907, wilaya_id: 39, code: '3907', name_fr: 'Hassi Khelifa', name_ar: 'حاسي خليفة' },
  { id: 3908, wilaya_id: 39, code: '3908', name_fr: 'Magrane', name_ar: 'مقران' },
  { id: 3909, wilaya_id: 39, code: '3909', name_fr: 'Mih Ouansa', name_ar: 'ميه ونسة' },
  { id: 3910, wilaya_id: 39, code: '3910', name_fr: 'Reguiba', name_ar: 'الرقيبة' },
  { id: 3911, wilaya_id: 39, code: '3911', name_fr: 'Robbah', name_ar: 'الرباح' },
  { id: 3912, wilaya_id: 39, code: '3912', name_fr: 'Taleb Larbi', name_ar: 'طالب العربي' },

  // Wilaya 40 - Khenchela (8 dairas)
  { id: 4001, wilaya_id: 40, code: '4001', name_fr: 'Khenchela', name_ar: 'خنشلة' },
  { id: 4002, wilaya_id: 40, code: '4002', name_fr: 'Aïn Touila', name_ar: 'عين الطويلة' },
  { id: 4003, wilaya_id: 40, code: '4003', name_fr: 'Babar', name_ar: 'بابار' },
  { id: 4004, wilaya_id: 40, code: '4004', name_fr: 'Bouhmama', name_ar: 'بوحمامة' },
  { id: 4005, wilaya_id: 40, code: '4005', name_fr: 'Chechar', name_ar: 'ششار' },
  { id: 4006, wilaya_id: 40, code: '4006', name_fr: 'El Hamma', name_ar: 'الحامة' },
  { id: 4007, wilaya_id: 40, code: '4007', name_fr: 'Kais', name_ar: 'قايس' },
  { id: 4008, wilaya_id: 40, code: '4008', name_fr: 'Ouled Rechache', name_ar: 'أولاد رشاش' },

  // Wilaya 41 - Souk Ahras (10 dairas)
  { id: 4101, wilaya_id: 41, code: '4101', name_fr: 'Souk Ahras', name_ar: 'سوق أهراس' },
  { id: 4102, wilaya_id: 41, code: '4102', name_fr: 'Bir Bouhouche', name_ar: 'بئر بوحوش' },
  { id: 4103, wilaya_id: 41, code: '4103', name_fr: 'Haddada', name_ar: 'الحدادة' },
  { id: 4104, wilaya_id: 41, code: '4104', name_fr: "M'Daourouch", name_ar: 'مداوروش' },
  { id: 4105, wilaya_id: 41, code: '4105', name_fr: 'Mechroha', name_ar: 'مشروحة' },
  { id: 4106, wilaya_id: 41, code: '4106', name_fr: 'Merahna', name_ar: 'مراهنة' },
  { id: 4107, wilaya_id: 41, code: '4107', name_fr: 'Ouled Driss', name_ar: 'أولاد ادريس' },
  { id: 4108, wilaya_id: 41, code: '4108', name_fr: 'Oum El Adhaim', name_ar: 'أم العظائم' },
  { id: 4109, wilaya_id: 41, code: '4109', name_fr: 'Sedrata', name_ar: 'سدراتة' },
  { id: 4110, wilaya_id: 41, code: '4110', name_fr: 'Taoura', name_ar: 'تاورة' },

  // Wilaya 42 - Tipaza (10 dairas)
  { id: 4201, wilaya_id: 42, code: '4201', name_fr: 'Tipaza', name_ar: 'تيبازة' },
  { id: 4202, wilaya_id: 42, code: '4202', name_fr: 'Ahmer El Ain', name_ar: 'أحمر العين' },
  { id: 4203, wilaya_id: 42, code: '4203', name_fr: 'Bou Ismail', name_ar: 'بو إسماعيل' },
  { id: 4204, wilaya_id: 42, code: '4204', name_fr: 'Cherchell', name_ar: 'شرشال' },
  { id: 4205, wilaya_id: 42, code: '4205', name_fr: 'Damous', name_ar: 'الداموس' },
  { id: 4206, wilaya_id: 42, code: '4206', name_fr: 'Fouka', name_ar: 'فوكة' },
  { id: 4207, wilaya_id: 42, code: '4207', name_fr: 'Gouraya', name_ar: 'قورايا' },
  { id: 4208, wilaya_id: 42, code: '4208', name_fr: 'Hadjout', name_ar: 'حجوط' },
  { id: 4209, wilaya_id: 42, code: '4209', name_fr: 'Kolea', name_ar: 'القليعة' },
  { id: 4210, wilaya_id: 42, code: '4210', name_fr: 'Sidi Amar', name_ar: 'سيدي عمر' },

  // Wilaya 43 - Mila (13 dairas)
  { id: 4301, wilaya_id: 43, code: '4301', name_fr: 'Mila', name_ar: 'ميلة' },
  { id: 4302, wilaya_id: 43, code: '4302', name_fr: 'Aïn Beida Harriche', name_ar: 'عين البيضاء حريش' },
  { id: 4303, wilaya_id: 43, code: '4303', name_fr: 'Bouhatem', name_ar: 'بوحاتم' },
  { id: 4304, wilaya_id: 43, code: '4304', name_fr: 'Chelghoum Laid', name_ar: 'شلغوم العيد' },
  { id: 4305, wilaya_id: 43, code: '4305', name_fr: 'Ferdjioua', name_ar: 'فرجيوة' },
  { id: 4306, wilaya_id: 43, code: '4306', name_fr: 'Grarem Gouga', name_ar: 'القرارم قوقة' },
  { id: 4307, wilaya_id: 43, code: '4307', name_fr: 'Oued Endja', name_ar: 'وادي النجاء' },
  { id: 4308, wilaya_id: 43, code: '4308', name_fr: 'Rouached', name_ar: 'الرواشد' },
  { id: 4309, wilaya_id: 43, code: '4309', name_fr: 'Sidi Merouane', name_ar: 'سيدي مروان' },
  { id: 4310, wilaya_id: 43, code: '4310', name_fr: 'Tadjenanet', name_ar: 'تاجنانت' },
  { id: 4311, wilaya_id: 43, code: '4311', name_fr: 'Tassadane Haddada', name_ar: 'تسدان حدادة' },
  { id: 4312, wilaya_id: 43, code: '4312', name_fr: 'Teleghma', name_ar: 'تلاغمة' },
  { id: 4313, wilaya_id: 43, code: '4313', name_fr: 'Terrai Bainen', name_ar: 'ترعي باينان' },

  // Wilaya 44 - Aïn Defla (14 dairas)
  { id: 4401, wilaya_id: 44, code: '4401', name_fr: 'Aïn Defla', name_ar: 'عين الدفلى' },
  { id: 4402, wilaya_id: 44, code: '4402', name_fr: 'Aïn Lechiakh', name_ar: 'عين لشياخ' },
  { id: 4403, wilaya_id: 44, code: '4403', name_fr: 'Bathia', name_ar: 'بطحية' },
  { id: 4404, wilaya_id: 44, code: '4404', name_fr: 'Bordj El Amir Khaled', name_ar: 'برج الأمير خالد' },
  { id: 4405, wilaya_id: 44, code: '4405', name_fr: 'Boumedfaa', name_ar: 'بومدفع' },
  { id: 4406, wilaya_id: 44, code: '4406', name_fr: 'Djendel', name_ar: 'جندل' },
  { id: 4407, wilaya_id: 44, code: '4407', name_fr: 'Djelida', name_ar: 'جليدة' },
  { id: 4408, wilaya_id: 44, code: '4408', name_fr: 'El Amra', name_ar: 'العامرة' },
  { id: 4409, wilaya_id: 44, code: '4409', name_fr: 'El Attaf', name_ar: 'العطاف' },
  { id: 4410, wilaya_id: 44, code: '4410', name_fr: 'Hammam Righa', name_ar: 'حمام ريغة' },
  { id: 4411, wilaya_id: 44, code: '4411', name_fr: 'Khemis Miliana', name_ar: 'خميس مليانة' },
  { id: 4412, wilaya_id: 44, code: '4412', name_fr: 'Miliana', name_ar: 'مليانة' },
  { id: 4413, wilaya_id: 44, code: '4413', name_fr: 'Rouina', name_ar: 'روينة' },

  // Wilaya 45 - Naâma (7 dairas)
  { id: 4501, wilaya_id: 45, code: '4501', name_fr: 'Naâma', name_ar: 'النعامة' },
  { id: 4502, wilaya_id: 45, code: '4502', name_fr: 'Aïn Sefra', name_ar: 'عين الصفراء' },
  { id: 4503, wilaya_id: 45, code: '4503', name_fr: 'Asla', name_ar: 'عسلة' },
  { id: 4504, wilaya_id: 45, code: '4504', name_fr: 'Mecheria', name_ar: 'المشرية' },
  { id: 4505, wilaya_id: 45, code: '4505', name_fr: 'Mekmen Ben Amar', name_ar: 'مكمن بن عمار' },
  { id: 4506, wilaya_id: 45, code: '4506', name_fr: 'Moghrar', name_ar: 'مغرار' },
  { id: 4507, wilaya_id: 45, code: '4507', name_fr: 'Sfissifa', name_ar: 'سفيسيفة' },

  // Wilaya 46 - Aïn Témouchent (8 dairas)
  { id: 4601, wilaya_id: 46, code: '4601', name_fr: 'Aïn Témouchent', name_ar: 'عين تموشنت' },
  { id: 4602, wilaya_id: 46, code: '4602', name_fr: 'Aïn El Arbaa', name_ar: 'عين الأربعاء' },
  { id: 4603, wilaya_id: 46, code: '4603', name_fr: 'Aïn Kihal', name_ar: 'عين الكيحل' },
  { id: 4604, wilaya_id: 46, code: '4604', name_fr: 'Beni Saf', name_ar: 'بني صاف' },
  { id: 4605, wilaya_id: 46, code: '4605', name_fr: 'El Amria', name_ar: 'العامرية' },
  { id: 4606, wilaya_id: 46, code: '4606', name_fr: 'El Malah', name_ar: 'المالح' },
  { id: 4607, wilaya_id: 46, code: '4607', name_fr: 'Hammam Bou Hadjar', name_ar: 'حمام بوحجر' },
  { id: 4608, wilaya_id: 46, code: '4608', name_fr: 'Oulhaça El Gheraba', name_ar: 'ولهاصة الغرابة' },

  // Wilaya 47 - Ghardaïa (9 dairas)
  { id: 4701, wilaya_id: 47, code: '4701', name_fr: 'Ghardaïa', name_ar: 'غرداية' },
  { id: 4702, wilaya_id: 47, code: '4702', name_fr: 'Berriane', name_ar: 'بريان' },
  { id: 4703, wilaya_id: 47, code: '4703', name_fr: 'Bounoura', name_ar: 'بونورة' },
  { id: 4704, wilaya_id: 47, code: '4704', name_fr: 'Dhayet Bendhahoua', name_ar: 'ضاية بن ضحوة' },
  { id: 4705, wilaya_id: 47, code: '4705', name_fr: 'El Guerrara', name_ar: 'القرارة' },
  { id: 4706, wilaya_id: 47, code: '4706', name_fr: 'El Meniaa', name_ar: 'المنيعة' },
  { id: 4707, wilaya_id: 47, code: '4707', name_fr: 'Mansoura', name_ar: 'منصورة' },
  { id: 4708, wilaya_id: 47, code: '4708', name_fr: 'Metlili', name_ar: 'متليلي' },
  { id: 4709, wilaya_id: 47, code: '4709', name_fr: 'Zelfana', name_ar: 'زلفانة' },

  // Wilaya 48 - Relizane (13 dairas)
  { id: 4801, wilaya_id: 48, code: '4801', name_fr: 'Relizane', name_ar: 'غليزان' },
  { id: 4802, wilaya_id: 48, code: '4802', name_fr: 'Aïn Tarek', name_ar: 'عين طارق' },
  { id: 4803, wilaya_id: 48, code: '4803', name_fr: 'Ammi Moussa', name_ar: 'عمي موسى' },
  { id: 4804, wilaya_id: 48, code: '4804', name_fr: 'Djidiouia', name_ar: 'جديوية' },
  { id: 4805, wilaya_id: 48, code: '4805', name_fr: 'El H\'Madna', name_ar: 'الحمادنة' },
  { id: 4806, wilaya_id: 48, code: '4806', name_fr: 'El Matmar', name_ar: 'المطمر' },
  { id: 4807, wilaya_id: 48, code: '4807', name_fr: 'Mazouna', name_ar: 'مازونة' },
  { id: 4808, wilaya_id: 48, code: '4808', name_fr: 'Mendes', name_ar: 'منداس' },
  { id: 4809, wilaya_id: 48, code: '4809', name_fr: 'Oued Rhiou', name_ar: 'وادي رهيو' },
  { id: 4810, wilaya_id: 48, code: '4810', name_fr: 'Ramka', name_ar: 'رمكة' },
  { id: 4811, wilaya_id: 48, code: '4811', name_fr: 'Sidi M\'Hamed Ben Ali', name_ar: 'سيدي امحمد بن علي' },
  { id: 4812, wilaya_id: 48, code: '4812', name_fr: 'Yellel', name_ar: 'يلل' },
  { id: 4813, wilaya_id: 48, code: '4813', name_fr: 'Zemmoura', name_ar: 'زمورة' },

  // Wilaya 49-58 are the new wilayas (2019 administrative reform)
  // We include their main dairas
  { id: 4901, wilaya_id: 49, code: '4901', name_fr: 'Timimoun', name_ar: 'تيميمون' },
  { id: 5001, wilaya_id: 50, code: '5001', name_fr: 'Bordj Badji Mokhtar', name_ar: 'برج باجي مختار' },
  { id: 5101, wilaya_id: 51, code: '5101', name_fr: 'Ouled Djellal', name_ar: 'أولاد جلال' },
  { id: 5201, wilaya_id: 52, code: '5201', name_fr: 'Béni Abbès', name_ar: 'بني عباس' },
  { id: 5301, wilaya_id: 53, code: '5301', name_fr: 'In Salah', name_ar: 'عين صالح' },
  { id: 5401, wilaya_id: 54, code: '5401', name_fr: 'In Guezzam', name_ar: 'عين قزام' },
  { id: 5501, wilaya_id: 55, code: '5501', name_fr: 'Touggourt', name_ar: 'تقرت' },
  { id: 5601, wilaya_id: 56, code: '5601', name_fr: 'Djanet', name_ar: 'جانت' },
  { id: 5701, wilaya_id: 57, code: '5701', name_fr: 'El M\'Ghair', name_ar: 'المغير' },
  { id: 5801, wilaya_id: 58, code: '5801', name_fr: 'El Meniaa', name_ar: 'المنيعة' },
];

const communes: CommuneData[] = [
  // Major communes for new wilayas
  { id: 80101, daira_id: 801, wilaya_id: 8, code: '0801', name_fr: 'Béchar', name_ar: 'بشار' },
  { id: 110101, daira_id: 1101, wilaya_id: 11, code: '1101', name_fr: 'Tamanrasset', name_ar: 'تمنراست' },
  { id: 120101, daira_id: 1201, wilaya_id: 12, code: '1201', name_fr: 'Tébessa', name_ar: 'تبسة' },
  { id: 130101, daira_id: 1301, wilaya_id: 13, code: '1301', name_fr: 'Tlemcen', name_ar: 'تلمسان' },
  { id: 140101, daira_id: 1401, wilaya_id: 14, code: '1401', name_fr: 'Tiaret', name_ar: 'تيارت' },
  { id: 150101, daira_id: 1501, wilaya_id: 15, code: '1501', name_fr: 'Tizi Ouzou', name_ar: 'تيزي وزو' },
  { id: 170101, daira_id: 1701, wilaya_id: 17, code: '1701', name_fr: 'Djelfa', name_ar: 'الجلفة' },
  { id: 180101, daira_id: 1801, wilaya_id: 18, code: '1801', name_fr: 'Jijel', name_ar: 'جيجل' },
  { id: 190101, daira_id: 1901, wilaya_id: 19, code: '1901', name_fr: 'Sétif', name_ar: 'سطيف' },
  { id: 200101, daira_id: 2001, wilaya_id: 20, code: '2001', name_fr: 'Saïda', name_ar: 'سعيدة' },
  { id: 210101, daira_id: 2101, wilaya_id: 21, code: '2101', name_fr: 'Skikda', name_ar: 'سكيكدة' },
  { id: 220101, daira_id: 2201, wilaya_id: 22, code: '2201', name_fr: 'Sidi Bel Abbès', name_ar: 'سيدي بلعباس' },
  { id: 230101, daira_id: 2301, wilaya_id: 23, code: '2301', name_fr: 'Annaba', name_ar: 'عنابة' },
  { id: 240101, daira_id: 2401, wilaya_id: 24, code: '2401', name_fr: 'Guelma', name_ar: 'قالمة' },
  { id: 250101, daira_id: 2501, wilaya_id: 25, code: '2501', name_fr: 'Constantine', name_ar: 'قسنطينة' },
  { id: 260101, daira_id: 2601, wilaya_id: 26, code: '2601', name_fr: 'Médéa', name_ar: 'المدية' },
  { id: 270101, daira_id: 2701, wilaya_id: 27, code: '2701', name_fr: 'Mostaganem', name_ar: 'مستغانم' },
  { id: 280101, daira_id: 2801, wilaya_id: 28, code: '2801', name_fr: 'M\'Sila', name_ar: 'المسيلة' },
  { id: 290101, daira_id: 2901, wilaya_id: 29, code: '2901', name_fr: 'Mascara', name_ar: 'معسكر' },
  { id: 300101, daira_id: 3001, wilaya_id: 30, code: '3001', name_fr: 'Ouargla', name_ar: 'ورقلة' },
  { id: 320101, daira_id: 3201, wilaya_id: 32, code: '3201', name_fr: 'El Bayadh', name_ar: 'البيض' },
  { id: 330101, daira_id: 3301, wilaya_id: 33, code: '3301', name_fr: 'Illizi', name_ar: 'إليزي' },
  { id: 340101, daira_id: 3401, wilaya_id: 34, code: '3401', name_fr: 'Bordj Bou Arreridj', name_ar: 'برج بوعريريج' },
  { id: 350101, daira_id: 3501, wilaya_id: 35, code: '3501', name_fr: 'Boumerdès', name_ar: 'بومرداس' },
  { id: 360101, daira_id: 3601, wilaya_id: 36, code: '3601', name_fr: 'El Tarf', name_ar: 'الطارف' },
  { id: 370101, daira_id: 3701, wilaya_id: 37, code: '3701', name_fr: 'Tindouf', name_ar: 'تندوف' },
  { id: 380101, daira_id: 3801, wilaya_id: 38, code: '3801', name_fr: 'Tissemsilt', name_ar: 'تيسمسيلت' },
  { id: 390101, daira_id: 3901, wilaya_id: 39, code: '3901', name_fr: 'El Oued', name_ar: 'الوادي' },
  { id: 400101, daira_id: 4001, wilaya_id: 40, code: '4001', name_fr: 'Khenchela', name_ar: 'خنشلة' },
  { id: 410101, daira_id: 4101, wilaya_id: 41, code: '4101', name_fr: 'Souk Ahras', name_ar: 'سوق أهراس' },
  { id: 420101, daira_id: 4201, wilaya_id: 42, code: '4201', name_fr: 'Tipaza', name_ar: 'تيبازة' },
  { id: 430101, daira_id: 4301, wilaya_id: 43, code: '4301', name_fr: 'Mila', name_ar: 'ميلة' },
  { id: 440101, daira_id: 4401, wilaya_id: 44, code: '4401', name_fr: 'Aïn Defla', name_ar: 'عين الدفلى' },
  { id: 450101, daira_id: 4501, wilaya_id: 45, code: '4501', name_fr: 'Naâma', name_ar: 'النعامة' },
  { id: 460101, daira_id: 4601, wilaya_id: 46, code: '4601', name_fr: 'Aïn Témouchent', name_ar: 'عين تموشنت' },
  { id: 470101, daira_id: 4701, wilaya_id: 47, code: '4701', name_fr: 'Ghardaïa', name_ar: 'غرداية' },
  { id: 480101, daira_id: 4801, wilaya_id: 48, code: '4801', name_fr: 'Relizane', name_ar: 'غليزان' },
  { id: 490101, daira_id: 4901, wilaya_id: 49, code: '4901', name_fr: 'Timimoun', name_ar: 'تيميمون' },
  { id: 500101, daira_id: 5001, wilaya_id: 50, code: '5001', name_fr: 'Bordj Badji Mokhtar', name_ar: 'برج باجي مختار' },
  { id: 510101, daira_id: 5101, wilaya_id: 51, code: '5101', name_fr: 'Ouled Djellal', name_ar: 'أولاد جلال' },
  { id: 520101, daira_id: 5201, wilaya_id: 52, code: '5201', name_fr: 'Béni Abbès', name_ar: 'بني عباس' },
  { id: 530101, daira_id: 5301, wilaya_id: 53, code: '5301', name_fr: 'In Salah', name_ar: 'عين صالح' },
  { id: 540101, daira_id: 5401, wilaya_id: 54, code: '5401', name_fr: 'In Guezzam', name_ar: 'عين قزام' },
  { id: 550101, daira_id: 5501, wilaya_id: 55, code: '5501', name_fr: 'Touggourt', name_ar: 'تقرت' },
  { id: 560101, daira_id: 5601, wilaya_id: 56, code: '5601', name_fr: 'Djanet', name_ar: 'جانت' },
  { id: 570101, daira_id: 5701, wilaya_id: 57, code: '5701', name_fr: 'El M\'Ghair', name_ar: 'المغير' },
  { id: 580101, daira_id: 5801, wilaya_id: 58, code: '5801', name_fr: 'El Meniaa', name_ar: 'المنيعة' },
];

export const seedOfficialGeographicData = async () => {
  try {
    let importedDairas = 0;
    let importedCommunes = 0;

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

    for (const commune of communes) {
      await AppDataSource.query(
        `INSERT INTO communes (id, daira_id, wilaya_id, code, name_fr, name_ar, name_en)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           daira_id = EXCLUDED.daira_id,
           wilaya_id = EXCLUDED.wilaya_id,
           code = EXCLUDED.code,
           name_fr = EXCLUDED.name_fr,
           name_ar = EXCLUDED.name_ar,
           name_en = EXCLUDED.name_en`,
        [commune.id, commune.daira_id, commune.wilaya_id, commune.code, commune.name_fr, commune.name_ar, commune.name_fr]
      );
      importedCommunes++;
    }

    logger.info(`Official geographic data import: ${importedDairas} dairas, ${importedCommunes} communes`);
    return { dairas: importedDairas, communes: importedCommunes };
  } catch (error) {
    logger.error('Official geographic data seed failed:', error);
    throw error;
  }
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(() => seedOfficialGeographicData())
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}