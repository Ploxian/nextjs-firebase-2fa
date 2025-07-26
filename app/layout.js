import './globals.css';
import { AuthProvider } from '../components/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Welcome to Online 2FA Authenticator',
  description: 'Secure your accounts with our Online 2FA Authenticator. Generate time-based one-time passwords quickly and easily for enhanced security.',
  keywords: ['2FA', 'two factor authentication', 'authenticator app', 'online 2FA', 'OTP generator', 'secure login', 'multi-factor authentication'],
  authors: [{ name: 'Rayhan Sardar' }],
  openGraph: {
    title: 'Welcome to Online 2FA Authenticator',
    description: 'Secure your accounts with our Online 2FA Authenticator. Generate time-based one-time passwords quickly and easily for enhanced security.',
    url: 'https://otp.kha.icu',
    siteName: 'Online 2FA Authenticator',
    images: [
      {
        url: 'https://otp.kha.icu/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Online 2FA Authenticator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Online 2FA Authenticator',
    description: 'Secure your accounts with our Online 2FA Authenticator. Generate time-based one-time passwords quickly and easily for enhanced security.',
    images: ['https://otp.kha.icu/og-image.png'],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
