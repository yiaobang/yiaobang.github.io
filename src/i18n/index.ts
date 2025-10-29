import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

const resources = {
  zh: { translation: translations.zh },
  en: { translation: translations.en },
  ja: { translation: translations.ja }
};

const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('en')) return 'en';
  
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'translation',
  });

export default i18n;