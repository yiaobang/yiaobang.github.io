import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import { applyDocumentMeta, detectLanguage, DEFAULT_LANGUAGE, resolveLanguage } from './languages';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  ja: { translation: ja }
};

const syncDocumentMeta = (language: string | undefined) => {
  const lang = resolveLanguage(language);
  const t = i18n.getFixedT(lang);

  applyDocumentMeta(lang, {
    title: t('meta.title'),
    description: t('meta.description'),
  });
};

i18n
  .use(initReactI18next)
  .init(
    {
      resources,
      lng: detectLanguage(),
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'translation',
    },
    (error) => {
      if (error) {
        console.error('i18next 初始化失败：', error);
        return;
      }
      syncDocumentMeta(i18n.language);
    }
  );

i18n.on('languageChanged', syncDocumentMeta);

export default i18n;
