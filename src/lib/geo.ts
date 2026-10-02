import { SERVICE_AREA_LABEL } from '@/lib/delivery';

/** Phase 7, Mohali — tune radius if needed after field testing */
export const SERVICE_CENTER_LAT = 30.7046;
export const SERVICE_CENTER_LNG = 76.7179;
export const SERVICE_RADIUS_KM = 2.5;

export { SERVICE_AREA_LABEL };

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isInsideServiceArea(lat: number, lng: number): boolean {
  return haversineKm(lat, lng, SERVICE_CENTER_LAT, SERVICE_CENTER_LNG) <= SERVICE_RADIUS_KM;
}
