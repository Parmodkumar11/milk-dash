import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "Read DairyDash's Privacy Policy — how we collect, use, and protect your personal information when you order fresh milk with us.",
  openGraph: {
    title: 'Privacy Policy | DairyDash',
    description:
      "DairyDash's Privacy Policy — how we handle your name, phone number, and delivery details responsibly and transparently.",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
