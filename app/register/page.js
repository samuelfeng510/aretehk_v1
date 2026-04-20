'use client';
import RegistrationForm from "@/components/RegistrationForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleExit = () => {
    const pin = prompt("Enter Staff PIN to exit registration:");
    if (pin === "0000") {
      router.push("/");
    } else if (pin !== null) {
      alert("Incorrect PIN");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto mb-6">
        <button 
          onClick={handleExit}
          className="text-xs uppercase tracking-[0.08em] font-medium text-[#3d2813] hover:text-[#5c4028] underline transition"
        >
          ← Return to Portal
        </button>
      </div>
      <RegistrationForm />
    </div>
  );
}


