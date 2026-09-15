import ComingSoon from '@/components/common/ComingSoon';
import { MILK_ENABLED } from '@/lib/features';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  if (!MILK_ENABLED) return <ComingSoon title="Fresh milk ordering" />;
  return <>{children}</>;
}
