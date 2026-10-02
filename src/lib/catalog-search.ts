import type { FilterCategoryId } from '@/data/filter-categories';
import { REQUEST_CATALOG, type RequestProduct } from '@/data/request-catalog';

export const SEARCH_SUGGESTIONS = [
  'Milk',
  'दूध',
  'Chips',
  'Coffee',
  'Bread',
  'Cold Drink',
  'Face Wash',
  'Toothpaste',
  'Shampoo',
  'Medicine',
  'Dry Fruits',
  'Maggi',
  'Biscuits',
  'Lays',
  'Paneer',
];

export function filterByCategory(
  products: RequestProduct[],
  categoryId: FilterCategoryId | 'all'
): RequestProduct[] {
  if (categoryId === 'all') return products;
  return products.filter((p) => p.categoryId === categoryId);
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function searchProducts(
  query: string,
  categoryId: FilterCategoryId | 'all' = 'all',
  products: RequestProduct[] = REQUEST_CATALOG
): RequestProduct[] {
  const scoped = filterByCategory(products, categoryId);
  const q = normalizeQuery(query);
  if (!q) return scoped;

  const tokens = q.split(' ').filter(Boolean);
  return scoped.filter((p) => {
    const hay = p.searchText;
    return tokens.every((t) => hay.includes(t) || p.name.toLowerCase().includes(t));
  });
}

export function productImageSrc(product: RequestProduct): string {
  return `/catalog/items/${product.imageSlug}.jpg`;
}

export function categoryFallbackImage(categoryId: FilterCategoryId): string {
  return `/catalog/${categoryId}.jpg`;
}

export function productImageCandidates(product: RequestProduct): string[] {
  return [productImageSrc(product), categoryFallbackImage(product.categoryId)];
}

/** Categories shown on home (excluding all / others) */
export const HOME_SECTION_CATEGORIES: FilterCategoryId[] = [
  'grocery',
  'milk-dairy',
  'snacks',
  'drinks',
  'tea-coffee',
  'food',
  'vegetables',
  'dry-fruits',
  'personal-care',
  'household',
  'medical',
];
