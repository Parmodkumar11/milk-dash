import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile & Order History',
  description:
    'View and manage your profile, saved delivery address, and past milk order history on DairyDash.',
  openGraph: {
    title: 'My Profile & Order History | DairyDash',
    description:
      'Manage your profile, saved address, and view your past milk delivery orders on DairyDash.',
  },
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
