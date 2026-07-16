"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const GlobalRope = () => {
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  
  const [svgHeight, setSvgHeight] = useState(1000)
  const [svgWidth, setSvgWidth] = useState(1920)
  const [isReady, setIsReady] = useState(false)
  const [strokeW, setStrokeW] = useState(120)

  // Dynamic Path Builder that intersects the anchors but swings left/right between them
  const buildRopePath = (anchors: {x: number, y: number}[], totalWidth: number) => {
    if (!anchors || anchors.length < 2) return "";

    const isMobile = window.innerWidth < 1024;
    
    // Disable rope completely on mobile (accordion layout handles it)
    if (isMobile) return "";

    let d = `M ${anchors[0].x},${anchors[0].y}`;

    for (let i = 0; i < anchors.length - 1; i++) {
        const P0 = anchors[i];
        const P1 = anchors[i + 1];
        const distY = P1.y - P0.y;

        // Desktop wild left/right swings that still intersect the centered PNGs.
        // To do this, endpoints remain at P0/P1, but control points are pushed extremely far left/right.
        const swing = totalWidth * 0.35; // 35% of screen width swing
        
        if (anchors.length === 7) {
            let cp1x = 0, cp1y = 0, cp2x = 0, cp2y = 0;
            
            if (i === 0) { // Header to Tractor (Smooth drop)
                cp1x = P0.x; cp1y = P0.y + distY * 0.5;
                cp2x = P1.x; cp2y = P1.y - distY * 0.5;
            } else if (i === 1) { // Tractor to F1 (Swing Left Loop)
                cp1x = P0.x - swing; cp1y = P0.y + distY * 1.2;
                cp2x = P1.x - swing; cp2y = P1.y - distY * 0.5;
            } else if (i === 2) { // F1 to F2 (Swing Right Loop)
                cp1x = P0.x + swing; cp1y = P0.y + distY * 1.2;
                cp2x = P1.x + swing; cp2y = P1.y - distY * 0.5;
            } else if (i === 3) { // F2 to F3 (Swing Left Loop)
                cp1x = P0.x - swing; cp1y = P0.y + distY * 1.2;
                cp2x = P1.x - swing; cp2y = P1.y - distY * 0.5;
            } else if (i === 4) { // F3 to F4 (Swing Right Deep Sag)
                cp1x = P0.x + swing; cp1y = P0.y + distY * 0.8;
                cp2x = P1.x + swing; cp2y = P1.y + distY * 0.8;
            } else if (i === 5) { // F4 to F5 (The Knot - Left to Right crossover)
                cp1x = P0.x - swing; cp1y = P0.y - distY * 0.5; // Pull up left
                cp2x = P1.x + swing; cp2y = P1.y - distY * 0.8; // Pull up right
            }
            
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${P1.x},${P1.y}`;
        } else {
            // Fallback for different anchor counts
            const swingAmount = Math.min(totalWidth * 0.5, 800);
            const dir = i % 2 === 0 ? -1 : 1; 

            if (i === 0) {
                // Go straight down the middle first
                const cp1x = P0.x;
                const cp1y = P0.y + distY * 0.5;
                const cp2x = P1.x;
                const cp2y = P1.y - distY * 0.5;
                d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${P1.x},${P1.y}`;
            } else if (i === anchors.length - 2) {
                const cp1x = P0.x;
                const cp1y = P0.y + distY * 0.5; 
                const cp2x = P1.x;
                const cp2y = P1.y - distY * 0.5; 
                d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${P1.x},${P1.y}`;
            } else {
                const cp1x = P0.x + (swingAmount * dir);
                const cp1y = P0.y + distY * 0.3;
                const cp2x = P1.x + (swingAmount * dir);
                const cp2y = P1.y - distY * 0.1;
                d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${P1.x},${P1.y}`;
            }
        }
    }

    return d;
  };

  const updateRopeAndAnimation = useCallback(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;
    const wrapper = document.querySelector('.features-rope-container') as HTMLElement;
    if (!wrapper) return; 
    
    const wrapperRect = wrapper.getBoundingClientRect();
    const totalHeight = wrapper.scrollHeight;
    const totalWidth = wrapperRect.width; 
    
    setSvgHeight(totalHeight);
    setSvgWidth(totalWidth);

    const anchors = document.querySelectorAll('[data-rope-anchor]');
    if (anchors.length < 2) return;

    const wrapperPageTop = wrapperRect.top + window.scrollY;
    
    const rawAnchors = Array.from(anchors).map(anchor => {
         const rect = anchor.getBoundingClientRect();
         return {
             x: (rect.left + rect.width / 2) - wrapperRect.left,
             y: (rect.top + rect.height / 2 + window.scrollY) - wrapperPageTop
         };
    });

    setStrokeW(window.innerWidth < 768 ? 40 : 120);

    // Ensure they are ordered top-to-bottom
    rawAnchors.sort((a, b) => a.y - b.y);
    
    // Generate the perfectly intersecting swinging path
    const d = buildRopePath(rawAnchors, totalWidth);
    pathEl.setAttribute('d', d);
    if (glowRef.current) glowRef.current.setAttribute('d', d);

    // Setup DrawSVG animation using strokeDashoffset natively for extreme performance
    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${length}px`;
    pathEl.style.strokeDashoffset = `${length}px`;
    if (glowRef.current) {
      glowRef.current.style.strokeDasharray = `${length}px`;
      glowRef.current.style.strokeDashoffset = `${length}px`;
    }
    
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === wrapper) st.kill()
    });

    ScrollTrigger.create({
        trigger: wrapper,
        start: () => `top+=${rawAnchors[0].y}px center`,
        end: () => `top+=${rawAnchors[rawAnchors.length - 1].y}px center`,
        onUpdate: (self) => {
            // PERFORMANCE: Native assignment synced perfectly with the browser painting cycle
            requestAnimationFrame(() => {
              if (pathEl) {
                pathEl.style.strokeDashoffset = `${length - (length * self.progress)}px`;
              }
              if (glowRef.current) {
                glowRef.current.style.strokeDashoffset = `${length - (length * self.progress)}px`;
              }
            });
        }
    });

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial draw
    if (document.readyState === 'complete') {
        setTimeout(updateRopeAndAnimation, 0);
    } else {
        window.addEventListener('load', updateRopeAndAnimation);
    }

    let lastWidth = window.innerWidth;
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (Math.abs(window.innerWidth - lastWidth) > 10) {
                lastWidth = window.innerWidth;
                updateRopeAndAnimation();
            }
        }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('load', updateRopeAndAnimation);
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
    };
  }, [updateRopeAndAnimation]);

  return (
    <div 
        className={`absolute top-0 left-0 w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 10, height: `${svgHeight}px` }}
    >
        <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full overflow-visible"
            style={{ height: `${svgHeight}px`, zIndex: 50, pointerEvents: 'none', willChange: 'transform' }}
        >
            <defs>
                <linearGradient id="rope-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={svgHeight}>
                    <stop stopColor="#F5990D"/>
                    <stop offset="1" stopColor="#C25939"/>
                </linearGradient>
            </defs>

            {/* Glow behind the rope */}
            <path
              ref={glowRef}
              d=""
              fill="none"
              stroke="#F5990D"
              strokeWidth={strokeW * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-20 blur-xl"
              style={{ willChange: "stroke-dashoffset" }}
            />
            <path 
                ref={pathRef}
                fill="none" 
                stroke="url(#rope-gradient)" 
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-2xl"
                style={{
                  willChange: 'stroke-dashoffset'
                }}
            />
        </svg>
    </div>
  )
}
