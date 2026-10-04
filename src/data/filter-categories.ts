export type FilterCategoryId =
  | 'grocery'
  | 'milk-dairy'
  | 'snacks'
  | 'drinks'
  | 'tea-coffee'
  | 'food'
  | 'vegetables'
  | 'dry-fruits'
  | 'personal-care'
  | 'household'
  | 'medical'
  | 'others';

export type FilterCategory = {
  id: FilterCategoryId | 'all';
  label: string;
};

export const FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'milk-dairy', label: 'Milk & Dairy' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'tea-coffee', label: 'Tea & Coffee' },
  { id: 'food', label: 'Food' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'personal-care', label: 'Personal Care' },
  { id: 'household', label: 'Household' },
  { id: 'others', label: 'Others' },
];

export function getFilterLabel(id: FilterCategoryId | 'all'): string {
  return FILTER_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Image file in public/catalog/{id}.jpg */
export function categoryImageKey(categoryId: FilterCategoryId): string {
  return categoryId;
}
