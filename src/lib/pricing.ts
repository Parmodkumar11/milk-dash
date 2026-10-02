import { SERVICE_CHARGE_PER_TWO_ITEMS } from '@/lib/delivery';
import type { CartLine } from '@/types/order';

export { SERVICE_CHARGE_PER_TWO_ITEMS };

/** Distinct products/lines in cart (not kg/L/piece totals). */
export function cartItemCount(lines: CartLine[]): number {
  return lines.length;
}

export function uniqueLineCount(lines: CartLine[]): number {
  return lines.length;
}

export function serviceChargeInr(lines: CartLine[]): number {
  const n = uniqueLineCount(lines);
  if (n === 0) return 0;
  return SERVICE_CHARGE_PER_TWO_ITEMS * Math.ceil(n / 2);
}
