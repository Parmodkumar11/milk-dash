import type { LucideIcon } from 'lucide-react';
import {
  CupSoda,
  Cookie,
  Milk,
  Siren,
  PenLine,
  Package,
  Coffee,
  UtensilsCrossed,
  Carrot,
  Nut,
  Sparkles,
  Home,
  Pill,
  ShoppingBasket,
} from 'lucide-react';
import type { FilterCategoryId } from '@/data/filter-categories';

const CATEGORY_ICONS: Record<FilterCategoryId, LucideIcon> = {
  grocery: ShoppingBasket,
  'milk-dairy': Milk,
  snacks: Cookie,
  drinks: CupSoda,
  'tea-coffee': Coffee,
  food: UtensilsCrossed,
  vegetables: Carrot,
  'dry-fruits': Nut,
  'personal-care': Sparkles,
  household: Home,
  medical: Pill,
  others: PenLine,
};

export function getCategoryIcon(slug: FilterCategoryId | string): LucideIcon {
  if (slug in CATEGORY_ICONS) return CATEGORY_ICONS[slug as FilterCategoryId];
  return Package;
}
