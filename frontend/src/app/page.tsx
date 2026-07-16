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
      
      {/* Public Navbar - Floating Glass Pill (Desktop) */}
      <motion.div 
        style={{ y: navY, opacity: navOpacity, willChange: "transform, opacity" }}
        className="hidden md:flex fixed top-6 sm:top-10 inset-x-0 z-50 justify-center w-full px-4 sm:px-6 pointer-events-none"
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

      {/* Mobile Bottom Navbar */}
      <motion.div 
        style={{ y: navY, opacity: navOpacity, willChange: "transform, opacity" }}
        className="md:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center w-full px-4 pointer-events-none"
      >
        <nav className="w-full max-w-sm overflow-clip pointer-events-auto bg-white/70 backdrop-blur-3xl backdrop-saturate-150 border border-white/80 rounded-full shadow-[0_-20px_40px_-10px_rgba(14,165,233,0.15),0_0_20px_rgba(255,255,255,0.5)_inset]">
          <div className="px-6 h-16 flex items-center justify-between">
            <Link href="#features" className="flex flex-col items-center gap-1 text-slate-500 hover:text-sky-600 transition-colors">
              <span className="text-[11px] font-bold">Platform</span>
            </Link>
            <div className="w-14 h-14 bg-gradient-to-br from-[#2B4C3B] to-[#4A7C59] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/80 -mt-6">
              <Bird size={24} strokeWidth={2.5} />
            </div>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-500 hover:text-sky-600 transition-colors">
              <span className="text-[11px] font-bold">Log In</span>
            </Link>
          </div>
        </nav>
      </motion.div>

      {/* MOBILE-ONLY Hero Section (Editorial Full Bleed) */}
      <section className="md:hidden relative w-full h-[100vh] flex flex-col justify-end overflow-hidden bg-[#F8F6F0]">
        {/* Full-Bleed Background Image with Blend Modes */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/hero section.png" 
            alt="FarmPro Hero Mobile Backdrop" 
            className="w-full h-full object-cover object-top opacity-80" 
          />
          {/* Heavy Gradient Overlay to make text legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/90 to-transparent h-full w-full" />
        </div>

        {/* Text Content - Bottom Left Anchored */}
        <div className="relative z-10 w-full px-5 pb-32 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <h1 
              className="text-[3.25rem] font-black text-[#1C241E] tracking-tighter mb-5 leading-[0.95]"
              style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}
            >
              Empowering <br /> farmers with <br />
              <FlipWords 
                duration={3500}
                words={["precision.", "insights.", "analytics."]} 
                className="text-[#3A6B49] bg-clip-text -ml-2 font-black tracking-tighter" 
              />
            </h1>

            <p className="text-lg text-[#5A635B] font-medium max-w-[85%] mb-8 leading-tight">
              Enterprise-grade analytics & AI-driven insights for local farmers at zero cost.
            </p>

            <div className="flex flex-col w-full gap-3">
              <Link href="/register" className="w-full">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#2B4C3B] text-[#F8F6F0] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 px-6 shadow-[0_8px_20px_rgba(43,76,59,0.3)]"
                >
                  Create Account 
                  <ArrowRight size={20} strokeWidth={2.5} />
                </motion.button>
              </Link>
              <Link href="/login" className="w-full">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-transparent text-[#2B4C3B] border-2 border-[#2B4C3B] py-4 rounded-2xl font-bold text-lg flex items-center justify-center"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DESKTOP-ONLY Hero Section - Earthy Redesign */}
      <section className="hidden md:flex relative w-full flex-col justify-start pt-28 min-h-[90vh] overflow-hidden bg-[#F8F6F0]">
        {/* Soft Organic Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E8E3D2]/40 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DDE2D6]/50 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-[#F1EBE1]/30 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Text Content Container */}
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center px-4 sm:px-6 mb-12 pb-12">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="relative flex flex-col items-center justify-center w-full"
          >
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-[#1C241E] tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]"
              style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}
            >
              Empowering farmers with <br />
              <FlipWords 
                duration={3500}
                words={["beautiful precision.", "actionable insights.", "smart analytics."]} 
                className="text-[#3A6B49] bg-clip-text -ml-2 font-black tracking-tight" 
              />
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#5A635B] font-medium max-w-2xl mb-8 md:mb-10 leading-relaxed mx-auto">
              A non-profit initiative bringing enterprise-grade analytics, AI-driven insights, and seamless inventory tracking to local farmers at zero cost.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-[#2B4C3B] hover:bg-[#1E362A] text-[#F8F6F0] px-9 py-4 rounded-full font-bold text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
                >
                  Register Account
                  <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white/50 text-[#3F4841] border border-[#D5D0C5] backdrop-blur-sm px-9 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DESKTOP-ONLY Breakout Hero Image (Extreme widths and negative margins) */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.1, delay: 0.2 }}
        className="hidden md:flex relative w-full items-center justify-center -mt-[19rem] z-20 pointer-events-none overflow-visible"
      >
        <img 
          src="/hero section.png" 
          alt="FarmPro Hero Desktop" 
          className="w-[220vw] max-w-[6000px] min-w-[2000px] h-auto drop-shadow-[0_50px_100px_rgba(0,0,0,0.2)] rounded-t-[8rem] pointer-events-none translate-x-8" 
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

