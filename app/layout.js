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
              <a href="/" className="flex items-center gap-3 text-lg font-medium text-[#3d2813] hover:text-[#5c4028] transition">
                <span>👥</span> Patients
              </a>
              <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-[#5c4028] hover:text-[#3d2813] transition">
                <span>📅</span> Appointments

              </a>
            </nav>

            {/* Quick Consultation button removed */}

          </div>

          <div className="space-y-4 border-t border-[#dadada] pt-6">
            <a href="/settings" className="flex items-center gap-3 text-lg font-medium text-[#5c4028] hover:text-[#3d2813] transition">
              <span>⚙️</span> System Settings
            </a>
            <a href="#" className="flex items-center gap-3 text-lg font-medium text-[#5c4028] hover:text-[#3d2813] transition">
              <span>❓</span> Support
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
