'use client';
import Link from 'next/link';
import { useAuth } from '../components/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4 text-center">
      <div className="max-w-xl bg-white rounded-xl shadow-lg p-10 space-y-8">
        {user ? (
          <>
            <h1 className="text-4xl font-extrabold text-gray-900">Welcome back,</h1>
            <p className="text-xl text-gray-700 mb-6">{user.email}</p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-md shadow-md hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold text-gray-900">Welcome to Online 2FA Authenticator</h1>
            <p className="text-lg text-gray-700 mb-8">
              Secure your accounts with two-factor authentication.
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                href="/login"
                className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
