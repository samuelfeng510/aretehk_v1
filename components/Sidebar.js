'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [clinicName, setClinicName] = useState('Arete');
  const [clinicLogo, setClinicLogo] = useState('');
  const navItemBase = `group flex items-center rounded-xl px-3 py-2 text-lg font-normal transition-all duration-200 ${
    isCollapsed ? 'justify-center' : 'gap-3'
  }`;

  const navHover = 'hover:bg-white/55 hover:shadow-sm hover:ring-1 hover:ring-[#b8926a]/40 hover:-translate-y-0.5';
  const navActive = 'bg-white/70 text-[#3d2813] shadow-sm ring-1 ring-[#b8926a]/40';
  const navInactive = 'text-[#5c4028]';

  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      const { clinicName, clinicLogo } = JSON.parse(savedSettings);
      if (clinicName) setClinicName(clinicName);
      if (clinicLogo) setClinicLogo(clinicLogo);
    }
  }, []);

  // Hide sidebar on registration page
  if (pathname === '/register') return null;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-60 lg:w-72'} bg-gradient-to-b from-[#b8926a] to-[#ede6dd] min-h-screen p-4 ${isCollapsed ? 'flex flex-col items-center' : 'lg:p-6 flex flex-col justify-between'} border-r border-[#dadada] print:hidden text-[#3d2813] transition-all duration-300`}>
      
      <div>
        {/* Collapse Toggle Button */}
        <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-4`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#3d2813] hover:text-[#5c4028] transition p-2"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center mb-10">
          <img src={clinicLogo || "/logo.svg"} alt="Arete Logo" className="w-16 h-auto mb-3 object-contain" />
          {!isCollapsed && (
            <>
              <h1 className="text-xl font-bold uppercase tracking-wider text-[#3d2813]">{clinicName}</h1>

              <p className="text-xs uppercase tracking-widest text-[#5c4028]">Clinical Management</p>
            </>
          )}
        </div>

        <nav className="space-y-4">
          <a href="/" className={`${navItemBase} ${pathname === '/' ? navActive : `${navInactive} ${navHover}`}`} title="Patients">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {!isCollapsed && <span>Patients</span>}
          </a>
          
          <a href="/register" className={`${navItemBase} ${pathname === '/register' ? navActive : `${navInactive} ${navHover}`}`} title="New Registration">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            {!isCollapsed && <span>New Registration</span>}
          </a>

          <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className={`${navItemBase} ${navInactive} ${navHover}`} title="Appointments">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
            {!isCollapsed && <span>Appointments</span>}
          </a>
        </nav>
      </div>

      <div className={`space-y-4 border-t border-[#dadada] pt-6 ${isCollapsed ? 'w-full flex flex-col items-center' : ''}`}>
        <a href="/settings" className={`${navItemBase} ${pathname === '/settings' ? navActive : `${navInactive} ${navHover}`}`} title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          {!isCollapsed && <span>Settings</span>}
        </a>

        <a href="#" className={`${navItemBase} ${navInactive} ${navHover}`} title="Support">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          {!isCollapsed && <span>Support</span>}
        </a>

        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} pt-2`}>
          <div className="w-8 h-8 border border-[#3d2813] rounded-full flex items-center justify-center text-xs font-medium text-[#3d2813] flex-shrink-0">AT</div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-[#3d2813]">Dr. Aris Thorne</p>
              <p className="text-xs text-[#5c4028]">Chief Aesthetician</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

