import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入你的所有语言文件
import translationZH from './zh.json';
import translationEN from './en.json';
import translationJA from './ja.json';

const resources = {
  zh: {
    translation: translationZH,
  },
  en: {
    translation: translationEN,
  },
  ja: {
    translation: translationJA,
  },
} as const; // 使用 as const 来帮助 TypeScript 推断类型

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    // 将默认命名空间设置为 'translation'
    defaultNS: 'translation',
  });

export default i18n;