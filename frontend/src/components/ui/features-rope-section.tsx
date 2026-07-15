"use client"

import React, { useRef, useEffect } from "react"
import { GlobalRope } from "./global-rope"
import { motion } from "framer-motion"
import { AnimatedTractorGraphic } from "./animated-graphic"
import { AnimatedFeatureGraphic } from "./animated-feature-graphic"
import { AnimatedThirdGraphic } from "./animated-third-graphic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: "24/7 AI Monitoring",
    description: "Our advanced computer vision models watch your coop around the clock, instantly detecting anomalies in flock behavior, mobility issues, or early signs of distress before they become critical.",
    icon: "👁️",
    graphic: <AnimatedTractorGraphic />,
    layout: "center-stack"
  },
  {
    title: "Micro-Climate Sensors",
    description: "Continuous real-time tracking of temperature, humidity, and ammonia levels. The system autonomously adjusts ventilation to maintain the absolute perfect environment for growth.",
    icon: "🌡️",
    graphic: <AnimatedFeatureGraphic />,
    layout: "left-card"
  },
  {
    title: "Predictive Yield Analytics",
    description: "Leveraging historical data and current growth rates, FarmPro's machine learning models forecast your final harvest weight and date with unprecedented 98% accuracy.",
    icon: "📈",
    graphic: <AnimatedThirdGraphic />,
    layout: "right-card"
  },
  {
    title: "Automated Supply Chain",
    description: "Smart silos track your feed and water consumption rates automatically. When supplies dip below optimal thresholds, the system directly alerts your cooperative suppliers.",
    icon: "📦",
    graphic: (
      <div className="w-full h-full border-2 border-dashed border-sage/50 rounded-[2.5rem] flex items-center justify-center text-sage/80 font-bold tracking-widest text-sm relative z-10 group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        SVG 4 PENDING
      </div>
    ),
    layout: "left-card"
  },
  {
    title: "Resource Mastery",
    description: "A centralized dashboard that optimizes your energy and water consumption. Achieve peak sustainability while reducing operational overhead by up to 30%.",
    icon: "💧",
    graphic: (
      <div className="w-full h-full border-2 border-dashed border-sage/50 rounded-[2.5rem] flex items-center justify-center text-sage/80 font-bold tracking-widest text-sm relative z-10 group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        SVG 5 PENDING
      </div>
    ),
    layout: "center-stack"
  }
]

// Unified Featherweight Card (Graphic + Text in one)
type FeatureType = {
  title: string;
  description: string;
  graphic: React.ReactNode;
};

const FeatureCard = ({ feature, layout, index }: { feature: FeatureType, layout?: string, index: number }) => {
  const isCenter = layout === "center-stack";
  const isLeft = layout === "left-card";
  const flexDir = isCenter ? "md:flex-row text-left items-center" : (isLeft ? "md:flex-row-reverse text-left items-center" : "md:flex-row text-left items-center");

  const cardRef = useRef<HTMLDivElement>(null);
  console.log("Forcing Turbopack to recompile FeatureCard!", feature.title);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The tip of the drawn SVG line is always exactly at the vertical center of the viewport.
      // Card turns ON when the line enters it (top hits center).
      // Card stays ON forever as you scroll down (end: "max").
      // Card turns OFF when you scroll UP and the line leaves it completely (top goes below center).
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top center",
        end: "max",
        toggleClass: "is-active"
      });
    });
    return () => ctx.revert();
  }, []);

  const renderCardContent = (active: boolean) => (
    <div className={`w-full flex flex-col gap-6 md:gap-10 ${flexDir} p-6 md:p-10 relative`}>
      {/* Graphic Container - Carries the rope anchor ONLY on base layer */}
      <div 
        className={`relative flex items-center justify-center flex-shrink-0 group w-56 h-56 md:w-72 md:h-72`} 
        {...(!active ? { "data-rope-anchor": true } : {})}
      >
        {/* Aesthetic Pedestal Removed */}
        
        {/* The Animated SVG (Subtle upward parallax) - Rendered ONLY in base layer but with z-50 to poke through overlay */}
        <div data-parallax="0.6" className="w-full h-full relative z-50">
          <div className="w-full h-full drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:-translate-y-2">
            {!active && feature.graphic}
          </div>
        </div>
      </div>

      {/* Text Container (Subtle downward parallax to create visual separation) */}
      <div className={`flex-1 w-full relative z-10 flex flex-col items-start`} data-parallax="-0.4">
        {/* Super Premium Module Tag */}
        <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
          {!isCenter && <span className={`w-6 h-[1px] transition-colors duration-0 ${active ? 'bg-white/40' : 'bg-slate-300'}`}></span>}
          <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-0 ${active ? 'text-white' : 'text-slate-300'}`}>
            System {String(index + 1).padStart(2, '0')}
          </span>
          {isCenter && <span className={`w-6 h-[1px] transition-colors duration-0 ${active ? 'bg-white/40' : 'bg-slate-300'}`}></span>}
        </div>
        
        <h3 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tighter leading-[1.1] transition-colors duration-0 text-white`} style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
          {feature.title}
        </h3>
        <p className={`font-medium leading-relaxed text-lg md:text-xl transition-colors duration-0 max-w-md ${active ? 'text-white/90' : 'text-slate-300'}`}>
          {feature.description}
        </p>

        {/* Interactive Pseudo-Action */}
        <div className={`mt-8 flex items-center gap-2 text-sm font-semibold cursor-pointer group/link ${active ? 'text-white hover:text-white/80' : 'text-slate-400 hover:text-slate-100'}`}>
          Explore Module 
          <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={cardRef} className={`group/card relative overflow-clip transition-transform duration-700 hover:-translate-y-2 border border-slate-700/60 rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] w-full ${isCenter ? "max-w-4xl" : "max-w-3xl"} bg-slate-800`}>
      
      {/* BASE LAYER (Dark Text, White BG) */}
      {renderCardContent(false)}

      {/* OVERLAY LAYER (White Text, Vibrant Orange BG with Clip Path) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-vibrant to-rust z-20 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center pointer-events-none [clip-path:circle(0%_at_50%_50%)] group-[.is-active]/card:[clip-path:circle(150%_at_50%_50%)]"
      >
        {renderCardContent(true)}
      </div>

      {/* Subtle Texture & Inner Glow (stays on top of everything) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset pointer-events-none transition-colors duration-700 z-30 ring-white group-[.is-active]/card:ring-white/20" />
    </div>
  );
}

export function FeaturesRopeSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax has been removed to ensure absolute scrolling stability.
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative bg-transparent features-rope-container overflow-hidden">
      
      {/* Decorative Background Elements */}
      <GlobalRope />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header section */}
        <div className="text-center mb-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/10 text-slate-50 font-semibold text-sm mb-8" data-parallax="-0.2">
            <span>Core Ecosystem</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-50 tracking-tighter mb-8 leading-[0.9]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }} data-parallax="0.5">
            Intelligent by design.
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-xl font-medium leading-snug" data-parallax="0.8">
            Five core pillars seamlessly connected to transform your agricultural operations. Follow the thread.
          </p>
        </div>

        {/* Hero Anchor - Kept for rope math to match the 7 anchor requirement */}
        <div className="flex justify-center mb-48 relative z-20 w-full max-w-2xl mx-auto h-1" data-rope-anchor>
        </div>

        {/* Features Timeline - Unified Cards */}
        <div className="flex flex-col relative">
          
          {features.map((feature, index) => {
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className={`flex w-full mx-auto
                  ${feature.layout === "center-stack" ? "justify-center" : 
                    feature.layout === "left-card" ? "justify-start" : "justify-end"}
                  ${index === features.length - 1 ? "" : 
                    (index === 2 || index === 3) ? "mb-[8rem] md:mb-[15rem]" : "mb-[15rem] md:mb-[34rem]"}
                `}
              >
                <FeatureCard feature={feature} layout={feature.layout} index={index} />
              </motion.div>
            )
          })}
        </div>
        
        {/* Footer - Haptic Island Button */}
        <div className="mt-56 flex justify-center relative z-20">
          <div className="group relative">
            <div className="absolute inset-0 bg-vibrant rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" />
            <button className="relative bg-slate-900 text-white rounded-full pl-8 pr-3 py-3 flex items-center gap-6 font-bold text-lg active:scale-[0.98] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              Integrated Workflow
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
