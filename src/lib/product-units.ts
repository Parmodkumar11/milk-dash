import type { FilterCategoryId } from '@/data/filter-categories';

export type UnitKind = 'piece' | 'kg' | 'g' | 'L' | 'ml' | 'pack';

export type ProductUnitConfig = {
  kind: UnitKind;
  presets: number[];
  step: number;
  max: number;
};

const KG_NAMES =
  /atta|maida|besan|rice|basmati|dal|toor|moong|rajma|chana|sugar|sooji|vermicelli|poha|oats|paneer|butter|ghee|cheese|pickle|honey|jam|peanut/i;
const LITER_NAMES =
  /milk|lassi|buttermilk|juice|coke|pepsi|sprite|water|cold drink|oil|mustard oil|cooking oil|cream|shampoo|detergent|liquid|hand wash|sanitizer|lubricant/i;
const GRAM_NAMES = /masala|powder|chilli|turmeric|coriander|salt|tea|coffee|biscuit|rusk|namkeen|maggi|noodles|pasta/i;
const PACK_NAMES = /bread|eggs|sanitary|pad|condom|bandage|ors|paracetamol|tablet|capsule|soap|toothpaste|toothbrush|brush/i;

export function unitConfigForProduct(
  name: string,
  categoryId: FilterCategoryId
): ProductUnitConfig {
  const n = name.toLowerCase();

  if (categoryId === 'vegetables') {
    return { kind: 'kg', presets: [1, 2, 3, 5], step: 1, max: 5 };
  }

  if (categoryId === 'dry-fruits') {
    return { kind: 'g', presets: [100, 250, 500, 1000], step: 50, max: 2000 };
  }

  if (KG_NAMES.test(n) && !LITER_NAMES.test(n)) {
    return { kind: 'kg', presets: [1, 2, 5], step: 1, max: 10 };
  }

  if (LITER_NAMES.test(n) || categoryId === 'drinks' || categoryId === 'milk-dairy') {
    if (/milk|water|juice|coke|pepsi|sprite|lassi|buttermilk/i.test(n)) {
      return { kind: 'L', presets: [0.5, 1, 2], step: 0.5, max: 5 };
    }
    if (categoryId === 'milk-dairy' || categoryId === 'drinks') {
      return { kind: 'L', presets: [0.5, 1, 2], step: 0.5, max: 5 };
    }
  }

  if (GRAM_NAMES.test(n) || categoryId === 'tea-coffee' || categoryId === 'snacks') {
    if (categoryId === 'snacks' && /lays|kurkure|chips|namkeen/i.test(n)) {
      return { kind: 'pack', presets: [1, 2, 3], step: 1, max: 20 };
    }
    return { kind: 'g', presets: [100, 200, 500], step: 50, max: 2000 };
  }

  if (PACK_NAMES.test(n) || categoryId === 'medical' || categoryId === 'personal-care') {
    if (/eggs/i.test(n)) {
      return { kind: 'piece', presets: [6, 12, 30], step: 1, max: 60 };
    }
    return { kind: 'piece', presets: [1, 2, 3], step: 1, max: 20 };
  }

  if (categoryId === 'food' || categoryId === 'grocery') {
    return { kind: 'piece', presets: [1, 2, 3], step: 1, max: 20 };
  }

  return { kind: 'piece', presets: [1, 2, 3], step: 1, max: 99 };
}

export function formatQuantity(amount: number, kind: UnitKind): string {
  if (kind === 'piece') {
    return amount === 1 ? '1 piece' : `${amount} pieces`;
  }
  if (kind === 'pack') {
    return amount === 1 ? '1 pack' : `${amount} packs`;
  }
  if (kind === 'kg') {
    return `${stripDecimal(amount)} kg`;
  }
  if (kind === 'g') {
    return `${Math.round(amount)} g`;
  }
  if (kind === 'L') {
    return `${stripDecimal(amount)} L`;
  }
  if (kind === 'ml') {
    return `${Math.round(amount)} ml`;
  }
  return String(amount);
}

function stripDecimal(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace(/\.0$/, '');
}

export function presetLabel(amount: number, kind: UnitKind): string {
  if (kind === 'piece') return amount === 1 ? '1 pc' : `${amount} pc`;
  if (kind === 'pack') return amount === 1 ? '1 pack' : `${amount} pack`;
  if (kind === 'kg') return `${stripDecimal(amount)} kg`;
  if (kind === 'g') return `${amount}g`;
  if (kind === 'L') return `${stripDecimal(amount)} L`;
  if (kind === 'ml') return `${amount} ml`;
  return String(amount);
}

export function maxQuantityForUnit(config: ProductUnitConfig): number {
  if (config.kind === 'kg' && config.max <= 5) return config.max;
  return config.max;
}

export function validateQuantityForUnit(
  config: ProductUnitConfig,
  quantity: number,
  categoryId: FilterCategoryId
): string | null {
  const max = maxQuantityForUnit(config);
  if (quantity > max) {
    if (categoryId === 'vegetables' && config.kind === 'kg') {
      return `Max ${max} kg per vegetable on bike delivery.`;
    }
    return `Max ${formatQuantity(max, config.kind)} for this item.`;
  }
  if (quantity <= 0) return 'Choose a quantity.';
  return null;
}
