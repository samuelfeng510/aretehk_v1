import "./globals.css";
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: "Aesthetica Clinical Management",
  description: "Premium clinic management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex font-sans text-[#1a1c1c] bg-[#f9f9f9]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
