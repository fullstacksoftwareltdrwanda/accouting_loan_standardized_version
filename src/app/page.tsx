import Image from "next/image";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Laptop, Clock, PieChart, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#050505] selection:bg-indigo-100 dark:selection:bg-indigo-900/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-white/70 dark:bg-[#050505]/70 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ALMS<span className="text-indigo-600">.</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors dark:text-zinc-400 dark:hover:text-indigo-400 font-sans">Features</a>
          <a href="#solutions" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors dark:text-zinc-400 dark:hover:text-indigo-400 font-sans">Solutions</a>
          <a href="#about" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors dark:text-zinc-400 dark:hover:text-indigo-400 font-sans">About</a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-all rounded-full dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all rounded-full shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 dark:bg-violet-900/10 blur-[120px] rounded-full -z-10" />

        <section className="flex flex-col items-center text-center pt-24 pb-32 px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 dark:bg-indigo-900/20 dark:border-indigo-800/40 dark:text-indigo-300">
            <Zap className="w-3 h-3 fill-current" />
            Standardized Accounting Solution
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-8 font-sans">
            Managing Loans and <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Automated Accounting
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed font-sans">
            The next generation Accounting & Loan Management System (ALMS). 
            Empower your financial operations with precision, automation, and real-time clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both delay-300">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-xl shadow-black/5"
            >
              Access Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#learn-more"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-transparent dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900 shadow-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Abstract Dashboard Mockup Frame */}
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 shadow-2xl animate-in zoom-in-95 duration-1000 fill-mode-both delay-500">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 h-[300px] md:h-[450px]">
              <div className="col-span-2 rounded-xl bg-white dark:bg-zinc-800 overflow-hidden shadow-sm flex flex-col p-6">
                <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-700 rounded mb-8"></div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/20 p-4">
                    <div className="h-2 w-16 bg-indigo-200 dark:bg-indigo-800 rounded mb-4"></div>
                    <div className="h-8 w-24 bg-indigo-600 dark:bg-indigo-500 rounded-lg"></div>
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-100 dark:border-violet-900/20 p-4">
                    <div className="h-2 w-16 bg-violet-200 dark:bg-violet-800 rounded mb-4"></div>
                    <div className="h-8 w-24 bg-violet-600 dark:bg-violet-500 rounded-lg"></div>
                  </div>
                  <div className="col-span-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col justify-end">
                    <div className="flex items-end gap-1 h-32">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm hidden md:flex flex-col">
                <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-700 rounded mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-2 w-full bg-zinc-50 dark:bg-zinc-900 rounded"></div>
                        <div className="h-2 w-2/3 bg-zinc-50 dark:bg-zinc-900 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32 border-t border-zinc-100 dark:border-zinc-900">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Everything you need</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl mx-auto">One platform for your entire financial workflow. No more scattered data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure & Compliant", desc: "Built with bank-grade security and full compliance standards for financial auditing." },
              { icon: Laptop, title: "Modern Interface", desc: "A sleek, intuitive dashboard designed for speed and productivity." },
              { icon: Clock, title: "Automated Triggers", desc: "Automatic penalty calculations and interest accruals without manual intervention." },
              { icon: PieChart, title: "Deep Analytics", desc: "Powerful reporting tools that provide crystal clear insights into your portfolio health." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-6 py-32">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-12 md:p-20 text-center">
            <div className="absolute top-0 right-0 p-8 text-white/10">
              <Zap className="w-64 h-64 rotate-12 stroke-[0.2]" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 relative z-10">
              Ready to unify your <br className="hidden md:block" /> accounting work?
            </h2>
            <p className="text-indigo-100 text-lg mb-12 max-w-xl mx-auto relative z-10">
              Join dozens of financial institutions using ALMS to streamline their loan management.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-[0.98] shadow-2xl relative z-10"
            >
              Create Account Today
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-zinc-100 dark:border-zinc-900 py-16 px-6 bg-zinc-50/80 dark:bg-zinc-950/80">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <BarChart3 className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight dark:text-white">ALMS.</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs font-sans">
                The standardized accounting and loan management ecosystem built for the modern era.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 font-sans">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">Documentation</a></li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">API Reference</a></li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 font-sans">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 transition-colors font-sans">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400 font-sans uppercase tracking-widest whitespace-nowrap">
              © {new Date().getFullYear()} ALMS Standardized Version. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
