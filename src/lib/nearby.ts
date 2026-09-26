import { NearbyRequestStatus } from '@/types/nearby';

export const NEARBY_RADIUS_KM = 5;
export const NEARBY_PROCUREMENT_FEE = 19;
export const NEARBY_DELIVERY_FEE = 19;

export const NEARBY_AREA_NAME = 'Phase 7, Mohali';
export const NEARBY_DEFAULT_LAT = 30.7046;
export const NEARBY_DEFAULT_LNG = 76.7179;

export const NEARBY_SUGGESTIONS = [
  // 'Lunch',
  'Bread',
  'Eggs',
  'Medicines',
  'Bottled water',
  'Soap',
  'Notebook',
  'Fruits',
];

export const NEARBY_STATUSES: { id: NearbyRequestStatus; label: string; detail: string }[] = [
  { id: 'received', label: 'Request Received', detail: 'We have your list and will start shortly.' },
  { id: 'shopping', label: 'Shopping in Progress', detail: 'A shopper is buying your items nearby.' },
  { id: 'purchased', label: 'Items Purchased', detail: 'Items are billed at the shop’s actual price.' },
  { id: 'out_for_delivery', label: 'Out for Delivery', detail: 'On the way to your room or home.' },
  { id: 'delivered', label: 'Delivered', detail: 'Handed over at your delivery point.' },
];

export function parseEstimatedCost(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
}

export function sumEstimatedItems(costs: string[]): number {
  return costs.reduce((sum, cost) => sum + parseEstimatedCost(cost), 0);
}


export const calculateNearbyServiceFee = (
  totalQuantity: number
): number => {
  const quantity = Math.max(1, totalQuantity);

  return quantity * 5;
};