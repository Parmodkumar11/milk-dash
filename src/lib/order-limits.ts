import type { FilterCategoryId } from '@/data/filter-categories';

export const MAX_VEG_KG_PER_LINE = 5;

export function isVegetableCategory(categoryId: FilterCategoryId): boolean {
  return categoryId === 'vegetables';
}

export function maxQuantityForCategory(categoryId: FilterCategoryId): number {
  if (isVegetableCategory(categoryId)) return MAX_VEG_KG_PER_LINE;
  return 99;
}

export function quantityUnitLabel(categoryId: FilterCategoryId): string | null {
  if (isVegetableCategory(categoryId)) return 'kg';
  return null;
}

export function validateQuantity(categoryId: FilterCategoryId, quantity: number): string | null {
  const max = maxQuantityForCategory(categoryId);
  if (quantity > max) {
    if (isVegetableCategory(categoryId)) {
      return `Max ${max} kg per vegetable on bike delivery.`;
    }
    return `Max quantity is ${max}.`;
  }
  return null;
}
