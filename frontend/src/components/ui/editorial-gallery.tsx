/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function EditorialGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  console.log("Forcing Turbopack to recompile EditorialGallery!");

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const panels = gsap.utils.toArray('.panel') as HTMLElement[]
      
      // Initially hide all panel contents
      panels.forEach(panel => {
        const content = panel.querySelector('.panel-content')
        if (content) {
          gsap.set(content, { opacity: 0, y: 30 })
        }
      })

      // Panel 1 content is visible immediately since it's the first panel
      const firstContent = panels[0].querySelector('.panel-content')
      if (firstContent) {
        gsap.to(firstContent, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // 4 panels to animate in
          scrub: 1, // Smooth scrub for the mask
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      panels.forEach((panel, i) => {
        if (i === 0) return
        
        const isCircle = i % 2 !== 0; // panel 2, 4 get circles
        const content = panel.querySelector('.panel-content');
        
        let isVisible = false;

        if (isCircle) {
          gsap.set(panel, { 
            clipPath: "circle(0% at 50% 50%)",
            WebkitClipPath: "circle(0% at 50% 50%)" 
          });
          tl.to(panel, {
            clipPath: "circle(150% at 50% 50%)",
            WebkitClipPath: "circle(150% at 50% 50%)",
            ease: "none"
          });
        } else {
          gsap.set(panel, { 
            clipPath: "inset(100% 0 0 0)" 
          });
          tl.to(panel, {
            clipPath: "inset(0% 0 0 0)",
            ease: "none"
          });
        }

        // Add a callback to animate the content IN when the panel is fully revealed
        tl.call(() => {
          if (!isVisible) {
            isVisible = true;
            gsap.to(content, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          }
        }, undefined, "-=0.3");
        
        // Parallax image within the panel
        const img = panel.querySelector('.parallax-img');
        if (img) {
          tl.fromTo(img, 
            { scale: 1.15, y: isCircle ? -30 : 50 }, 
            { scale: 1, y: 0, ease: "none" }, 
            "<"
          );
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      const panels = gsap.utils.toArray('.panel') as HTMLElement[]
      panels.forEach(panel => {
        const content = panel.querySelector('.panel-content')
        if (content) {
          gsap.set(content, { opacity: 1, y: 0 })
        }
        gsap.set(panel, { clearProps: "all" })
      })
    });

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      mm.revert();
    };
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative min-h-[100vh] h-[100vh] w-full bg-slate-900 editorial-gallery-container flex md:block overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory md:snap-none">
      
      {/* PANEL 1: Review 1 */}
      <div className="panel relative md:absolute md:inset-0 w-screen md:w-full flex-none md:flex-auto h-full bg-slate-100 z-10 overflow-clip snap-center">
        <div className="absolute inset-0 z-0 parallax-img opacity-90">
          <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2000&auto=format&fit=crop" alt="Farmer Portrait" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-2/3" />
        
        <div className="panel-content absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-50 leading-[1.2] tracking-tighter" >
              "Pranata changed our yield entirely. The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">predictive analytics</span> gave us absolute clarity."
            </h2>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-clip border-2 border-white shadow-md">
                <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=200&auto=format&fit=crop" alt="Budi Santoso" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="text-slate-50 font-bold tracking-wide uppercase text-sm">Budi Santoso</p>
                <p className="text-slate-300 font-medium text-sm">Head of Cooperative 04</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 2: Review 2 */}
      <div className="panel relative md:absolute md:inset-0 w-screen md:w-full flex-none md:flex-auto h-full bg-slate-100 z-20 overflow-clip snap-center">
        <div className="absolute inset-0 z-0 parallax-img opacity-90">
          <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2000&auto=format&fit=crop" alt="Agricultural Engineer" className="w-full h-full object-cover object-top"  loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 left-auto right-0 z-10 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent w-full md:w-2/3" />
        
        <div className="panel-content absolute inset-0 z-20 flex flex-col justify-center items-end p-8 md:p-24">
          <div className="max-w-3xl text-right">
            <h3 className="text-4xl md:text-6xl font-black text-slate-50 leading-[1.2] tracking-tighter" >
              "Since integrating the <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-400">micro-climate sensors</span>, our mortality rate dropped to near zero."
            </h3>
            <div className="mt-10 flex items-center justify-end gap-4">
              <div className="text-right">
                <p className="text-slate-50 font-bold tracking-wide uppercase text-sm">Dr. Sarah Wijaya</p>
                <p className="text-slate-300 font-medium text-sm">Lead Livestock Agronomist</p>
              </div>
              <div className="w-12 h-12 rounded-full overflow-clip border-2 border-white shadow-md">
                <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=200&auto=format&fit=crop" alt="Sarah Wijaya" className="w-full h-full object-cover object-top"  loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 3: Review 3 */}
      <div className="panel relative md:absolute md:inset-0 w-screen md:w-full flex-none md:flex-auto h-full bg-slate-100 z-30 overflow-clip snap-center">
        <div className="absolute inset-0 z-0 parallax-img opacity-90">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" alt="Farm Operations" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent w-full md:w-2/3" />
        
        <div className="panel-content absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-50 leading-[1.2] tracking-tighter" >
              "The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">automated supply tracking</span> means we never run out of feed mid-cycle. It's magic."
            </h2>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-clip border-2 border-slate-700">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop" alt="Ahmad" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="text-slate-50 font-bold tracking-wide uppercase text-sm">Ahmad Riyadi</p>
                <p className="text-slate-300 font-medium text-sm">Operations Manager, AgroTech</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 4: Review 4 */}
      <div className="panel relative md:absolute md:inset-0 w-screen md:w-full flex-none md:flex-auto h-full bg-slate-100 z-40 overflow-clip snap-center">
        <div className="absolute inset-0 z-0 parallax-img opacity-90">
          <img src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=2000&auto=format&fit=crop" alt="Farmer Check" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 top-auto bottom-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent w-full h-3/4 md:h-1/2" />
        
        <div className="panel-content absolute inset-0 z-20 flex flex-col justify-end items-center p-8 md:p-24 text-center">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black text-slate-50 leading-[1.2] tracking-tighter mb-10" >
              "Having <span className="text-transparent bg-clip-text bg-gradient-to-t from-rose-400 to-pink-500">24/7 AI monitoring</span> is literally like having a senior vet inside the coop at all times."
            </h2>
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-clip border-2 border-slate-700">
                <img src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=200&auto=format&fit=crop" alt="Maria" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="text-slate-50 font-bold tracking-wide uppercase text-sm">Maria Gonzalez</p>
                <p className="text-slate-300 font-medium text-sm">Independent MSME Farmer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 5: Review 5 */}
      <div className="panel absolute inset-0 w-full h-full bg-slate-100 z-50 overflow-clip">
        <div className="absolute inset-0 z-0 parallax-img opacity-90">
          <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000&auto=format&fit=crop" alt="Agriculture Business" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 bottom-auto top-0 z-10 bg-gradient-to-b from-slate-900 via-slate-900/95 to-transparent w-full h-3/4 md:h-1/2" />
        
        <div className="panel-content absolute inset-0 z-20 flex flex-col justify-start items-center p-8 md:p-24 text-center pt-24 md:pt-32">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black text-slate-50 leading-[1.2] tracking-tighter mb-10" >
              "We successfully cut our electricity and water overhead by 30% simply by following their <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-purple-500">resource mastery</span> dashboard."
            </h2>
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-clip border-2 border-slate-700">
                <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=200&auto=format&fit=crop" alt="Joko" className="w-full h-full object-cover"  loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="text-slate-50 font-bold tracking-wide uppercase text-sm">Joko Anwar</p>
                <p className="text-slate-300 font-medium text-sm">Director, AgroSustain</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
