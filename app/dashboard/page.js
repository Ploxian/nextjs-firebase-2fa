// No 'use client' here - server component

export const metadata = {
  title: 'Dashboard - 2FA Auth Online',
};

import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}
