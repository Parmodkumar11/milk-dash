import ComingSoon from '@/components/common/ComingSoon';
import { MILK_ENABLED } from '@/lib/features';

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  if (!MILK_ENABLED) return <ComingSoon title="Milk delivery" />;
  return <>{children}</>;
}
