import type { RequestProduct } from '@/data/request-catalog';
import type { Locale } from '@/lib/i18n/locale';

export function displayName(product: RequestProduct, locale: Locale): string {
  if (locale === 'hi') return product.nameHi;
  return product.name;
}

export function displaySecondary(product: RequestProduct, locale: Locale): string | null {
  if (locale === 'hi') return product.name !== product.nameHi ? product.name : null;
  return product.nameHi !== product.name ? product.nameHi : null;
}

export function lineDisplayName(
  name: string,
  nameHi?: string,
  locale: Locale = 'en'
): string {
  if (locale === 'hi' && nameHi) return `${nameHi} (${name})`;
  if (nameHi && nameHi !== name) return `${name} (${nameHi})`;
  return name;
}
