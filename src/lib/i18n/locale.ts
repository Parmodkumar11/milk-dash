export type Locale = 'en' | 'hi';

export const LOCALE_STORAGE_KEY = 'hopin-locale';

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'hi';
}
