"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, Store, TrendingUp, CloudSun, Calendar, Package, ChevronRight, Droplets, Wind, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  
  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [currentPriceIdx, setCurrentPriceIdx] = useState(0);
  
  // Weather State
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Mencari lokasi...");

  useEffect(() => {
    // 1. Session Auth
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) {
      router.push("/login");
      return;
    }
    const session = JSON.parse(sessionStr);
    if (session.role === 'BUYER') {
      router.push("/marketplace");
      return;
    }
    setProfile(session);

    // 2. Fetch Orders & Prices
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    fetch(`${API_BASE}/api/orders/PRODUCER/${session.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data.slice(0, 4));
        } else {
          console.error("Expected array of orders, got:", data);
        }
      })
      .catch(console.error);
      
    fetch(`${API_BASE}/api/events/${session.id}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);

    fetch(`${API_BASE}/api/prices`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPrices(data);
        }
      })
      .catch(console.error);

    // 3. Fetch Weather & Location (Default: Jakarta)
    const lat = -6.2088;
    const lon = 106.8456;
    setLocationName("Jakarta");
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m&timezone=auto`)
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(() => setLocationName("Gagal memuat cuaca"));
  }, [router]);

  // Live Tile Effect for Prices
  useEffect(() => {
    if (prices.length > 0) {
      const interval = setInterval(() => {
        setCurrentPriceIdx((prev) => (prev + 1) % prices.length);
      }, 4000); // Rotate every 4 seconds
      return () => clearInterval(interval);
    }
  }, [prices]);

  const firstName = profile?.name?.split(" ")[0] || profile?.fullName?.split(" ")[0] || "Petani";

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      <div className="w-full mx-auto px-4 md:px-8 pt-4 pb-12">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-[3.5rem] font-black text-[#1C241E] mb-3 tracking-tighter leading-tight">
            Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B4C3B] to-[#4A7C59]">{firstName}</span>! 
            <motion.span 
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} 
              transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }} 
              className="inline-block origin-bottom-right ml-2"
            >
              👋
            </motion.span>
          </h1>
          <p className="text-lg font-semibold text-[#5A635B]">
            Pusat kendali operasional harian Anda.
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Column (Weather & Calendar) */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Top Row: Weather & Live Tile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Weather Widget */}
              <div className="bg-gradient-to-br from-[#4A7C59] to-[#2B4C3B] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute -right-10 -top-10 opacity-10">
                  <CloudSun size={180} />
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                    <MapPin size={12} /> {locationName}
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  {weather ? (
                    <>
                      <div className="flex items-end gap-3 mb-4">
                        <span className="text-6xl font-black leading-none">{Math.round(weather.temperature_2m)}°</span>
                        <span className="text-lg font-bold text-[#A4C4A8] pb-1">Cerah Berawan</span>
                      </div>
                      <div className="flex gap-6 text-sm font-bold text-[#EEF2E6]">
                        <span className="flex items-center gap-1.5"><Droplets size={16} className="text-[#84B0A5]" /> {weather.relative_humidity_2m}% Lem</span>
                        <span className="flex items-center gap-1.5"><Wind size={16} className="text-[#84B0A5]" /> {weather.wind_speed_10m} km/j</span>
                      </div>
                    </>
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 w-24 bg-white/20 rounded-xl"></div>
                      <div className="h-4 w-40 bg-white/20 rounded-md"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Incoming Orders Tile (Moved from right) */}
              <div className="bg-white rounded-[2rem] p-6 border border-[#E8E3D2] shadow-sm flex flex-col relative overflow-hidden min-h-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center gap-2 text-[#2B4C3B] font-bold text-sm">
                    <Package className="text-[#C25939]" size={16} /> Pesanan Aktif
                  </h3>
                  <Link href="/dashboard/store/orders" className="w-6 h-6 rounded-full bg-[#F8F6F0] flex items-center justify-center text-[#5A635B] hover:bg-[#E8E3D2] transition-colors">
                    <ChevronRight size={14} />
                  </Link>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 mt-2 overflow-y-auto pr-1">
                  {orders.length > 0 ? (
                    orders.map((order, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0] border border-transparent hover:border-[#E8E3D2] transition-colors shadow-sm">
                        <div>
                          <span className="font-black text-xs text-[#1C241E]">INV-{order.id.substring(0,6)}</span>
                          <p className="text-[10px] font-semibold text-[#5A635B]">{order.items?.length || 1} Item(s)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-pranala text-white block mb-1 w-fit ml-auto">
                            {order.status}
                          </span>
                          <span className="font-black text-xs text-[#C25939]">Rp {order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                      <Package size={24} className="mb-2 text-[#A4B0A7]" />
                      <p className="text-xs font-bold text-[#7A8678]">Belum ada pesanan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Window Calendar Widget */}
            <div className="bg-pranala rounded-[2rem] p-6 lg:p-8 shadow-lg shadow-[#2B4C3B]/20 relative flex flex-col lg:flex-row gap-6 lg:gap-10 lg:h-[380px]">
              
              {/* Left Side: Header & Event List */}
              <div className="flex-1 flex flex-col h-[300px] lg:h-full overflow-hidden">
                <div className="shrink-0 mb-4">
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 capitalize">
                    <Calendar className="text-[#A4C4A8]" size={24} /> 
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                
                {/* Event List (Kiri Bawah) */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3 pb-4">
                  {events.length > 0 ? events.map((e, idx) => {
                    const d = new Date(e.eventDate);
                    return (
                      <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 transition-colors hover:bg-white/10">
                         <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-inner ${e.type === 'HARVEST' ? 'bg-[#C25939] text-white' : e.type === 'TASK' ? 'bg-[#F5990D] text-white' : 'bg-[#4A7C59] text-white'}`}>
                           <span className="text-[10px] font-bold leading-none opacity-80 mb-0.5">{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                           <span className="text-lg font-black leading-none">{d.getDate()}</span>
                         </div>
                         <div className="flex-1">
                           <h4 className="text-sm font-bold text-white leading-tight mb-1">{e.title}</h4>
                           <div className="flex items-center justify-between">
                             <p className="text-[10px] font-bold text-[#84B0A5]">{d.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                             <p className="text-[9px] font-black tracking-wider uppercase text-white/50">{e.type}</p>
                           </div>
                         </div>
                      </div>
                    )
                  }) : (
                    <div className="text-sm font-semibold text-[#84B0A5] h-full flex items-center">Belum ada jadwal mendatang.</div>
                  )}
                </div>

                <div className="shrink-0 pt-2">
                  <Link href="/dashboard/calendar" className="inline-flex justify-center text-sm font-bold text-[#2B4C3B] bg-white px-5 py-3 rounded-full hover:bg-[#EEF2E6] transition-colors self-start shadow-md w-fit">
                    Buka Kalender Penuh
                  </Link>
                </div>
              </div>

              {/* Right Side: Month Grid */}
              <div className="lg:w-[350px] shrink-0 flex flex-col justify-center">
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs font-bold text-[#84B0A5]">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {/* Fill days */}
                  {(() => {
                    const today = new Date();
                    const currentMonth = today.getMonth();
                    const currentYear = today.getFullYear();
                    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                    
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-10 md:h-12 rounded-xl opacity-10 bg-white/5"></div>);
                    }
                    
                    for (let d = 1; d <= daysInMonth; d++) {
                      const isToday = d === today.getDate();
                      
                      // Check for events
                      const dayEvents = events.filter(e => {
                        const eDate = new Date(e.eventDate);
                        return eDate.getDate() === d && eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
                      });
                      const hasEvent = dayEvents.length > 0;
                      const hasHarvest = dayEvents.some(e => e.type === 'HARVEST');
                      
                      let bgClass = "bg-white/5 hover:bg-white/10 text-white/70 border border-transparent";
                      if (isToday) {
                         bgClass = "bg-[#C25939] text-white font-black shadow-[0_4px_12px_rgba(194,89,57,0.4)] border-[#C25939]";
                      } else if (hasHarvest) {
                         bgClass = "bg-white/20 text-white font-bold border-white/40";
                      } else if (hasEvent) {
                         bgClass = "bg-[#4A7C59]/60 text-white font-bold border-[#4A7C59]";
                      }
                      
                      cells.push(
                        <Link href="/dashboard/calendar" key={d} className={`h-10 md:h-12 rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${bgClass}`}>
                          {d}
                          {hasEvent && !isToday && (
                             <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${hasHarvest ? 'bg-[#C25939]' : 'bg-white'}`}></span>
                          )}
                        </Link>
                      );
                    }
                    return cells;
                  })()}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (AI Chatbot Panel) */}
          <div className="md:col-span-4 flex flex-col h-full">
            <div className="bg-gradient-to-b from-white to-[#F8F6F0] rounded-[2rem] border border-[#E8E3D2] shadow-sm flex flex-col overflow-hidden h-full min-h-[400px]">
              
              <div className="p-6 bg-gradient-to-r from-[#2B4C3B] to-[#4A7C59] text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">🤖</span>
                    Pranata AI
                  </h3>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-xs font-semibold text-white/80">Asisten cerdas peternakan Anda.</p>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-white/50 relative">
                {/* Decorative background logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-48 h-48"><path d="M50 10 L90 90 L10 90 Z" fill="currentColor"/></svg>
                </div>
                
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-[#E8E3D2] relative z-10">
                  <p className="text-sm font-semibold text-[#1C241E] leading-relaxed">
                    Halo {firstName}! Ada yang bisa saya bantu hari ini terkait kesehatan ternak atau manajemen pakan?
                  </p>
                </div>
                
                <div className="bg-pranala p-4 rounded-2xl rounded-tr-none shadow-sm self-end relative z-10 w-4/5">
                  <p className="text-sm font-medium text-white/90">
                    Coba bantu saya hitung FCR pakan ayam saya.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-white border-t border-[#E8E3D2] shrink-0">
                <Link href="/dashboard/ai-vet" className="flex items-center gap-2 w-full bg-[#F8F6F0] hover:bg-[#EEF2E6] text-[#2B4C3B] px-4 py-3 rounded-xl transition-colors border border-[#E8E3D2]">
                  <input 
                    type="text" 
                    placeholder="Tanya Pranata AI..." 
                    className="bg-transparent border-none outline-none flex-1 text-sm font-semibold placeholder:text-[#A4B0A7]"
                    readOnly
                  />
                  <div className="w-8 h-8 bg-[#F5990D] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Search size={16} />
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
