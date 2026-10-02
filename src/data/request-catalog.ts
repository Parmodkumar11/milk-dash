import type { FilterCategoryId } from '@/data/filter-categories';
import { hindiName } from '@/data/name-hi';

export type RequestProduct = {
  id: string;
  name: string;
  nameHi: string;
  categoryId: FilterCategoryId;
  searchText: string;
  imageSlug: string;
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let idCounter = 0;
function item(name: string, categoryId: FilterCategoryId, aliases: string[] = []): RequestProduct {
  idCounter += 1;
  const nameHi = hindiName(name);
  const imageSlug = slugify(name);
  const normalized = [name, nameHi, ...aliases].join(' ').toLowerCase();
  return {
    id: `req-${categoryId}-${idCounter}`,
    name,
    nameHi,
    categoryId,
    searchText: normalized,
    imageSlug,
  };
}

function many(categoryId: FilterCategoryId, names: string[]): RequestProduct[] {
  return names.map((name) => item(name, categoryId));
}

const GROCERY = many('grocery', [
  'Atta',
  'Maida',
  'Besan',
  'Rice',
  'Basmati Rice',
  'Dal',
  'Toor Dal',
  'Moong Dal',
  'Rajma',
  'Chana',
  'Sugar',
  'Salt',
  'Turmeric',
  'Red Chilli Powder',
  'Coriander Powder',
  'Garam Masala',
  'Cooking Oil',
  'Mustard Oil',
  'Ghee',
  'Pickle',
  'Ketchup',
  'Tomato Sauce',
  'Mayonnaise',
  'Maggi',
  'Pasta',
  'Noodles',
  'Poha',
  'Oats',
  'Cornflakes',
  'Bread',
  'Rusk',
  'Biscuits',
  'Namkeen',
  'Packaged Food',
  'Instant Food',
  'Sooji',
  'Vermicelli',
  'Peanut Butter',
  'Jam',
  'Honey',
]);

const MILK_DAIRY = many('milk-dairy', [
  'Milk',
  'Toned Milk',
  'Full Cream Milk',
  'Curd',
  'Paneer',
  'Butter',
  'Cheese',
  'Cream',
  'Lassi',
  'Buttermilk',
  'Flavoured Milk',
  'Yogurt',
  'Dairy Products',
]);

const SNACKS = many('snacks', [
  'Lays',
  'Kurkure',
  'Bingo',
  'Uncle Chipps',
  'Doritos',
  'Nachos',
  'Popcorn',
  'Namkeen',
  'Bhujia',
  'Mixture',
  'Wafers',
  'Biscuits',
  'Parle-G',
  'Good Day',
  'Cookies',
  'Chocolates',
  'Dairy Milk',
  'KitKat',
  'Candy',
  'Nuts',
  'Haldiram Snacks',
]);

const DRINKS = many('drinks', [
  'Coke',
  'Coca-Cola',
  'Pepsi',
  'Sprite',
  'Fanta',
  'Limca',
  'Mountain Dew',
  'Thums Up',
  'Sting',
  'Red Bull',
  'Monster',
  'Energy Drink',
  'Bisleri Water',
  'Packaged Water',
  'Juice',
  'Real Juice',
  'Maaza',
  'Frooti',
  'Fruit Drink',
  'Cold Coffee',
  'Flavoured Milk',
  'Lassi',
]);

const TEA_COFFEE = many('tea-coffee', [
  'Tea',
  'Chai',
  'Black Tea',
  'Green Tea',
  'Coffee',
  'Cold Coffee',
  'Cappuccino',
  'Instant Coffee',
  'Nescafe',
  'Tea Bags',
  'Coffee Sachets',
  'Sugar',
]);

const FOOD = many('food', [
  'Chai',
  'Coffee',
  'Sandwich',
  'Fries',
  'Maggi',
  'Momos',
  'Burger',
  'Roll',
  'Samosa',
  'Pakora',
  'Spring Rolls',
  'Pizza',
  'Wrap',
  'Nuggets',
  'Fried Chicken',
  'Dessert',
  'Combo Meal',
  'Quick Food',
  'Local Snacks',
]);

const VEGETABLES = many('vegetables', [
  'Potato',
  'Onion',
  'Tomato',
  'Garlic',
  'Ginger',
  'Green Chilli',
  'Lemon',
  'Carrot',
  'Cucumber',
  'Capsicum',
  'Cauliflower',
  'Cabbage',
  'Peas',
  'Spinach',
  'Coriander',
  'Beans',
  'Brinjal',
  'Bottle Gourd',
]);

const DRY_FRUITS = many('dry-fruits', [
  'Almonds',
  'Cashews',
  'Raisins',
  'Walnuts',
  'Pistachios',
  'Dates',
  'Peanuts',
  'Mixed Dry Fruits',
  'Seeds',
  'Sunflower Seeds',
]);

const PERSONAL_CARE = many('personal-care', [
  'Face Wash',
  'Moisturizer',
  'Sunscreen',
  'Face Cream',
  'Body Lotion',
  'Soap',
  'Hand Wash',
  'Shampoo',
  'Conditioner',
  'Hair Oil',
  'Hair Gel',
  'Deodorant',
  'Perfume',
  'Lip Balm',
  'Shaving Cream',
  'Razor',
  'Aftershave',
  'Toothpaste',
  'Toothbrush',
]);

const HOUSEHOLD = many('household', [
  'Toothbrush',
  'Toothpaste',
  'Mouthwash',
  'Toilet Cleaner',
  'Floor Cleaner',
  'Dishwashing Liquid',
  'Scrubber',
  'Detergent',
  'Washing Powder',
  'Garbage Bags',
  'Tissues',
  'Toilet Paper',
  'Kitchen Towels',
  'Batteries',
  'Mosquito Repellent',
  'Matchbox',
  'Candle',
  'Cleaning Products',
]);

const MEDICAL = many('medical', [
  'Bandage',
  'Cotton',
  'Antiseptic',
  'Dettol',
  'Thermometer',
  'Mask',
  'Hand Sanitizer',
  'ORS',
  'Paracetamol',
  'First Aid Kit',
  'Pain Relief',
  'Cough Syrup',
  'Vitamin C',
  'Electrolyte',
  'Condoms',
  'Sanitary Pads',
  'Intimate Wash',
  'Lubricant',
]);

export const REQUEST_CATALOG: RequestProduct[] = [
  ...GROCERY,
  ...MILK_DAIRY,
  ...SNACKS,
  ...DRINKS,
  ...TEA_COFFEE,
  ...FOOD,
  ...VEGETABLES,
  ...DRY_FRUITS,
  ...PERSONAL_CARE,
  ...HOUSEHOLD,
  ...MEDICAL,
];

export function getProductById(id: string): RequestProduct | undefined {
  return REQUEST_CATALOG.find((p) => p.id === id);
}
