import en from './locales/en.json';
import zh from './locales/zh.json';

export type Language = 'en' | 'zh';

type Dict = Record<string, string>;

const enDict: Dict = en as Dict;
const zhDict: Dict = zh as Dict;

export function translate(language: Language, key: string): string {
  if (language === 'zh') {
    return zhDict[key] ?? enDict[key] ?? key;
  }
  return enDict[key] ?? key;
}

export function normalizeLanguage(raw: string | null | undefined): Language {
  const value = (raw || '').toLowerCase();
  if (value.startsWith('zh')) return 'zh';
  return 'en';
}
