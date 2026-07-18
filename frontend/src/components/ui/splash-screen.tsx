"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalLoading } from "@/components/shared/loading-context";
import { Loader2 } from "lucide-react";

export function SplashScreen() {
  const [targetRadius, setTargetRadius] = useState(15000);
  const [targetScale, setTargetScale] = useState(80);
  const { isGlobalReady } = useGlobalLoading();

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // ViewBox is 3343 wide, rendered at 400px wide. Ratio = 400 / 3343
    const ratio = 400 / 3343;
    
    // The SVG is positioned at 50vw - 200px (center). The circle cx is 437 inside the viewBox.
    // Calculate the EXACT physical pixel position of the origin on the screen:
    const originXPhysical = (w / 2) - 200 + (437 * ratio); 
    const originYPhysical = (h / 2) - 60 + (497 * (120 / 994)); 

    // Find the max distance from this origin to any of the 4 screen corners
    const maxCornerDist = Math.max(
      Math.hypot(originXPhysical, originYPhysical), // Top-left
      Math.hypot(w - originXPhysical, originYPhysical), // Top-right
      Math.hypot(originXPhysical, h - originYPhysical), // Bottom-left
      Math.hypot(w - originXPhysical, h - originYPhysical) // Bottom-right
    );
    
    // Perfect target radius plus a MASSIVE 10000 unit buffer 
    // This ensures that if the mobile viewport grows (e.g. address bar hides), 
    // the circle hole remains larger than the screen, preventing the circle from "sitting on the screen".
    const requiredRadius = (maxCornerDist / ratio) + 10000; 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTargetRadius(requiredRadius);

    // For scale, we need the logo's bounds to clear the screen. 
    // We calculate the maximum distance to any screen edge from our origin.
    const maxDistToEdge = Math.max(
      originXPhysical, // left screen edge
      w - originXPhysical, // right screen edge
      originYPhysical, // top screen edge
      h - originYPhysical // bottom screen edge
    );
    
    // The closest inner edge of the logo path to the origin is ~40 viewBox units.
    // To ensure this inner edge clears the farthest screen edge, we divide by its physical size.
    // Add a tiny 0.2 buffer so it just barely covers the screen.
    const requiredScale = (maxDistToEdge / (40 * ratio)) + 0.2; 
    setTargetScale(requiredScale);
  }, []);

  // Custom curve for Zoom In (Open): [1.00, 0.05, 0.15, 1]
  // This curve starts very flat. It sits at r=0 for a long time before opening.
  const enterTransition = {
    duration: 1.2,
    ease: [1.00, 0.05, 0.15, 1] as import("framer-motion").Easing
  };

  const exitTransition = {
    duration: 0.5, // Faster close animation
    ease: "easeOut" as import("framer-motion").Easing
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" style={{ contain: "strict", willChange: "opacity, transform" }}>
      {/* 
        Bulletproof SVG Mask Layer:
        Creates a white background and logo that BOTH get an expanding circular hole 
        originating from the logo mark.
      */}
      <svg className="absolute inset-0 w-full h-full z-0">
        <defs>
          <mask id="splash-mask">
            {/* Keep the background everywhere initially */}
            <rect width="100%" height="100%" fill="white" />
            {/* Punch a circular hole from the center of the logo mark (cx: 437, cy: 497 in viewBox) */}
            <svg x="calc(50vw - 200px)" y="calc(50vh - 60px)" width="400" height="120" viewBox="0 0 3343 994" overflow="visible">
              <motion.circle
                cx="437"
                cy="497"
                fill="black"
                initial={{ r: 0 }}
                animate={{ r: isGlobalReady ? targetRadius : 0, transition: enterTransition }}
                exit={{ r: 0, transition: exitTransition }}
              />
            </svg>
          </mask>
        </defs>

        {/* Everything inside this group gets the hole punched through it */}
        <g mask="url(#splash-mask)">
          <rect width="100%" height="100%" fill="white" />
          
          <svg x="calc(50vw - 200px)" y="calc(50vh - 60px)" width="400" height="120" viewBox="0 0 3343 994" overflow="visible">
            {/* The Colored Logo remains static in the center. Only the circular hole expands/shrinks. */}
            <image href="/logos/basic/logo black.png" width="3343" height="994" />
          </svg>
        </g>
      </svg>

      {/* Loading Indicator - Placed AFTER the SVG so it renders on top of the solid white background */}
      <AnimatePresence>
        {!isGlobalReady && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, transition: { delay: 0.3 } }} 
            exit={{ opacity: 0 }} 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
          >
            <Loader2 className="w-8 h-8 text-[#2B4C3B] animate-spin" />
            <span className="text-[#2B4C3B] font-bold text-sm tracking-widest uppercase">Loading...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
