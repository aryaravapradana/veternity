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
    logoWhite: "/logos/intelligence/intelligence-white.webp",
    logoBlack: "/logos/intelligence/intelligence-black.webp",
    illustration: "/images/PRANATA_INTELLIGENCE.webp",
    layout: "right-card"
  },
  {
    title: "Pranata Market",
    description: "Connect directly with trusted suppliers and buyers. Track real-time commodity prices and securely trade agricultural products with zero hidden fees.",
    logoWhite: "/logos/market/market-white.webp",
    logoBlack: "/logos/market/market-black.webp",
    illustration: "/images/PRANATA_MARKET.webp",
    layout: "left-card"
  },
  {
    title: "Pranata Hub",
    description: "Your centralized dashboard for operations. Monitor micro-climate sensors, automate task scheduling, and track financial ROI with unprecedented clarity.",
    logoWhite: "/logos/hub/hub-white.webp",
    logoBlack: "/logos/hub/hub-black.webp",
    illustration: "/images/PRANATA_HUB.webp",
    layout: "right-card"
  }
]

type FeatureType = typeof features[0];

const FeatureCard = ({ feature, layout, index }: { feature: FeatureType, layout?: string, index: number }) => {
  const isCenter = layout === "center-stack";
  const isLeft = layout === "left-card";
  
  const flexDir = isCenter 
    ? "flex-col items-center text-center" 
    : (isLeft ? "flex-row-reverse items-center" : "flex-row items-center");

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
    <div className={`w-full flex ${flexDir} gap-3.5 sm:gap-8 lg:gap-16 p-4 sm:p-7 lg:p-12 relative`}>
      {/* Graphic Container */}
      <div 
        className={`relative flex items-center justify-center shrink-0 group w-28 sm:w-48 lg:w-72`} 
        {...(!active ? { "data-rope-anchor": true } : {})}
      >
        <div data-parallax="0.6" className="w-full relative z-50">
          <div className="w-full drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:-translate-y-2">
            <div className={`w-full flex items-center justify-center border-[3px] sm:border-[5px] lg:border-[6px] rounded-[1.5rem] sm:rounded-[2.2rem] lg:rounded-[2.5rem] shadow-inner overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${active ? 'bg-[#2B4C3B]/20 border-[#F4F6F0]' : 'bg-white border-[#E8E3D2]'}`}>
              <img src={feature.illustration} alt={feature.title} className="w-full h-auto object-contain block scale-[1.02]" decoding="async" />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className={`flex-1 w-full relative z-10 flex flex-col items-start text-left justify-center`} data-parallax="-0.4">
        {/* Logo acting as Heading */}
        <div className="mb-2 sm:mb-4 lg:mb-8">
          <div className={`inline-flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-500 ${active ? 'p-2 sm:p-3.5 lg:p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : ''}`}>
            <div className="h-6 sm:h-10 lg:h-16 shrink-0 inline-block relative">
              {/* White logo (overlay layer) — always rendered, revealed by clip-path */}
              {active && (
                <img src={feature.logoWhite} alt={feature.title} className="h-full w-auto object-contain" decoding="async" />
              )}
              {/* Black logo (base layer) — fades out immediately when is-active fires so it doesn't ghost under the expanding clip-path */}
              {!active && (
                <img
                  src={feature.logoBlack}
                  alt={feature.title}
                  className="h-full w-auto object-contain transition-opacity duration-150 group-[.is-active]/card:opacity-0"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>
        
        <p className={`font-medium leading-relaxed text-xs sm:text-sm lg:text-[17px] transition-colors duration-0 max-w-md ${active ? 'text-white/95' : 'text-slate-600'}`}>
          {feature.description}
        </p>

        {/* Interactive Pseudo-Action */}
        <div className={`mt-2 sm:mt-5 lg:mt-8 flex items-center gap-1 lg:gap-2 text-xs sm:text-xs lg:text-sm font-semibold cursor-pointer group/link ${active ? 'text-white hover:text-white/80' : 'text-forest hover:text-vibrant'}`}>
          Explore Module 
          <svg className="w-3 h-3 lg:w-4 lg:h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={cardRef} className={`group/card relative overflow-clip transition-all duration-700 hover:-translate-y-2 border-[3px] border-[#E8E3D2] group-[.is-active]/card:border-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] w-full max-w-4xl bg-white`}>
      
      {/* BASE LAYER (Dark Text, White BG) */}
      {renderCardContent(false)}

      {/* OVERLAY LAYER (White Text, Soft Green BG with Clip Path) */}
      <div 
        className="absolute inset-0 bg-linear-to-br from-[#8FA76B] to-[#405D46] z-20 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center pointer-events-none [clip-path:circle(0%_at_50%_50%)] group-[.is-active]/card:[clip-path:circle(150%_at_50%_50%)]"
      >
        {renderCardContent(true)}
      </div>

      {/* Subtle Texture (stays on top of everything) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
    </div>
  );
}

export function FeaturesRopeSection() {
  const containerRef = useRef<HTMLElement>(null);

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
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 relative bg-forest features-rope-container overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="block">
        <GlobalRope />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 lg:px-12">
        
        {/* Header section */}
        <div className="text-center mb-12 sm:mb-20 md:mb-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/10 text-slate-50 font-semibold text-sm mb-8" data-parallax="-0.2">
            <span>Core Ecosystem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-50 tracking-tighter mb-4 sm:mb-8 leading-[0.9]"  data-parallax="0.5">
            Intelligent by design.
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-slate-300 max-w-xl font-medium leading-snug px-2 sm:px-0" data-parallax="0.8">
            Three core pillars seamlessly connected to transform your agricultural operations. Follow the thread.
          </p>
        </div>

        {/* Hero Anchor - Kept for rope math to match the anchors */}
        <div className="flex justify-center mb-24 sm:mb-32 md:mb-48 relative z-20 w-full max-w-7xl mx-auto h-1 px-4 md:px-8 lg:px-12" data-rope-anchor>
        </div>

        {/* Features Timeline Cards with Rope Anchors */}
        <div className="flex flex-col relative gap-24 sm:gap-32 md:gap-40 lg:gap-56">
          {features.map((feature, index) => {
            return (
              <div 
                key={`feature-card-${index}`}
                className="relative z-20 w-full flex justify-center"
              >
                <div className="w-full sm:w-[90%] lg:w-full flex items-center justify-center">
                  <FeatureCard feature={feature} layout={feature.layout} index={index} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Anchor */}
        <div className="flex justify-center mt-24 sm:mt-32 relative z-20 w-full h-1" data-rope-anchor></div>
        
      </div>
    </section>
  )
}
