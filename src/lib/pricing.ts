import { milkProducts } from '@/data/products';
import { dryFruits } from '@/data/dry-fruits';

export const calculateItemPrice = (
  milkType: 'hot' | 'cold',
  quantityMl: number,
  selectedDryFruits: string[]
): number => {
  const product = milkProducts.find((p) => p.id === milkType);
  if (!product) return 0;

  // 1. Calculate milk price based on quantity
  let milkPrice = 0;
  const preset = product.presets.find((p) => p.ml === quantityMl);
  
  if (preset) {
    milkPrice = preset.price;
  } else {
    milkPrice = Math.round(product.pricePerMl * quantityMl);
  }

  // 2. Add dry fruits surcharges
  let dryFruitsSurcharge = 0;
  selectedDryFruits.forEach((dfId) => {
    const option = dryFruits.find((df) => df.id === dfId);
    if (option) {
      dryFruitsSurcharge += option.price;
    }
  });

  return milkPrice + dryFruitsSurcharge;
};
