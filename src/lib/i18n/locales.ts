export const LOCALES = [
  { id: 'en', native: 'English', short: 'EN', htmlLang: 'en' },
  { id: 'hi', native: 'हिन्दी', short: 'हि', htmlLang: 'hi' },
  { id: 'pa', native: 'ਪੰਜਾਬੀ', short: 'ਪੰ', htmlLang: 'pa' },
] as const;

export type Locale = (typeof LOCALES)[number]['id'];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'hopin-locale';
export const LOCALE_CHOSEN_KEY = 'hopin-locale-chosen';

export function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'hi' || value === 'pa';
}

export function guessLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = `${navigator.language} ${(navigator.languages || []).join(' ')}`.toLowerCase();
  if (lang.includes('pa') || lang.includes('punjabi') || lang.includes('gurmukhi')) return 'pa';
  if (lang.includes('hi') || lang.includes('hindi') || lang.includes('deva')) return 'hi';
  return DEFAULT_LOCALE;
}
