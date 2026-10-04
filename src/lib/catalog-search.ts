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

// ---------------------------------------------------------------------------
// Curated Unsplash URLs per product slug — Blinkit-style product photos
// ---------------------------------------------------------------------------
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';
const U = (id: string) => `${UNSPLASH_BASE}${id}?w=400&h=400&fit=crop&auto=format&q=80`;

export const PRODUCT_IMAGE_URLS: Record<string, string> = {
  // ── GROCERY ──────────────────────────────────────────────────────────────
  'atta': U('1574323347407-f5e1ad6d020b'),
  'maida': U('1556909114-f6e7ad7d3136'),
  'besan': U('1567982047351-76b6f93e38ee'),
  'rice': U('1536304929831-ee1ca9d44906'),
  'basmati-rice': U('1586201375761-83865001e31c'),
  'dal': U('1585937421612-70a008356fbe'),
  'toor-dal': U('1628294895950-9805252f784d'),
  'moong-dal': U('1585937421612-70a008356fbe'),
  'rajma': U('1515543237350-b3eea1ec8082'),
  'chana': U('1519915028121-7d3463d20b13'),
  'sugar': U('1555949963-ff9fe0c870eb'),
  'salt': U('1609167830220-7164aa360951'),
  'turmeric': U('1596040033229-a9821ebd058d'),
  'red-chilli-powder': U('1599940824399-b87987ceb72a'),
  'coriander-powder': U('1596040033229-a9821ebd058d'),
  'garam-masala': U('1547592180-85f173990554'),
  'cooking-oil': U('1474979266404-7eaacbcd87c5'),
  'mustard-oil': U('1474979266404-7eaacbcd87c5'),
  'ghee': U('1631452180519-c014fe946bc7'),
  'pickle': U('1563565375-f3fdfdbefa83'),
  'ketchup': U('1571680322279-a226e6a4cc2a'),
  'tomato-sauce': U('1571680322279-a226e6a4cc2a'),
  'mayonnaise': U('1590779033100-9f60a05a013d'),
  'maggi': U('1569050467447-ce54b3bbc37d'),
  'pasta': U('1621996346565-e3dbc646d9a9'),
  'noodles': U('1563245372-f21724e3856d'),
  'poha': U('1585937421612-70a008356fbe'),
  'oats': U('1614961233913-a5113a4a34ed'),
  'cornflakes': U('1506089676908-3592f7389d4d'),
  'bread': U('1549931319-a545dcf3bc73'),
  'rusk': U('1578985545062-69928b1d9587'),
  'biscuits': U('1558961363-fa8fdf82db35'),
  'namkeen': U('1599490659213-e2b9527bd087'),
  'packaged-food': U('1542838132-92c53300491e'),
  'instant-food': U('1607532941433-304659e8198a'),
  'sooji': U('1574323347407-f5e1ad6d020b'),
  'vermicelli': U('1621996346565-e3dbc646d9a9'),
  'peanut-butter': U('1604977042946-1eecc30f269e'),
  'jam': U('1563565375-f3fdfdbefa83'),
  'honey': U('1587049352846-4a222e784d38'),

  // ── MILK & DAIRY ─────────────────────────────────────────────────────────
  'milk': U('1550583724-b2692b85b150'),
  'toned-milk': U('1563636619-e9143da7973b'),
  'full-cream-milk': U('1563636619-e9143da7973b'),
  'curd': U('1488477181946-6428a0291777'),
  'paneer': U('1631452180519-c014fe946bc7'),
  'butter': U('1589985270826-4b7bb135bc9d'),
  'cheese': U('1552767059-ce182ead6c1b'),
  'cream': U('1606787366850-de6330128bfc'),
  'lassi': U('1568183348866-f9d83a49d36d'),
  'buttermilk': U('1563636619-e9143da7973b'),
  'flavoured-milk': U('1551024709-8f23befc6f87'),
  'yogurt': U('1488477181946-6428a0291777'),
  'dairy-products': U('1550583724-b2692b85b150'),

  // ── SNACKS ───────────────────────────────────────────────────────────────
  'lays': U('1566478989037-eec170784d0b'),
  'kurkure': U('1599490659213-e2b9527bd087'),
  'bingo': U('1566478989037-eec170784d0b'),
  'uncle-chipps': U('1566478989037-eec170784d0b'),
  'doritos': U('1621939514649-280e2ee25f60'),
  'nachos': U('1558618666-fcd25c85cd64'),
  'popcorn': U('1585647347483-22b66260dfff'),
  'bhujia': U('1599490659213-e2b9527bd087'),
  'mixture': U('1599490659213-e2b9527bd087'),
  'wafers': U('1566478989037-eec170784d0b'),
  'parle-g': U('1558961363-fa8fdf82db35'),
  'good-day': U('1558961363-fa8fdf82db35'),
  'cookies': U('1499636136210-6f4ee915583e'),
  'chocolates': U('1549007994-cb92caebd54b'),
  'dairy-milk': U('1549007994-cb92caebd54b'),
  'kitkat': U('1621939514649-280e2ee25f60'),
  'candy': U('1574169208507-84376144848b'),
  'nuts': U('1508061253366-f7da158b6d46'),
  'haldiram-snacks': U('1599490659213-e2b9527bd087'),

  // ── DRINKS ───────────────────────────────────────────────────────────────
  'coke': U('1622483767028-3f66f32aef97'),
  'coca-cola': U('1622483767028-3f66f32aef97'),
  'pepsi': U('1622483767028-3f66f32aef97'),
  'sprite': U('1625772452859-1c03d5bf1137'),
  'fanta': U('1625772452859-1c03d5bf1137'),
  'limca': U('1625772452859-1c03d5bf1137'),
  'mountain-dew': U('1625772452859-1c03d5bf1137'),
  'thums-up': U('1622483767028-3f66f32aef97'),
  'sting': U('1551538827-9c037cb4f32a'),
  'red-bull': U('1551538827-9c037cb4f32a'),
  'monster': U('1551538827-9c037cb4f32a'),
  'energy-drink': U('1551538827-9c037cb4f32a'),
  'bisleri-water': U('1548839140-29a749e1cf4d'),
  'packaged-water': U('1548839140-29a749e1cf4d'),
  'juice': U('1621506289937-a8e4df240d0b'),
  'real-juice': U('1621506289937-a8e4df240d0b'),
  'maaza': U('1600271886742-f049cd451bba'),
  'frooti': U('1600271886742-f049cd451bba'),
  'fruit-drink': U('1600271886742-f049cd451bba'),
  'cold-coffee': U('1461023058943-07fcbe16d735'),
  'water': U('1548839140-29a749e1cf4d'),

  // ── TEA & COFFEE ─────────────────────────────────────────────────────────
  'tea': U('1544787219-7f47ccb76574'),
  'chai': U('1597318181409-cf64d0b5d8a2'),
  'black-tea': U('1544787219-7f47ccb76574'),
  'green-tea': U('1556679343-c7306c1976bc'),
  'coffee': U('1495474472287-4d71bcdd2085'),
  'cappuccino': U('1534778101976-62847782c213'),
  'instant-coffee': U('1559056199-641a0ac8b55e'),
  'nescafe': U('1559056199-641a0ac8b55e'),
  'tea-bags': U('1576092768241-dec231879fc3'),
  'coffee-sachets': U('1559056199-641a0ac8b55e'),

  // ── FOOD ─────────────────────────────────────────────────────────────────
  'sandwich': U('1528735602780-2552fd46c7af'),
  'fries': U('1576857130-b3c12025-fa17-4e5e-8073-1c8ea86ad21b'),
  'momos': U('1496116218417-1a781b1c416c'),
  'burger': U('1568901346375-23c9450c58cd'),
  'roll': U('1565299507177-b0ac66763828'),
  'samosa': U('1601050690597-df0568f70950'),
  'pakora': U('1567620905732-2d1ec7ab7445'),
  'spring-rolls': U('1541614101331-1a5a3a194e92'),
  'pizza': U('1565299624946-b28f40a0ae38'),
  'wrap': U('1626700051175-6818013e1d4f'),
  'nuggets': U('1562802378-063ec186a863'),
  'fried-chicken': U('1626645738196-c2a7c87a8f58'),
  'dessert': U('1551024601-bec78aea704b'),
  'combo-meal': U('1504674900247-0877df9cc836'),
  'quick-food': U('1504674900247-0877df9cc836'),
  'local-snacks': U('1601050690597-df0568f70950'),

  // ── VEGETABLES ───────────────────────────────────────────────────────────
  'potato': U('1518977676601-b53f82aba655'),
  'onion': U('1508747703725-719777637510'),
  'tomato': U('1592841200221-a6898f307baa'),
  'garlic': U('1540518614846-7eded433c457'),
  'ginger': U('1508747703725-719777637510'),
  'green-chilli': U('1588252303782-cb80119abd6d'),
  'lemon': U('1582063289852-62e3ba2747f8'),
  'carrot': U('1598170845058-32b9d6a5da37'),
  'cucumber': U('1604977042946-1eecc30f269e'),
  'capsicum': U('1563565375-f3fdfdbefa83'),
  'cauliflower': U('1568702846914-96b305d2aaeb'),
  'cabbage': U('1597362925123-77861d3fbac7'),
  'peas': U('1615485290382-441e4d049cb5'),
  'spinach': U('1576045057995-568f588f82fb'),
  'coriander': U('1615485290382-441e4d049cb5'),
  'beans': U('1567375698348-5d9d5ae99de0'),
  'brinjal': U('1587132137056-bfbf0166836e'),
  'bottle-gourd': U('1597362925123-77861d3fbac7'),

  // ── DRY FRUITS ───────────────────────────────────────────────────────────
  'almonds': U('1508061253366-f7da158b6d46'),
  'cashews': U('1608797178974-15b35a64ede9'),
  'raisins': U('1592621385612-4d7129426394'),
  'walnuts': U('1626197031507-c17099753214'),
  'pistachios': U('1606914501449-5a96b6ce24ca'),
  'dates': U('1595273670150-bd0c3c392e46'),
  'peanuts': U('1508061253366-f7da158b6d46'),
  'mixed-dry-fruits': U('1508061253366-f7da158b6d46'),
  'seeds': U('1600271886742-f049cd451bba'),
  'sunflower-seeds': U('1571680313668-c3e68d40f4b9'),

  // ── PERSONAL CARE ────────────────────────────────────────────────────────
  'face-wash': U('1556228578-8c89e6adf883'),
  'moisturizer': U('1620916566398-39f1143ab7be'),
  'sunscreen': U('1556228720-195a672e8a03'),
  'face-cream': U('1596462502278-27bfdc403348'),
  'body-lotion': U('1608248543803-ba4f8c70ae0b'),
  'soap': U('1604335399105-a0c585fd81a1'),
  'hand-wash': U('1556909172-54557c7e4fb7'),
  'shampoo': U('1526947425960-945c6e72858f'),
  'conditioner': U('1526947425960-945c6e72858f'),
  'hair-oil': U('1620916566398-39f1143ab7be'),
  'hair-gel': U('1526947425960-945c6e72858f'),
  'deodorant': U('1526947425960-945c6e72858f'),
  'perfume': U('1588405748880-12d1d2a59f75'),
  'lip-balm': U('1608248543803-ba4f8c70ae0b'),
  'shaving-cream': U('1503951914875-452162b0f3f1'),
  'razor': U('1503951914875-452162b0f3f1'),
  'aftershave': U('1503951914875-452162b0f3f1'),
  'toothpaste': U('1607613009820-a29f7bb81c04'),
  'toothbrush': U('1609840114035-3c981b782dfe'),

  // ── HOUSEHOLD ────────────────────────────────────────────────────────────
  'mouthwash': U('1607613009820-a29f7bb81c04'),
  'toilet-cleaner': U('1585771724684-38269d6639fd'),
  'floor-cleaner': U('1585771724684-38269d6639fd'),
  'dishwashing-liquid': U('1585771724684-38269d6639fd'),
  'scrubber': U('1563453392212-326f5e854473'),
  'detergent': U('1626806787461-102c1bfaaea1'),
  'washing-powder': U('1626806787461-102c1bfaaea1'),
  'garbage-bags': U('1563453392212-326f5e854473'),
  'tissues': U('1584464491033-06628f3a6b7b'),
  'toilet-paper': U('1584464491033-06628f3a6b7b'),
  'kitchen-towels': U('1584464491033-06628f3a6b7b'),
  'batteries': U('1619642751034-765dfdf7c58e'),
  'mosquito-repellent': U('1584464491033-06628f3a6b7b'),
  'matchbox': U('1590301157890-4810ed352733'),
  'candle': U('1516571748831-5d81767b788d'),
  'cleaning-products': U('1585771724684-38269d6639fd'),

  // ── MEDICAL ──────────────────────────────────────────────────────────────
  'bandage': U('1583947581924-860bda6a26df'),
  'cotton': U('1583947581924-860bda6a26df'),
  'antiseptic': U('1584308666744-24d5c474f2ae'),
  'dettol': U('1584308666744-24d5c474f2ae'),
  'thermometer': U('1584308666744-24d5c474f2ae'),
  'mask': U('1584634731339-252c581abfc5'),
  'hand-sanitizer': U('1584634731339-252c581abfc5'),
  'ors': U('1584308666744-24d5c474f2ae'),
  'paracetamol': U('1584308666744-24d5c474f2ae'),
  'first-aid-kit': U('1583947581924-860bda6a26df'),
  'pain-relief': U('1584308666744-24d5c474f2ae'),
  'cough-syrup': U('1584308666744-24d5c474f2ae'),
  'vitamin-c': U('1584308666744-24d5c474f2ae'),
  'electrolyte': U('1584308666744-24d5c474f2ae'),
  'condoms': U('1583947581924-860bda6a26df'),
  'sanitary-pads': U('1583947581924-860bda6a26df'),
  'intimate-wash': U('1608248543803-ba4f8c70ae0b'),
  'lubricant': U('1608248543803-ba4f8c70ae0b'),
};

// Fallback Unsplash URLs per category
const CATEGORY_FALLBACK_URLS: Record<FilterCategoryId, string> = {
  'grocery': U('1542838132-92c53300491e'),
  'milk-dairy': U('1550583724-b2692b85b150'),
  'snacks': U('1566478989037-eec170784d0b'),
  'drinks': U('1622483767028-3f66f32aef97'),
  'tea-coffee': U('1495474472287-4d71bcdd2085'),
  'food': U('1504674900247-0877df9cc836'),
  'vegetables': U('1583258523011-1de69bbba82a'),
  'dry-fruits': U('1508061253366-f7da158b6d46'),
  'personal-care': U('1556228578-8c89e6adf883'),
  'household': U('1585771724684-38269d6639fd'),
  'medical': U('1584308666744-24d5c474f2ae'),
  'others': U('1542838132-92c53300491e'),
};

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

/** Primary image URL — Unsplash direct URL (no local file needed) */
export function productImageSrc(product: RequestProduct): string {
  return PRODUCT_IMAGE_URLS[product.imageSlug] ?? categoryFallbackImage(product.categoryId);
}

/** Category-level fallback image URL */
export function categoryFallbackImage(categoryId: FilterCategoryId): string {
  return CATEGORY_FALLBACK_URLS[categoryId] ?? U('1542838132-92c53300491e');
}

/** Ordered list of image candidates; first working one is used */
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
];
