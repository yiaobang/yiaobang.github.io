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

// 检测浏览器语言
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  const supportedLanguages = ['zh', 'en', 'ja'];
  
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('en')) return 'en';
  
  return 'en'; // 默认英文
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
    // 将默认命名空间设置为 'translation'
    defaultNS: 'translation',
  });

export default i18n;