"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function GlobalRope() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const outlineRef = useRef<SVGPathElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)
  const [svgWidth, setSvgWidth] = useState(0)
  const [strokeW, setStrokeW] = useState(120)

  // Dynamic Path Builder that intersects the anchors in a straight line
  const buildRopePath = (anchors: {x: number, y: number}[], totalWidth: number) => {
    if (!anchors || anchors.length < 2) return "";

    const isMobile = window.innerWidth < 768;
    
    // Disable rope completely on mobile (accordion layout handles it)
    if (isMobile) return "";

    const midX = totalWidth / 2;
    let d = `M ${midX},${anchors[0].y}`;

    for (let i = 1; i < anchors.length; i++) {
      d += ` L ${midX},${anchors[i].y}`;
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
    if (outlineRef.current) outlineRef.current.setAttribute('d', d);

    // Setup DrawSVG animation using strokeDashoffset natively for extreme performance
    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${length}px`;
    pathEl.style.strokeDashoffset = `${length}px`;
    if (glowRef.current) {
      glowRef.current.style.strokeDasharray = `${length}px`;
      glowRef.current.style.strokeDashoffset = `${length}px`;
    }
    if (outlineRef.current) {
      outlineRef.current.style.strokeDasharray = `${length}px`;
      outlineRef.current.style.strokeDashoffset = `${length}px`;
    }
    
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === wrapper) st.kill()
    });

    // Remove old fade trigger. We will bind opacity to progress directly!

    // Drawing animation trigger
    ScrollTrigger.create({
        trigger: wrapper,
        start: () => `top+=${rawAnchors[0].y}px center`,
        end: () => `top+=${rawAnchors[rawAnchors.length - 1].y}px center`,
        onUpdate: (self) => {
            // PERFORMANCE: Native assignment synced perfectly with the browser painting cycle
            requestAnimationFrame(() => {
              // Fade in over the first ~16% of the scroll progress (slower fade to prevent pop-in on fast scrolls)
              const currentOpacity = Math.min(1, self.progress * 6);
              if (containerRef.current) {
                containerRef.current.style.opacity = currentOpacity.toString();
              }

              if (pathEl) {
                pathEl.style.strokeDashoffset = `${length - (length * self.progress)}px`;
              }
              if (glowRef.current) {
                glowRef.current.style.strokeDashoffset = `${length - (length * self.progress)}px`;
              }
              if (outlineRef.current) {
                outlineRef.current.style.strokeDashoffset = `${length - (length * self.progress)}px`;
              }
            });
        }
    });

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
    updateRopeAndAnimation();
    
    // Slight delay to ensure DOM is settled
    const timer = setTimeout(updateRopeAndAnimation, 500);

    // Robust observer for any layout shifts (e.g. late image loads causing container to expand)
    const wrapper = document.querySelector('.features-rope-container') as HTMLElement;
    let resizeObserver: ResizeObserver | null = null;
    
    if (wrapper) {
      resizeObserver = new ResizeObserver(() => {
        updateRopeAndAnimation();
      });
      resizeObserver.observe(wrapper);
    }

    // Fallback window resize listener
    window.addEventListener('resize', updateRopeAndAnimation);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRopeAndAnimation);
      if (resizeObserver && wrapper) resizeObserver.disconnect();
    };
  }, [updateRopeAndAnimation]);

  return (
    <div 
        ref={containerRef}
        className="absolute top-0 left-0 w-full pointer-events-none opacity-0"
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
                    <stop stopColor="#B4C179"/>
                    <stop offset="1" stopColor="#2B4C3B"/>
                </linearGradient>
            </defs>

            {/* Glow behind the rope */}
            <path
              ref={glowRef}
              d=""
              fill="none"
              stroke="#B4C179"
              strokeWidth={strokeW * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-20 blur-xl"
              style={{ willChange: "stroke-dashoffset" }}
            />
            
            {/* White outline path */}
            <path 
                ref={outlineRef}
                d=""
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth={strokeW + 16}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ willChange: "stroke-dashoffset" }}
            />

            {/* Main gradient rope */}
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
