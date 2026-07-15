"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SplashScreen() {
  const [targetRadius, setTargetRadius] = useState(15000);
  const [targetScale, setTargetScale] = useState(80);

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
    
    // Perfect target radius plus a tiny 5px buffer to prevent floating point gaps
    const requiredRadius = (maxCornerDist / ratio) + 5; 
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
      <svg className="absolute inset-0 w-full h-full">
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
                animate={{ r: targetRadius, transition: enterTransition }}
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
            <image href="/logo black.png" width="3343" height="994" />
          </svg>
        </g>
      </svg>
    </div>
  )
}
