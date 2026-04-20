import "./globals.css";

export const metadata = {
  title: "Aesthetica Clinical Management",
  description: "Premium clinic management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex font-sans text-[#1a1c1c] bg-[#f9f9f9]">
        {/* Sidebar */}
        <div className="w-72 bg-gradient-to-b from-[#b8926a] to-[#ede6dd] min-h-screen p-6 flex flex-col justify-between border-r border-[#dadada] print:hidden text-[#3d2813]">

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
              <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                <span>Appointments</span>
              </a>
            </nav>

            {/* Quick Consultation button removed */}

          </div>

          <div className="space-y-4 border-t border-[#dadada] pt-6">
            <a href="/settings" className="flex items-center gap-3 text-lg font-normal text-[#5c4028] hover:text-[#3d2813] transition">

              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-10 print:p-0">
          {children}
        </div>
      </body>
    </html>
  );
}
