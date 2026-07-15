"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bird, Heart, Sprout, ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AnimatedTestimonialsDemo from "@/components/AnimatedTestimonialsDemo";
import { FlipWords } from "@/components/ui/flip-words";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { EditorialGallery } from "@/components/ui/editorial-gallery";
import { FeaturesRopeSection } from "@/components/ui/features-rope-section";
import { AnimatedLogomark } from "@/components/ui/animated-logomark";
import "@fontsource/stack-sans-notch";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent font-sans overflow-x-hidden relative">
      {/* Public Navbar - Floating Glass Pill */}
      <div className="fixed top-6 sm:top-10 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none">
        <nav className="w-full max-w-5xl overflow-clip pointer-events-auto bg-white/60 backdrop-blur-3xl backdrop-saturate-150 border border-white/80 rounded-full shadow-[0_20px_40px_-10px_rgba(14,165,233,0.15),0_0_20px_rgba(255,255,255,0.5)_inset]">
          <div className="px-2 sm:px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-sm border border-white/50">
                <Bird size={22} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-lg text-slate-50 hidden sm:block">FarmPro Org</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-slate-200 font-bold text-sm">
              <Link href="#features" className="hover:text-sky-600 transition-colors">Platform</Link>
              <Link href="#impact" className="hover:text-sky-600 transition-colors">Our Impact</Link>
              <Link href="#about" className="hover:text-sky-600 transition-colors">About Us</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-slate-200 font-bold text-sm hover:text-sky-600 transition-colors">
                Log in
              </Link>
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-slate-800/20 border border-slate-700"
                >
                  Access Platform
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen max-h-[900px] min-h-[600px] flex flex-col justify-center px-6 overflow-hidden">
        <ShaderAnimation className="absolute inset-0 z-0 pointer-events-none opacity-80" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative text-left"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-emerald-600 font-bold text-sm mb-6 puffy-shadow border border-white relative z-10">
              <Heart size={16} fill="currentColor" /> Free for all MSME Farmers
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-50 tracking-normal mb-6 leading-[1.15] max-w-full drop-shadow-xl relative z-10"
              style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}
            >
              <span className="whitespace-nowrap">Empowering farmers with</span> <br className="hidden md:block" />
              <FlipWords 
                duration={3000}
                words={["beautiful precision.", "actionable insights.", "smart analytics."]} 
                className="text-vibrant drop-shadow-md -ml-2" 
              />
            </h1>
            <p className="text-sm md:text-base text-slate-200 font-medium max-w-lg mb-8 leading-relaxed drop-shadow-sm bg-slate-800/60 backdrop-blur-md p-4 rounded-3xl border border-slate-700/80 relative z-10">
              A non-profit initiative bringing enterprise-grade analytics, AI-driven insights, and seamless inventory tracking to local farmers at zero cost.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-sky-500 text-white px-8 py-4 rounded-full font-extrabold text-lg shadow-xl shadow-sky-200 flex items-center justify-center gap-2"
                >
                  Join the Initiative <ArrowRight size={20} strokeWidth={3} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Logomark on the Right */}
          <div className="relative hidden lg:flex items-center justify-center h-full w-full pointer-events-none">
            <AnimatedLogomark className="absolute top-1/2 -translate-y-1/2 -right-16 xl:-right-10 w-[450px] xl:w-[550px] max-w-none h-auto drop-shadow-2xl" />
          </div>
        </div>
      </section>


      {/* Rope Features Section */}
      <FeaturesRopeSection />

      {/* Seamless Editorial Testimonials Gallery */}
      <section className="relative z-10 w-full" style={{ padding: 0, margin: 0 }}>
        <EditorialGallery />
      </section>

      {/* Global Network Section */}
      <section className="py-24 px-6 relative bg-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-rust rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-vibrant/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Ready to transform your farm?
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto mb-10">
                Join our non-profit initiative to digitalize local agriculture. Setup takes less than 5 minutes and is completely free forever.
              </p>
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-vibrant text-white px-10 py-4 rounded-full font-extrabold text-lg shadow-xl"
                >
                  Create Organization
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-sage border-t border-olive/30 py-12 text-center text-forest font-bold">
        <p>© 2026 FarmPro Org. A non-profit initiative.</p>
      </footer>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
