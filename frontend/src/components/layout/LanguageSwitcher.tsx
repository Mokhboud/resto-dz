import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    // Reload to apply RTL/LTR
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-xs rounded ${i18n.language === 'fr' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-xs rounded ${i18n.language === 'ar' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        عربي
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded ${i18n.language === 'en' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        EN
      </button>
    </div>
  );
}