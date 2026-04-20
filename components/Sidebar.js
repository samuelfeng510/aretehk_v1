'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on registration page
  if (pathname === '/register') return null;

  return (
    <div className="w-60 lg:w-72 bg-gradient-to-b from-[#b8926a] to-[#ede6dd] min-h-screen p-4 lg:p-6 flex flex-col justify-between border-r border-[#dadada] print:hidden text-[#3d2813]">



      <div>
        <div className="flex flex-col items-center mb-10">
          <img src="/logo.svg" alt="Arete Logo" className="w-24 h-auto mb-3 object-contain" />
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#3d2813]">Arete</h1>
          <p className="text-xs uppercase tracking-widest text-[#5c4028]">Clinical Management</p>
        </div>

        <nav className="space-y-4">
          <a href="/" className="flex items-center gap-3 text-lg font-normal text-[#3d2813] hover:text-[#5c4028] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Patients</span>
          </a>
          
          <a href="/register" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            <span>New Registration</span>
          </a>

          <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
            <span>Appointments</span>
          </a>
        </nav>
      </div>

      <div className="space-y-4 border-t border-[#dadada] pt-6">
        <a href="/settings" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>System Settings</span>
        </a>
        <a href="#" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          <span>Support</span>
        </a>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 bg-[#3d2813] rounded-full flex items-center justify-center text-xs font-bold text-white">AT</div>
          <div>
            <p className="text-sm font-medium text-[#3d2813]">Dr. Aris Thorne</p>
            <p className="text-xs text-[#5c4028]">Chief Aesthetician</p>
          </div>
        </div>
      </div>
    </div>
  );
}
