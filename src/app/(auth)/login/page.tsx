import { Metadata } from "next";
import { Logo } from "@/components/common/logo";
import { LoginHero } from "@/components/auth/login-hero";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | ALMS - Accounting & Loan Management System",
  description: "Secure login to your ALMS financial portal.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#0A0A0A] overflow-hidden">
      {/* Left Side: Hero Information */}
      <section className="hidden md:flex md:w-[45%] lg:w-[40%] xl:w-[35%] border-r border-zinc-900 shadow-2xl relative z-10">
        <LoginHero />
      </section>

      {/* Right Side: Form Area */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative bg-[#050505]">
        {/* Background visual element for mobile or subtle enhancement */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-violet-600/5 blur-[100px] rounded-full" />
        </div>

        {/* Mobile Branding (only visible on small screens) */}
        <div className="md:hidden flex items-center gap-2 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
             <Logo variant="light" isLink={true} iconSize={24} textSize="text-xl" />
        </div>

        <div className="relative z-10 w-full">
            <LoginForm />
        </div>

        {/* Footer info for mobile */}
        <div className="md:hidden mt-20 text-center">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">
                Trusted by 500+ Institutions
            </p>
        </div>
      </section>
    </main>
  );
}
