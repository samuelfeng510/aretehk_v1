import "./globals.css";
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: "Aesthetica Clinical Management",
  description: "Premium clinic management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex font-sans text-[#1a1c1c] bg-[#f9f9f9]">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-10 print:p-0">
          {children}
        </div>
      </body>
    </html>
  );
}
