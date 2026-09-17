import { dictionaries, type MessageKey } from './messages';
import { DEFAULT_LOCALE, type Locale } from './locales';

export type { Locale, MessageKey };
export { LOCALES, DEFAULT_LOCALE, isLocale, guessLocale, LOCALE_STORAGE_KEY, LOCALE_CHOSEN_KEY } from './locales';

export function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined || vars[key] === null ? `{${key}}` : String(vars[key])
  );
}

export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>) {
  const table = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  return interpolate(table[key] ?? dictionaries.en[key] ?? key, vars);
}
