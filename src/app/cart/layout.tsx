import ComingSoon from '@/components/common/ComingSoon';
import { MILK_ENABLED } from '@/lib/features';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  if (!MILK_ENABLED) return <ComingSoon title="Milk cart" />;
  return <>{children}</>;
}
