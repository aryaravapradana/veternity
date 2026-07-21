"use client"

import React, { useRef, useEffect, useState } from "react"
import { GlobalRope } from "./global-rope"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: "Pranata Intelligence",
    description: "Your on-demand agricultural AI expert. Leverage advanced machine learning and real-time data to receive instant, actionable insights for diagnostics, yield predictions, and operational efficiency.",
    logoWhite: "/logos/intelligence/intelligence-white.png",
    logoBlack: "/logos/intelligence/intelligence-black.png",
    illustration: "/images/PRANATA INTELLIGENCE.png",
    layout: "right-card"
  },
  {
    title: "Pranata Market",
    description: "Connect directly with trusted suppliers and buyers. Track real-time commodity prices and securely trade agricultural products with zero hidden fees.",
    logoWhite: "/logos/market/market-white.png",
    logoBlack: "/logos/market/market-black.png",
    illustration: "/images/PRANATA MARKET.png",
    layout: "left-card"
  },
  {
    title: "Pranata Hub",
    description: "Your centralized dashboard for operations. Monitor micro-climate sensors, automate task scheduling, and track financial ROI with unprecedented clarity.",
    logoWhite: "/logos/hub/hub-white.png",
    logoBlack: "/logos/hub/hub-black.png",
    illustration: "/images/PRANATA HUB.png",
    layout: "right-card"
  }
]

type FeatureType = typeof features[0];

const FeatureCard = ({ feature, layout, index }: { feature: FeatureType, layout?: string, index: number }) => {
  const isCenter = layout === "center-stack";
  const isLeft = layout === "left-card";
  
  const flexDir = isCenter ? "flex-col items-center text-center" : (isLeft ? "flex-row-reverse items-center" : "flex-row items-center");

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top center",
        end: "+=999999px",
        toggleClass: "is-active"
      });
    });
    return () => ctx.revert();
  }, []);

  const renderCardContent = (active: boolean) => (
    <div className={`w-full flex ${flexDir} gap-6 lg:gap-16 p-6 lg:p-12 relative`}>
      {/* Graphic Container */}
      <div 
        className={`relative flex items-center justify-center shrink-0 group w-32 sm:w-48 lg:w-72`} 
        {...(!active ? { "data-rope-anchor": true } : {})}
      >
        <div data-parallax="0.6" className="w-full relative z-50">
          <div className="w-full drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:-translate-y-2">
            <div className={`w-full flex items-center justify-center border-[6px] rounded-[2.5rem] shadow-inner overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${active ? 'bg-[#2B4C3B]/20 border-[#F4F6F0]' : 'bg-white border-[#E8E3D2]'}`}>
              <img src={feature.illustration} alt={feature.title} className="w-full h-auto object-contain block scale-[1.02]"  loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className={`flex-1 w-full relative z-10 flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} justify-center`} data-parallax="-0.4">
        {/* Logo acting as Heading */}
        <div className="mb-4 lg:mb-8">
          <div className={`inline-flex items-center justify-center rounded-2xl transition-all duration-500 ${active ? 'p-3 lg:p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : ''}`}>
            <div className="h-8 sm:h-12 lg:h-16 shrink-0 inline-block">
              <img src={active ? feature.logoWhite : feature.logoBlack} alt={feature.title} className="h-full w-auto object-contain"  loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
        
        <p className={`hidden sm:block font-medium leading-[1.8] text-sm lg:text-[17px] transition-colors duration-0 max-w-[28rem] ${active ? 'text-white/95' : 'text-slate-600'}`}>
          {feature.description}
        </p>

        {/* Interactive Pseudo-Action */}
        <div className={`mt-2 lg:mt-8 flex items-center gap-1 lg:gap-2 text-[10px] sm:text-xs lg:text-sm font-semibold cursor-pointer group/link ${active ? 'text-white hover:text-white/80' : 'text-forest hover:text-vibrant'}`}>
          Explore Module 
          <svg className="w-3 h-3 lg:w-4 lg:h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={cardRef} className={`group/card relative overflow-clip transition-all duration-700 hover:-translate-y-2 border-[3px] border-[#E8E3D2] group-[.is-active]/card:border-white rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] w-full max-w-4xl bg-white`}>
      
      {/* BASE LAYER (Dark Text, White BG) */}
      {renderCardContent(false)}

      {/* OVERLAY LAYER (White Text, Soft Green BG with Clip Path) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#8FA76B] to-[#405D46] z-20 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center pointer-events-none [clip-path:circle(0%_at_50%_50%)] group-[.is-active]/card:[clip-path:circle(150%_at_50%_50%)]"
      >
        {renderCardContent(true)}
      </div>

      {/* Subtle Texture (stays on top of everything) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
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
        <div className="flex flex-col pr-6 justify-center">
          <div className={`inline-flex items-center justify-center rounded-xl transition-all duration-500 ${isActive ? 'p-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg' : ''}`}>
            <div className="h-6 sm:h-10 shrink-0 inline-block">
              <img src={feature.logoWhite} alt={feature.title} className={`h-full w-auto object-contain transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}  loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
        <div className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${isActive ? 'border-rust bg-rust text-white' : 'border-slate-700 text-slate-500 group-hover:border-slate-500'}`}>
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
              <div className="w-32 sm:w-48 shrink-0 relative z-10 flex items-center justify-center border-2 border-white/10 rounded-2xl overflow-hidden">
                <img src={feature.illustration} alt={feature.title} className="w-full h-auto object-contain block"  loading="lazy" decoding="async" />
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
    // Refresh triggers when layout changes (images loading)
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative bg-forest features-rope-container overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="block">
        <GlobalRope />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 lg:px-12">
        
        {/* Header section */}
        <div className="text-center mb-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/10 text-slate-50 font-semibold text-sm mb-8" data-parallax="-0.2">
            <span>Core Ecosystem</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-50 tracking-tighter mb-8 leading-[0.9]"  data-parallax="0.5">
            Intelligent by design.
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-xl font-medium leading-snug" data-parallax="0.8">
            Three core pillars seamlessly connected to transform your agricultural operations. Follow the thread.
          </p>
        </div>

        {/* Hero Anchor - Kept for rope math to match the anchors */}
        <div className="flex justify-center mb-48 relative z-20 w-full max-w-7xl mx-auto h-1 px-4 md:px-8 lg:px-12" data-rope-anchor>
        </div>

        {/* Features Timeline - Desktop Cards */}
        <div className="hidden md:flex flex-col relative gap-[10rem] lg:gap-[14rem]">
          {features.map((feature, index) => {
            return (
              <div 
                key={`desktop-feature-${index}`}
                className="relative z-20 w-full flex justify-center"
              >
                <div className="w-full md:w-[90%] lg:w-full flex items-center justify-center">
                  <FeatureCard feature={feature} layout={feature.layout} index={index} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden flex flex-col max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {features.map((feature, index) => (
            <MobileAccordionFeature 
              key={`mobile-feature-${index}`}
              feature={feature} 
              index={index} 
              isActive={activeAccordion === index}
              onToggle={() => setActiveAccordion(activeAccordion === index ? null : index)}
            />
          ))}
        </div>

        {/* Footer Anchor */}
        <div className="flex justify-center mt-32 relative z-20 w-full h-1" data-rope-anchor></div>
        
      </div>
    </section>
  )
}
