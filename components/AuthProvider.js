'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email || '';
        const allowedDomains = ['samuelfeng.altostrat.com', 'aretehk.com', 'gcloudevent.com'];
        const isAllowed = allowedDomains.some(domain => email.endsWith(`@${domain}`));
        
        if (!isAllowed) {
          alert('Access Denied: Your email domain is not authorized.');
          await auth.signOut();
          return;
        }
        setUser(user);
      } else {
        setUser(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-xs uppercase tracking-widest text-[#605f54]">Loading Session...</div>
      </div>
    );
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10 print:p-0">
        {children}
      </div>
    </>
  );
}
