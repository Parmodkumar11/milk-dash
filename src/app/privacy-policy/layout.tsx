import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'HopInMohali Privacy Policy — how we collect and protect your name, WhatsApp number, delivery pin, and nearby-shop request details in Phase 7, Mohali.',
  openGraph: {
    title: 'Privacy Policy | HopInMohali',
    description:
      'How HopInMohali handles your contact details, map pin, and shopping list for nearby delivery.',
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
