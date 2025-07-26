'use client';
import { useAuth } from '../../components/AuthContext';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { encrypt, decrypt } from '../../lib/crypto';
import { authenticator } from 'otplib';
import { useRouter } from 'next/navigation';

export default function DashboardClient() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [entries, setEntries] = useState([]);
  const [label, setLabel] = useState('');
  const [issuer, setIssuer] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, `users/${user.uid}/2faCodes`);
    return onSnapshot(ref, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(list);
    });
  }, [user]);

  const add = async (e) => {
    e.preventDefault();
    if (!label.trim() || !secret.trim()) return;
    setLoading(true);
    try {
      const { cipher, iv } = await encrypt(secret.trim(), user.uid);
      await addDoc(collection(db, `users/${user.uid}/2faCodes`), {
        label: label.trim(),
        issuer: issuer.trim() || '',
        cipher,
        iv,
      });
      setLabel('');
      setIssuer('');
      setSecret('');
    } catch (err) {
      alert('Failed to add 2FA entry');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this 2FA entry?')) return;
    await deleteDoc(doc(db, `users/${user.uid}/2faCodes/${id}`));
  };

  const handleLogout = async () => {
    await signOut(auth);
    // Redirect handled by useEffect
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg mt-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">2FA Dashboard</h1>

      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-full sm:col-span-1"
          required
        />
        <input
          type="text"
          placeholder="Issuer (optional)"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-full sm:col-span-1"
        />
        <input
          type="text"
          placeholder="Base32 Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-full sm:col-span-1"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-2 sm:mt-0 sm:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition disabled:bg-indigo-400 disabled:cursor-not-allowed`}
        >
          {loading ? 'Adding...' : 'Add 2FA Entry'}
        </button>
      </form>

      <section className="space-y-6">
        {entries.length === 0 ? (
          <p className="text-center text-gray-400 italic">No 2FA entries yet.</p>
        ) : (
          entries.map((item) => (
            <TOTPItem key={item.id} item={item} uid={user.uid} onDelete={() => remove(item.id)} />
          ))
        )}
      </section>
    </div>
  );
}

function TOTPItem({ item, uid, onDelete }) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval;
    const run = async () => {
      const rawSecret = await decrypt(item.cipher, item.iv, uid);
      const secret = rawSecret.trim().toUpperCase();
      const updateCode = () => setCode(authenticator.generate(secret));
      updateCode();
      interval = setInterval(updateCode, 1000);
    };
    run();
    return () => clearInterval(interval);
  }, [item, uid]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore or handle error
    }
  };

  return (
    <div
      className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-default select-none"
      role="region"
      aria-label={`2FA entry for ${item.label}`}
    >
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900">{item.label}</span>
        {item.issuer && <span className="text-sm text-gray-500 italic">Issuer: {item.issuer}</span>}
        <span
          onClick={copyToClipboard}
          className="mt-1 text-2xl font-mono text-green-600 cursor-pointer select-text hover:text-green-800 transition relative"
          title="Click to copy OTP"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') copyToClipboard();
          }}
          aria-label={`One-time password for ${item.label}, click to copy`}
        >
          {code}
          {copied && (
            <span className="absolute -top-6 left-0 text-xs text-green-700 font-semibold animate-fade-in">
              Copied!
            </span>
          )}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="ml-4 text-red-500 hover:text-red-700 font-semibold transition"
        aria-label={`Delete 2FA entry for ${item.label}`}
      >
        Delete
      </button>
    </div>
  );
}
