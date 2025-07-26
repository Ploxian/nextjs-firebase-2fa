'use client';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/">
        <span className="font-bold text-xl cursor-pointer">2FA Auth Online</span>
      </Link>

      <div className="space-x-4">
        {!user && (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
