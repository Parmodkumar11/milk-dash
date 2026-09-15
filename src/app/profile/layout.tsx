import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your profile and saved delivery address on HopInMohali.',
  openGraph: {
    title: 'My Profile | HopInMohali',
    description: 'Manage your profile and saved address on HopInMohali.',
  },
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
