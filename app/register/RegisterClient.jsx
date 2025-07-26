'use client';
import { useAuth } from '../../components/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { useState, useEffect } from 'react';

export default function RegisterClient() {
  const { user } = useAuth();
  const router = useRouter();
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 to-indigo-300 px-4">
      <form
        onSubmit={register}
        className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 space-y-6"
        aria-label="Register Form"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Create Account</h1>
        <p className="text-center text-gray-600">Start your journey with us</p>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold shadow-md transition
            ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            }`}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
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
