// No 'use client' here, so this is a server component

export const metadata = {
  title: 'Login - 2FA Auth Online',
};

import LoginClient from './LoginClient';

export default function LoginPage() {
  return <LoginClient />;
}
