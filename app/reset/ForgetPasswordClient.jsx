'use client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 to-indigo-300 px-4">
      <form
        onSubmit={resetPassword}
        className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 space-y-6"
        aria-label="Forget Password Form"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-4">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold shadow-md transition
            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}`}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {message && (
          <p className="text-green-600 text-center font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
