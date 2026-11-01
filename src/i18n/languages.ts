/**
 * 语言相关的常量、持久化与文档元信息同步。
 *
 * 这里刻意不引用 i18n 实例，避免与 index.ts 形成循环依赖：
 * 调用方负责给出当前语言与已翻译好的标题/描述。
 */

export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const STORAGE_KEY = 'yiaobang-language';

const HTML_LANG: Record<SupportedLanguage, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
};

const OG_LOCALE: Record<SupportedLanguage, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
};

export const isSupportedLanguage = (
  value: string | null | undefined
): value is SupportedLanguage =>
  !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

/** i18n 的 language 可能是 'zh-CN' 之类，收敛到受支持的两位码 */
export const resolveLanguage = (language: string | undefined): SupportedLanguage => {
  if (!language) return DEFAULT_LANGUAGE;
  const base = language.toLowerCase().split('-')[0];
  return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE;
};

export const readStoredLanguage = (): SupportedLanguage | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const storeLanguage = (language: string): void => {
  try {
    if (isSupportedLanguage(language)) {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  } catch {
    /* 隐私模式下写入会失败，忽略即可：语言依然对当前会话生效 */
  }
};

const detectBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language || navigator.languages?.[0] || '';

  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  return DEFAULT_LANGUAGE;
};

export const detectLanguage = (): SupportedLanguage =>
  readStoredLanguage() ?? detectBrowserLanguage();

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

interface DocumentMeta {
  title: string;
  description: string;
}

/**
 * 语言切换后同步 <html lang>、标题与分享卡片文案。
 * 这些值在 index.html 里只有英文静态版本，其余语言靠这里覆盖。
 */
export const applyDocumentMeta = (language: string, meta: DocumentMeta): void => {
  const lang = resolveLanguage(language);

  document.documentElement.lang = HTML_LANG[lang];
  document.title = meta.title;

  upsertMeta('name', 'description', meta.description);
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:locale', OG_LOCALE[lang]);
};
