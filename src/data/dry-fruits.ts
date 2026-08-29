export interface DryFruitOption {
  id: string;
  name: string;
  price: number;
}

export const dryFruits: DryFruitOption[] = [
  { id: 'almond', name: 'Almond', price: 20 },
  { id: 'cashew', name: 'Cashew', price: 20 },
  { id: 'pistachio', name: 'Pistachio', price: 25 },
  { id: 'walnut', name: 'Walnut', price: 25 },
  { id: 'raisins', name: 'Raisins', price: 15 },
  { id: 'dates', name: 'Dates', price: 20 },
  { id: 'mixed', name: 'Mixed Dry Fruits', price: 40 },
];
