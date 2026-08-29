export interface MilkProduct {
  id: 'hot' | 'cold';
  name: string;
  displayName: string;
  description: string;
  pricePerMl: number; // Price per ML for custom sizes
  presets: {
    ml: number;
    price: number;
  }[];
}

export const milkProducts: MilkProduct[] = [
  {
    id: 'hot',
    name: 'Hot Milk',
    displayName: 'Hot Milk 🔥',
    description: 'Freshly heated whole milk, perfectly boiled and served warm. Cozy, traditional, and soothing.',
    pricePerMl: 0.18, // ₹45 for 250ML, ₹90 for 500ML, ₹180 for 1000ML
    presets: [
      { ml: 250, price: 45 },
      { ml: 500, price: 90 },
      { ml: 750, price: 135 },
      { ml: 1000, price: 180 },
    ],
  },
  {
    id: 'cold',
    name: 'Cold Milk',
    displayName: 'Cold Milk ❄️',
    description: 'Chilled premium whole milk. Refreshing, creamy, and perfect for a quick energy boost.',
    pricePerMl: 0.16, // ₹40 for 250ML, ₹80 for 500ML, ₹160 for 1000ML
    presets: [
      { ml: 250, price: 40 },
      { ml: 500, price: 80 },
      { ml: 750, price: 120 },
      { ml: 1000, price: 160 },
    ],
  },
];
