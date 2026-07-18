"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bird, Heart, ArrowRight } from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { EditorialGallery } from "@/components/ui/editorial-gallery";
import { FeaturesRopeSection } from "@/components/ui/features-rope-section";
import { AnimatedDekorasi } from "@/components/ui/animated-dekorasi";
import "@fontsource/stack-sans-notch";



export default function LandingPage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (sessionStr) {
      setSession(JSON.parse(sessionStr));
    }
  }, []);

  return (
    <div className="min-h-screen bg-transparent font-sans overflow-x-hidden relative">
      
      {/* MOBILE-ONLY Hero Section (Editorial Full Bleed) */}
      <section className="md:hidden relative w-full h-[100vh] flex flex-col justify-end overflow-hidden bg-[#F8F6F0]">
        {/* Full-Bleed Background Image with Blend Modes */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/images/hero section.png" 
            alt="Pranata Hero Mobile Backdrop" 
            className="w-full h-full object-cover object-top opacity-80" 
          />
          {/* Heavy Gradient Overlay to make text legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/90 to-transparent h-full w-full" />
        </div>

        {/* Text Content - Centered */}
        <div className="relative z-10 w-full px-5 pb-52 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <h1 
              className="text-[2.2rem] sm:text-4xl font-black text-[#1C241E] tracking-tight mb-5 leading-none whitespace-nowrap flex flex-col items-center justify-center"
              
            >
              Empowering farmers with
              <FlipWords 
                duration={3500}
                words={["precision.", "insights.", "analytics."]} 
                className="text-[#3A6B49] bg-clip-text font-black tracking-tighter" 
              />
            </h1>

            <div className="flex flex-col w-full gap-3 mt-4">
              {session ? (
                <>
                  <Link href={session.role === 'PRODUCER' ? '/dashboard' : '/marketplace'} className="w-full">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-pranata text-[#F8F6F0] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 px-6 shadow-[0_8px_20px_rgba(43,76,59,0.3)]"
                    >
                      {session.avatar ? (
                        <img src={session.avatar} alt="PFP" className="w-6 h-6 rounded-full object-cover border-2 border-white/50" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/50 bg-[#3A6B49] flex items-center justify-center text-white text-[11px] font-bold">
                          {(session.fullName || session.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      Lanjut sebagai {session.username}
                    </motion.button>
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("farmpro_session");
                      import("js-cookie").then(Cookies => Cookies.default.remove("auth-token"));
                      window.location.href = "/login";
                    }}
                    className="w-full bg-transparent text-slate-500 border-2 border-slate-300 py-4 rounded-2xl font-bold text-lg flex items-center justify-center"
                  >
                    Use Another Account
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login?mode=register" className="w-full">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-pranata text-[#F8F6F0] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 px-6 shadow-[0_8px_20px_rgba(43,76,59,0.3)]"
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
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* DESKTOP-ONLY Hero Section - Earthy Redesign */}
      <section className="hidden md:flex relative w-full flex-col justify-start pt-16 min-h-[90vh] overflow-hidden bg-[#F8F6F0]">
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-[#1C241E] tracking-tight mb-6 md:mb-8 leading-none whitespace-nowrap flex flex-col items-center justify-center"
              
            >
              Empowering farmers with
              <FlipWords 
                duration={3500}
                words={["beautiful precision.", "actionable insights.", "smart analytics."]} 
                className="text-[#3A6B49] bg-clip-text font-black tracking-tight" 
              />
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4">
              {session ? (
                <>
                  <Link href={session.role === 'PRODUCER' ? '/dashboard' : '/marketplace'} className="w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto bg-pranata hover:bg-[#1E362A] text-[#F8F6F0] px-9 py-4 rounded-full font-bold text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
                    >
                      {session.avatar ? (
                        <img src={session.avatar} alt="PFP" className="w-6 h-6 rounded-full object-cover border-2 border-white/50" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/50 bg-[#3A6B49] flex items-center justify-center text-white text-[11px] font-bold">
                          {(session.fullName || session.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      Lanjut sebagai {session.username}
                      <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("farmpro_session");
                      import("js-cookie").then(Cookies => Cookies.default.remove("auth-token"));
                      window.location.href = "/login";
                    }}
                    className="w-full sm:w-auto bg-white/50 text-[#3F4841] border border-[#D5D0C5] backdrop-blur-sm px-9 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm hover:bg-white"
                  >
                    Use Another Account
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login?mode=register" className="w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto bg-pranata hover:bg-[#1E362A] text-[#F8F6F0] px-9 py-4 rounded-full font-bold text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
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
                </>
              )}
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
          src="/images/hero section.png" 
          alt="Pranata Hero Desktop" 
          className="w-full h-auto rounded-t-[8rem] pointer-events-none object-cover" 
        />
        
        {/* Smooth Gradient Fade to Rope Section */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-[#32452C] pointer-events-none" />
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
        <p>© 2026 Pranata Org. A non-profit initiative.</p>
      </footer>
    </div>
  );
}

