import 'react-i18next';
// 导入所有语言的翻译文件作为类型参考
import type zh from './zh.json';
import type en from './en.json';
import type ja from './ja.json';

// 创建一个类型来合并所有翻译文件
type TranslationResources = typeof zh & typeof en & typeof ja;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResources;
    };
  }
}