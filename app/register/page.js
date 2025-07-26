// No 'use client' here, so this is a server component

export const metadata = {
  title: 'Register - 2FA Auth Online',
};

import RegisterClient from './RegisterClient';

export default function RegisterPage() {
  return <RegisterClient />;
}
