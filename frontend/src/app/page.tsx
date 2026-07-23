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
      
      {/* Unified Responsive Hero Section */}
      <section className="relative w-full flex flex-col justify-start pt-10 sm:pt-16 min-h-[70vh] md:min-h-[90vh] overflow-hidden bg-[#F8F6F0]">
        {/* Soft Organic Background Gradients */}
        <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[#E8E3D2]/40 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#DDE2D6]/50 rounded-full blur-[60px] sm:blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        {/* Text Content Container */}
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center mb-8 md:mb-12 pb-6 md:pb-12 px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="relative flex flex-col items-center justify-center w-full will-change-transform will-change-opacity"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-[#1C241E] tracking-tight mb-5 md:mb-8 leading-tight flex flex-col items-center justify-center text-center">
              Empowering farmers with
              <FlipWords 
                duration={3500}
                words={["precision.", "actionable insights.", "smart analytics."]} 
                className="text-[#3A6B49] bg-clip-text font-black tracking-tight" 
              />
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-4 w-full sm:w-auto">
              {session ? (
                <>
                  <Link href={session.role === 'PRODUCER' ? '/hub' : '/market'} className="w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto bg-pranata hover:bg-[#1E362A] text-[#F8F6F0] px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-base sm:text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
                    >
                      {session.avatar ? (
                        <img src={session.avatar} alt="PFP" className="w-6 h-6 rounded-full object-cover border-2 border-white/50" loading="lazy" decoding="async" />
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
                    className="w-full sm:w-auto bg-white/50 text-[#3F4841] border border-[#D5D0C5] backdrop-blur-sm px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm hover:bg-white"
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
                      className="w-full sm:w-auto bg-pranata hover:bg-[#1E362A] text-[#F8F6F0] px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-base sm:text-lg shadow-[0_12px_24px_-8px_rgba(43,76,59,0.4)] transition-all flex items-center justify-center gap-3 group"
                    >
                      Create Account
                      <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto bg-white/50 text-[#3F4841] border border-[#D5D0C5] backdrop-blur-sm px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl sm:rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
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

      {/* Breakout Hero Image Section (Cleanly stacked on mobile, breakout negative-margin on desktop) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.1, delay: 0.1 }}
        className="relative w-full flex items-center justify-center mt-2 sm:mt-4 md:-mt-[19rem] z-20 pointer-events-none overflow-visible px-0 sm:px-4"
      >
        <img 
          src="/images/hero_section.webp" 
          alt="Pranata Hero" 
          className="w-full h-auto rounded-t-[2.5rem] sm:rounded-t-[4rem] md:rounded-t-[8rem] pointer-events-none object-cover shadow-2xl" 
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Smooth Gradient Fade to Rope Section */}
        <div className="absolute bottom-0 left-0 w-full h-32 sm:h-48 md:h-64 bg-gradient-to-b from-transparent to-[#32452C] pointer-events-none" />
      </motion.div>

      {/* Rope Features Section */}
      <FeaturesRopeSection />

      {/* Seamless Editorial Testimonials Gallery */}
      <section className="relative z-10 w-full" style={{ padding: 0, margin: 0 }}>
        <EditorialGallery />
      </section>

      {/* Global Network Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 relative bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div 
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-rust rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-vibrant/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 sm:mb-6">
                Ready to transform your farm?
              </h2>
              <p className="text-slate-400 font-medium text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-8 sm:mb-10 px-0">
                Join our non-profit initiative to digitalize local agriculture. Setup takes less than 5 minutes and is completely free forever.
              </p>
              <Link href="/hub">
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
      <footer className="bg-sage border-t border-olive/30 py-8 sm:py-12 px-4 text-center text-forest font-bold">
        <p>© 2026 Pranata Org. A non-profit initiative.</p>
      </footer>
    </div>
  );
}

