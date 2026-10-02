export const SERVICE_CHARGE_PER_TWO_ITEMS = 10;
export const SERVICE_AREA_LABEL = 'Phase 7, Mohali';

export function serviceChargeFormulaLabel(): string {
  return `₹${SERVICE_CHARGE_PER_TWO_ITEMS} per 2 different items`;
}

/** @deprecated use serviceChargeInr */
export const DELIVERY_FEE = SERVICE_CHARGE_PER_TWO_ITEMS;
