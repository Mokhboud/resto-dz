import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Get saved language from localStorage or default to French
const savedLanguage = localStorage.getItem('language') || 'fr';

i18n.use(initReactI18next).init({
  resources: translations,
  lng: savedLanguage,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;