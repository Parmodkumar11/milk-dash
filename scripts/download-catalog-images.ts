/**
 * Downloads per-SKU images → public/catalog/items/{imageSlug}.jpg
 * Sources: Open Food Facts → Wikimedia Commons → category placeholder.
 * Run: npm run catalog:images  (wait ~5–8 min; respect API limits)
 */
import fs from 'fs';
import path from 'path';
import { REQUEST_CATALOG } from '../src/data/request-catalog';
import type { FilterCategoryId } from '../src/data/filter-categories';

const OUT_DIR = path.join(process.cwd(), 'public/catalog/items');
const CATALOG_DIR = path.join(process.cwd(), 'public/catalog');
const UA = 'HopInMohali-catalog/1.0 (contact: hopin@mohali.local)';
const WIKI_DELAY_MS = 1500;
const OFF_DELAY_MS = 280;

const CATEGORY_HINT: Record<FilterCategoryId, string> = {
  grocery: 'india grocery',
  'milk-dairy': 'milk dairy',
  snacks: 'chips snacks',
  drinks: 'beverage bottle',
  'tea-coffee': 'tea coffee',
  food: 'food',
  vegetables: 'vegetable fresh',
  'dry-fruits': 'nuts dry fruit',
  'personal-care': 'toiletries',
  household: 'cleaning product',
  medical: 'medicine pharmacy',
  others: 'supermarket',
};

const NAME_QUERY: Record<string, string> = {
  Atta: 'atta wheat flour',
  Maida: 'maida flour',
  Besan: 'besan gram flour',
  Rice: 'rice',
  'Basmati Rice': 'basmati rice',
  Dal: 'toor dal lentils',
  'Toor Dal': 'toor dal',
  'Moong Dal': 'moong dal',
  Rajma: 'rajma',
  Chana: 'chana dal',
  Sugar: 'sugar',
  Salt: 'salt iodized',
  Turmeric: 'turmeric powder',
  'Red Chilli Powder': 'chilli powder',
  'Coriander Powder': 'coriander powder',
  'Garam Masala': 'garam masala',
  'Cooking Oil': 'cooking oil sunflower',
  'Mustard Oil': 'mustard oil',
  Ghee: 'ghee clarified butter',
  Pickle: 'pickle achar',
  Ketchup: 'ketchup',
  'Tomato Sauce': 'tomato sauce',
  Mayonnaise: 'mayonnaise',
  Maggi: 'maggi noodles',
  Pasta: 'pasta',
  Noodles: 'instant noodles',
  Poha: 'poha flattened rice',
  Oats: 'oats cereal',
  Cornflakes: 'cornflakes',
  Bread: 'bread loaf',
  Rusk: 'rusk biscuit',
  Biscuits: 'biscuits parle',
  Namkeen: 'namkeen bhujia',
  Milk: 'toned milk',
  'Toned Milk': 'toned milk',
  'Full Cream Milk': 'full cream milk',
  Curd: 'curd yogurt',
  Paneer: 'paneer',
  Butter: 'butter amul',
  Cheese: 'cheese slice',
  Lassi: 'lassi',
  Lays: 'lays potato chips',
  Kurkure: 'kurkure',
  Coke: 'coca cola',
  'Coca-Cola': 'coca cola',
  Pepsi: 'pepsi',
  Sprite: 'sprite',
  Fanta: 'fanta',
  'Thums Up': 'thums up',
  Bisleri: 'bisleri water',
  'Packaged Water': 'packaged drinking water',
  Juice: 'fruit juice',
  Tea: 'tea bags',
  Chai: 'tea',
  Coffee: 'instant coffee',
  Nescafe: 'nescafe',
  Potato: 'potato',
  Onion: 'onion',
  Tomato: 'tomato',
  Garlic: 'garlic',
  Ginger: 'ginger',
  Eggs: 'eggs',
  Almonds: 'almonds',
  Cashews: 'cashews',
  Shampoo: 'shampoo',
  Toothpaste: 'toothpaste colgate',
  Detergent: 'detergent surf',
  Paracetamol: 'paracetamol',
  ORS: 'ors electrolyte',
  Condoms: 'condom',
  'Sanitary Pads': 'sanitary pads whisper',
};

function offSearchTerms(name: string, categoryId: FilterCategoryId): string[] {
  const primary = NAME_QUERY[name] ?? name;
  const hint = CATEGORY_HINT[categoryId];
  return [primary, `${name} ${hint}`, name];
}

function wikiSearchTerms(name: string, categoryId: FilterCategoryId): string[] {
  const primary = NAME_QUERY[name] ?? name;
  if (categoryId === 'vegetables') return [`${name} vegetable`, `${name} food`];
  return [`${primary} product`, `${name} ${CATEGORY_HINT[categoryId]}`];
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadToFile(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) return false;
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function openFoodFactsImage(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '3',
    fields: 'image_front_url,image_url,product_name',
  });
  const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    products?: { image_front_url?: string; image_url?: string }[];
  };
  for (const p of data.products ?? []) {
    const url = p.image_front_url || p.image_url;
    if (url) return url;
  }
  return null;
}

async function wikimediaThumbUrl(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '2',
    prop: 'imageinfo',
    iiprop: 'url|thumburl',
    iiurlwidth: '500',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (text.startsWith('You are')) return null;
  const data = JSON.parse(text) as {
    query?: { pages?: Record<string, { imageinfo?: { thumburl?: string; url?: string }[] }> };
  };
  for (const page of Object.values(data.query?.pages ?? {})) {
    const info = page.imageinfo?.[0];
    if (info?.thumburl) return info.thumburl.split('?')[0];
    if (info?.url) return info.url;
  }
  return null;
}

function copyCategoryFallback(categoryId: FilterCategoryId, dest: string): boolean {
  const src = path.join(CATALOG_DIR, `${categoryId}.jpg`);
  if (!fs.existsSync(src)) return false;
  fs.copyFileSync(src, dest);
  return true;
}

async function fetchImageForProduct(
  name: string,
  categoryId: FilterCategoryId,
  dest: string
): Promise<'off' | 'wiki' | 'fallback' | 'fail'> {
  for (const q of offSearchTerms(name, categoryId).slice(0, 2)) {
    const url = await openFoodFactsImage(q);
    await sleep(OFF_DELAY_MS);
    if (url && (await downloadToFile(url, dest))) return 'off';
  }

  for (const q of wikiSearchTerms(name, categoryId).slice(0, 1)) {
    const url = await wikimediaThumbUrl(q);
    await sleep(WIKI_DELAY_MS);
    if (url && (await downloadToFile(url, dest))) return 'wiki';
  }

  if (copyCategoryFallback(categoryId, dest)) return 'fallback';
  return 'fail';
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stats = { off: 0, wiki: 0, fallback: 0, fail: 0 };

  for (let i = 0; i < REQUEST_CATALOG.length; i++) {
    const product = REQUEST_CATALOG[i];
    const dest = path.join(OUT_DIR, `${product.imageSlug}.jpg`);
    process.stdout.write(`[${i + 1}/${REQUEST_CATALOG.length}] ${product.name} … `);
    const result = await fetchImageForProduct(product.name, product.categoryId, dest);
    stats[result]++;
    process.stdout.write(`${result}\n`);
  }

  console.log('\nDone.', stats);
  console.log('Images folder:', OUT_DIR);
}

main();
