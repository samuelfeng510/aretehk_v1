'use client';

import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f9f9f9] font-sans text-[#1a1c1c]">
      <div className="bg-[#ffffff] p-12 border border-[#dadada] w-full max-w-md text-center space-y-8 rounded-md">
        <header className="space-y-2">
          <h1 className="text-3xl font-serif font-light text-[#1a1c1c]">ARETE</h1>
          <p className="text-xs uppercase tracking-widest text-[#605f54]">Clinical Management System</p>
        </header>

        <div className="border-t border-[#dadada] pt-8">
          <p className="text-sm text-[#79776f] mb-6">Access restricted to authorized clinic staff.</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full bg-[#1a1c1c] text-white text-xs uppercase tracking-widest font-medium py-4 px-6 hover:bg-[#2c2d2d] transition duration-200 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              'Signing in...'
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <footer className="text-[10px] uppercase tracking-wider text-[#c9c6bd] pt-4">
          Protected by Firebase Authentication
        </footer>
      </div>
    </div>
  );
}
