import RegistrationForm from "@/components/RegistrationForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/" className="text-xs uppercase tracking-widest text-[#605f54] hover:text-[#1a1c1c] underline transition">
          ← Return to Portal
        </Link>
      </div>
      <RegistrationForm />
    </div>
  );
}

