"use client";

import { Logo } from "@/components/common/logo";
import { Activity, Shield, PieChart, Info } from "lucide-react";
import { motion } from "framer-motion";

export const LoginHero = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950 flex flex-col justify-between p-12 lg:p-16">
      {/* ... (background remains the same) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[100px] rounded-full opacity-30" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: `48px 48px`
          }} 
        />
      </div>

      {/* Top Section: Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Logo variant="light" iconSize={28} textSize="text-2xl" />
      </motion.div>

      {/* Middle Section: Abstract Visual */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="max-w-md"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6">
            The standard for <br/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              financial operations.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 font-sans leading-relaxed">
            Experience the next level of ALM automation. Our secure, end-to-end accounting platform is built for speed and enterprise precision.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, label: "Bank-grade Security" },
              { icon: Activity, label: "Real-time Analytics" },
              { icon: PieChart, label: "Automated Triggers" },
              { icon: Info, label: "Detailed Reporting" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <feature.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-zinc-300">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Footer-ish */}
      <div className="relative z-10">
        <div className="flex gap-4 items-center">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                Trusted by 500+ Institutions
            </p>
        </div>
      </div>
    </div>
  );
};
