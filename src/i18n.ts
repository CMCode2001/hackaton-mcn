import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslations from './locales/locales/fr.json';
import enTranslations from './locales/locales/en.json';
import woTranslations from './locales/locales/wo.json';

const savedLanguage = localStorage.getItem('language') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslations },
      en: { translation: enTranslations },
      wo: { translation: woTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
