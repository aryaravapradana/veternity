"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { Bird, Heart, ArrowRight } from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { EditorialGallery } from "@/components/ui/editorial-gallery";
import { FeaturesRopeSection } from "@/components/ui/features-rope-section";
import { AnimatedDekorasi } from "@/components/ui/animated-dekorasi";
import "@fontsource/stack-sans-notch";



export default function LandingPage() {
  const { scrollY } = useScroll();
  
  // PERFORMANCE: Bypass React state (useState) and Main Thread interrupts entirely!
  // Map scroll values directly to style values on the compositor thread.
  const rawNavY = useTransform(scrollY, [120, 150], [-150, 0], { clamp: true });
  const navY = useSpring(rawNavY, { stiffness: 300, damping: 25, bounce: 0.2 });
  const navOpacity = useTransform(scrollY, [120, 150], [0, 1], { clamp: true });

  return (
    <div className="min-h-screen bg-transparent font-sans overflow-x-hidden relative">
      
      {/* Public Navbar - Floating Glass Pill */}
      <motion.div 
        style={{ y: navY, opacity: navOpacity, willChange: "transform, opacity" }}
        className="fixed top-6 sm:top-10 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none"
      >
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
      </motion.div>

      {/* Hero Section - Earthy Redesign */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden bg-[#F8F6F0]">
        {/* Soft Organic Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E8E3D2]/40 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DDE2D6]/50 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-[#F1EBE1]/30 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center pt-32 pb-12">
          
          {/* Text Content - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="relative flex flex-col items-center justify-center w-full"
          >
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md text-[#2B4C3B] font-semibold text-sm border border-[#E2DCD0] shadow-[0_8px_16px_-6px_rgba(43,76,59,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A7C59] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3A6B49]"></span>
                </span>
                Free for all MSME Farmers
              </span>
            </div>

            <h1 
              className="text-5xl md:text-6xl lg:text-[5rem] font-bold text-[#1C241E] tracking-tight mb-8 leading-[1.05]"
              style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}
            >
              Empowering farmers with <br className="hidden md:block" />
              <FlipWords 
                duration={3500}
                words={["beautiful precision.", "actionable insights.", "smart analytics."]} 
                className="text-[#3A6B49] bg-clip-text -ml-2 font-black tracking-tight" 
              />
            </h1>

            <p className="text-lg md:text-xl text-[#5A635B] font-medium max-w-2xl mb-10 leading-relaxed mx-auto">
              A non-profit initiative bringing enterprise-grade analytics, AI-driven insights, and seamless inventory tracking to local farmers at zero cost.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-[#2B4C3B] hover:bg-[#1E362A] text-[#F8F6F0] px-9 py-4 rounded-full font-bold text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
                >
                  Join the Initiative 
                  <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/test" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white/50 text-[#3F4841] border border-[#D5D0C5] backdrop-blur-sm px-9 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  Test Transition 🚀
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full-width Hero Image breaking out of section constraints */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.1, delay: 0.2 }}
        className="relative w-full flex items-center justify-center -mt-20 z-20 pointer-events-none"
      >
        <img 
          src="/hero section.png" 
          alt="FarmPro Hero" 
          className="w-full max-w-[140000px] h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-l border-r border-[#E8E3D2]/50 pointer-events-auto" 
        />
      </motion.div>

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

