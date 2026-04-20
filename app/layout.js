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
        <div className="w-64 bg-[#F3F0E2] min-h-screen p-6 flex flex-col justify-between border-r border-[#dadada]">
          <div>
            <div className="mb-10">
              <h1 className="text-xl font-bold uppercase tracking-wider text-[#1a1c1c]">Aesthetica</h1>
              <p className="text-xs uppercase tracking-widest text-[#605f54]">Clinical Management</p>
            </div>

            <nav className="space-y-4">
              <a href="/" className="flex items-center gap-3 text-sm font-medium text-[#1a1c1c] hover:text-[#605f54] transition">
                <span>👥</span> Patients
              </a>
              <a href="#" className="flex items-center gap-3 text-sm font-medium text-[#605f54] hover:text-[#1a1c1c] transition">
                <span>📅</span> Appointments <span className="text-xs text-[#79776f] ml-1">(Coming Soon)</span>
              </a>

              <a href="#" className="flex items-center gap-3 text-sm font-medium text-[#605f54] hover:text-[#1a1c1c] transition">
                <span>💳</span> Billing
              </a>
            </nav>

            {/* Quick Consultation button removed */}

          </div>

          <div className="space-y-4 border-t border-[#dadada] pt-6">
            <a href="#" className="flex items-center gap-3 text-sm font-medium text-[#605f54] hover:text-[#1a1c1c] transition">
              <span>⚙️</span> System Settings
            </a>
            <a href="#" className="flex items-center gap-3 text-sm font-medium text-[#605f54] hover:text-[#1a1c1c] transition">
              <span>❓</span> Support
            </a>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 bg-[#dadada] rounded-full flex items-center justify-center text-xs font-bold text-[#605f54]">AT</div>
              <div>
                <p className="text-sm font-medium text-[#1a1c1c]">Dr. Aris Thorne</p>
                <p className="text-xs text-[#79776f]">Chief Aesthetician</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </body>
    </html>
  );
}
