"use client"

import React, { useRef, useEffect, useState } from "react"
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
    title: "AI Veterinary Assistant",
    description: "Pranata's integrated LLM acts as your on-demand poultry expert. Describe symptoms or upload flock images to receive instant, data-backed diagnostic insights and treatment recommendations.",
    icon: "🤖",
    graphic: <AnimatedTractorGraphic />,
    layout: "center-stack"
  },
  {
    title: "Weather-Synced Risk Engine",
    description: "By integrating real-time regional weather data, Pranata automatically alerts you to incoming extreme conditions (like heatwaves) and provides actionable steps to prevent flock stress.",
    icon: "⛅",
    graphic: <AnimatedFeatureGraphic />,
    layout: "left-card"
  },
  {
    title: "Automated Task Scheduler",
    description: "Input your flock's hatch date, and Pranata instantly generates a comprehensive daily schedule for feeding adjustments, vaccinations, and harvesting protocols.",
    icon: "📅",
    graphic: <AnimatedThirdGraphic />,
    layout: "right-card"
  },
  {
    title: "Feed Cost Optimizer",
    description: "Utilizing real-time national commodity data (Bapanas/PIHPS), Pranata calculates the absolute cheapest feed mix from local ingredients that still hits your flock's precise nutritional targets.",
    icon: "🌾",
    graphic: (
      <div className="w-full h-full border-2 border-dashed border-slate-700/50 rounded-[2rem] flex items-center justify-center text-slate-500 font-bold tracking-widest text-sm relative z-10 group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        SVG 4 PENDING
      </div>
    ),
    layout: "left-card"
  },
  {
    title: "Financial ROI Ledger",
    description: "Track daily operational expenses and project your final harvest profit margins instantly, fueled by live regional market poultry prices.",
    icon: "💰",
    graphic: (
      <div className="w-full h-full border-2 border-dashed border-slate-700/50 rounded-[2rem] flex items-center justify-center text-slate-500 font-bold tracking-widest text-sm relative z-10 group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
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
  
  // Desktop layout logic (lg and above), mobile uses side-by-side
  const flexDir = isCenter ? "flex-row items-center" : (isLeft ? "flex-row-reverse items-center" : "flex-row items-center");

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
    <div className={`w-full flex ${flexDir} gap-4 lg:gap-10 p-4 lg:p-10 relative`}>
      {/* Graphic Container */}
      <div 
        className={`relative flex items-center justify-center flex-shrink-0 group w-20 h-20 sm:w-32 sm:h-32 lg:w-72 lg:h-72`} 
        {...(!active ? { "data-rope-anchor": true } : {})}
      >
        <div data-parallax="0.6" className="w-full h-full relative z-50">
          <div className="w-full h-full drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:-translate-y-2">
            {!active && feature.graphic}
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className={`flex-1 w-full relative z-10 flex flex-col items-start text-left justify-center`} data-parallax="-0.4">
        {/* Super Premium Module Tag */}
        <div className="inline-flex items-center gap-2 lg:gap-3 mb-1 lg:mb-6">
          <span className={`text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-0 ${active ? 'text-white' : 'text-slate-300'}`}>
            System {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        <h3 className={`text-lg sm:text-3xl lg:text-5xl font-black mb-1 lg:mb-6 tracking-tighter leading-tight transition-colors duration-0 text-white`} style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
          {feature.title}
        </h3>
        
        {/* Description completely hidden on smallest mobile screens to force extreme landscape ratio */}
        <p className={`hidden sm:block font-medium leading-relaxed text-sm lg:text-xl transition-colors duration-0 max-w-md ${active ? 'text-white/90' : 'text-slate-300'}`}>
          {feature.description}
        </p>

        {/* Interactive Pseudo-Action */}
        <div className={`mt-2 lg:mt-8 flex items-center gap-1 lg:gap-2 text-[10px] sm:text-xs lg:text-sm font-semibold cursor-pointer group/link ${active ? 'text-white hover:text-white/80' : 'text-slate-400 hover:text-slate-100'}`}>
          Explore Module 
          <svg className="w-3 h-3 lg:w-4 lg:h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={cardRef} className={`group/card relative overflow-clip transition-transform duration-700 hover:-translate-y-2 border border-slate-700/60 lg:border-slate-700/60 rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] w-full ${isCenter ? "max-w-4xl" : "max-w-3xl"} bg-slate-800`}>
      
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

const MobileAccordionFeature = ({ feature, index, isActive, onToggle }: { feature: FeatureType, index: number, isActive: boolean, onToggle: () => void }) => {
  return (
    <div className="border-b border-slate-700/50 overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <div className="flex flex-col pr-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-vibrant mb-2">
            System {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={`text-3xl sm:text-4xl font-black tracking-tighter leading-[0.95] transition-colors duration-500 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
            {feature.title}
          </h3>
        </div>
        <div className={`w-10 h-10 flex-shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${isActive ? 'border-rust bg-rust text-white' : 'border-slate-700 text-slate-500 group-hover:border-slate-500'}`}>
          <svg className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>
      
      <div 
        className="grid transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-10 pt-2 flex flex-col gap-6">
            <div className="w-full rounded-[2rem] bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row items-center gap-6 p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-vibrant/10 to-rust/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-32 h-32 flex-shrink-0 relative z-10 flex items-center justify-center">
                {feature.graphic}
              </div>
              <div className="flex-1 relative z-10 text-center sm:text-left">
                <p className="text-slate-300 font-medium leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
                <div className="mt-5 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold cursor-pointer text-vibrant group/link">
                  Explore Module 
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesRopeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  useEffect(() => {
    // Parallax has been removed to ensure absolute scrolling stability.
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative bg-transparent features-rope-container overflow-hidden">
      
      {/* Decorative Background Elements (Visible on all devices to connect the zig-zag) */}
      <div className="block">
        <GlobalRope />
      </div>

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

        {/* Features Timeline - Desktop Cards */}
        <div className="hidden lg:flex flex-col relative">
          
          {features.map((feature, index) => {
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className={`flex w-full mx-auto justify-center
                  ${feature.layout === "center-stack" ? "" : 
                    feature.layout === "left-card" ? "lg:justify-start" : "lg:justify-end"}
                  ${index === features.length - 1 ? "" : 
                    (index === 2 || index === 3) ? "lg:mb-[15rem]" : "lg:mb-[34rem]"}
                `}
              >
                <FeatureCard feature={feature} layout={feature.layout} index={index} />
              </motion.div>
            )
          })}
        </div>

        {/* Features Accordion - Mobile/Tablet */}
        <div className="block lg:hidden flex-col mt-4 w-full max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <MobileAccordionFeature 
              key={index}
              feature={feature} 
              index={index} 
              isActive={activeAccordion === index}
              onToggle={() => setActiveAccordion(activeAccordion === index ? null : index)}
            />
          ))}
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
