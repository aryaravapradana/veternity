"use client";
import { fetchApi } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, Store, TrendingUp, CloudSun, Calendar, Package, ChevronRight, Droplets, Wind, MapPin, Sparkles, Loader2, Info } from "lucide-react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  
  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [currentPriceIdx, setCurrentPriceIdx] = useState(0);

  // Weather State
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Mencari lokasi...");

  // Products State for AI
  const [products, setProducts] = useState<any[]>([]);

  // AI Live Tile State
  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { 
      contextData: { profile, orders, products, events, weather }
    }
  });
  const hasTriggeredInsight = React.useRef(false);

  // Cache AI messages when they finish loading
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const currentHash = `${products.length}_${orders.length}_${events.length}`;
      localStorage.setItem('pranata_ai_insight_cache', JSON.stringify({
        timestamp: Date.now(),
        dataHash: currentHash,
        messages: messages
      }));
    }
  }, [messages, isLoading, products.length, orders.length, events.length]);

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

    // 2. Fetch Orders, Products, & Prices
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    Promise.all([
      fetchApi(`${API_BASE}/api/orders/PRODUCER/${session.id}`).catch(() => null),
      fetchApi(`${API_BASE}/api/products/seller/${session.id}`).catch(() => null)
    ]).then(async ([ordRes, prodRes]) => {
      const ordersData = ordRes && ordRes.ok ? await ordRes.json() : [];
      const productsData = prodRes && prodRes.ok ? await prodRes.json() : [];
      
      const ordersArray = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
      const productsArray = Array.isArray(productsData) ? productsData : (productsData.data || []);
      
      setOrders(ordersArray.slice(0, 4));
      setProducts(productsArray);
    }).catch(() => {
      setOrders([]);
      setProducts([]);
    });
      
    fetchApi(`${API_BASE}/api/events/${session.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]));

    fetchApi(`${API_BASE}/api/prices`)
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
    
    fetchApi(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m&timezone=auto`)
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

  // Auto-trigger AI Insight once everything is ready
  useEffect(() => {
    // Only trigger if we have profile and the data arrays have at least initialized (even if empty)
    if (profile && !hasTriggeredInsight.current) {
      // Don't trigger if absolutely no data exists to analyze
      if (products.length === 0 && orders.length === 0 && events.length === 0) {
        return;
      }
      
      // Add a slight delay to ensure all async fetches (weather, events) have populated
      setTimeout(() => {
        if (!hasTriggeredInsight.current) {
          hasTriggeredInsight.current = true;
          
          let shouldFetchNew = true;
          const currentHash = `${products.length}_${orders.length}_${events.length}`;
          const cachedStr = localStorage.getItem('pranata_ai_insight_cache');
          
          if (cachedStr) {
            try {
              const cached = JSON.parse(cachedStr);
              const isExpired = Date.now() - cached.timestamp > 2 * 60 * 60 * 1000; // 2 hours TTL
              if (!isExpired && cached.dataHash === currentHash && cached.messages?.length > 0) {
                shouldFetchNew = false;
                setMessages(cached.messages);
              }
            } catch(e) { }
          }

          if (shouldFetchNew) {
            append({ role: 'user', content: 'Berikan tepat 2 insight bisnis paling krusial untuk saya hari ini. WAJIB GUNAKAN FORMAT KAKU BERIKUT tanpa tambahan teks apapun di awal/akhir:\n\nTITLE: [Kata kunci 1-2 kata]\nVALUE: [Angka/Status menonjol]\nDESC: [1 kalimat singkat actionable]\nCTA_TEXT: [Teks tombol, misal: Edit Produk, Cek Kalender]\nCTA_URL: [URL relatif: /dashboard/store ATAU /dashboard/calendar ATAU /dashboard/orders]\n---\nTITLE: [Kata kunci ke-2]\nVALUE: [Angka/Status ke-2]\nDESC: [Penjelasan ke-2]\nCTA_TEXT: [Teks tombol ke-2]\nCTA_URL: [URL ke-2]' });
          }
        }
      }, 1500);
    }
  }, [profile, products, orders, events, weather, append]);

  const firstName = profile?.name?.split(" ")[0] || profile?.fullName?.split(" ")[0] || "Petani";

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" >
      <div className="w-full mx-auto px-4 md:px-8 pt-2 pb-4">
        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-[2.5rem] font-black text-[#1C241E] mb-1 tracking-tighter leading-tight">
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Column (Weather & Calendar) */}
          <div className="md:col-span-8 flex flex-col gap-4">
            
            {/* Top Row: Weather & Live Tile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Weather Widget */}
              <div className="bg-gradient-to-br from-[#4A7C59] to-[#2B4C3B] rounded-[2rem] p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="absolute -right-10 -top-10 opacity-10">
                  <CloudSun size={180} />
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                    <MapPin size={12} /> {locationName}
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  {weather ? (
                    <>
                      <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl font-black leading-none">{Math.round(weather.temperature_2m)}°</span>
                        <span className="text-base font-bold text-[#A4C4A8] pb-1">Cerah</span>
                      </div>
                      <div className="flex gap-4 text-xs font-bold text-[#EEF2E6]">
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
              <div className="bg-white rounded-[2rem] p-5 border border-[#E8E3D2] shadow-sm flex flex-col relative overflow-hidden min-h-[160px]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="flex items-center gap-2 text-[#2B4C3B] font-bold text-sm">
                    <Package className="text-[#C25939]" size={16} /> Pesanan Aktif
                  </h3>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 mt-2 overflow-y-auto pr-1">
                  {orders.length > 0 ? (
                    orders.map((order, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0] border border-transparent hover:border-[#E8E3D2] transition-colors shadow-sm">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-black text-xs text-[#1C241E] truncate">{order.buyer?.fullName || order.buyer?.username || 'Pembeli'}</span>
                            <span className="text-[9px] font-bold text-[#A4B0A7] shrink-0">INV-{order.id.substring(0,4)}</span>
                          </div>
                          <p className="text-[10px] font-semibold text-[#5A635B] truncate">
                            {order.items && order.items.length > 0 ? order.items[0].product?.title : 'Produk'} 
                            {order.items && order.items.length > 1 && ` (+${order.items.length - 1} lainnya)`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-pranata text-white block mb-1 w-fit ml-auto">
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
                <div className="shrink-0 pt-3 flex justify-end border-t border-[#F8F6F0] mt-1">
                  <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1C241E] px-4 py-2 rounded-full hover:bg-[#2B4C3B] transition-colors shadow-md w-fit">
                    Semua Pesanan <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Window Calendar Widget */}
            <div className="bg-pranata rounded-[2rem] p-5 lg:p-6 shadow-lg shadow-[#2B4C3B]/20 relative flex flex-col lg:flex-row gap-4 lg:gap-6 lg:h-[260px]">
              
              {/* Left Side: Header & Event List */}
              <div className="flex-1 flex flex-col h-[200px] lg:h-full overflow-hidden">
                <div className="shrink-0 mb-3">
                  <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2 capitalize">
                    <Calendar className="text-[#A4C4A8]" size={24} /> 
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                
                {/* Event List (Kiri Bawah) */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3 pb-4">
                  {events.length > 0 ? events.map((e, idx) => {
                    const d = new Date(e.eventDate);
                    return (
                      <div key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-xl border border-white/10 transition-colors hover:bg-white/10">
                         <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-inner ${e.type === 'HARVEST' ? 'bg-[#C25939] text-white' : e.type === 'TASK' ? 'bg-[#F5990D] text-white' : 'bg-[#4A7C59] text-white'}`}>
                           <span className="text-[9px] font-bold leading-none opacity-80 mb-0.5">{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                           <span className="text-base font-black leading-none">{d.getDate()}</span>
                         </div>
                         <div className="flex-1">
                           <h4 className="text-xs font-bold text-white leading-tight mb-0.5">{e.title}</h4>
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

              </div>

              {/* Right Side: Month Grid */}
              <div className="lg:w-[320px] shrink-0 flex flex-col justify-center h-full pb-2">
                <div className="grid grid-cols-7 gap-1 mb-1 text-center text-[10px] font-bold text-[#84B0A5]">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Fill days */}
                  {(() => {
                    const today = new Date();
                    const currentMonth = today.getMonth();
                    const currentYear = today.getFullYear();
                    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                    
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-7 md:h-8 rounded-lg opacity-10 bg-white/5"></div>);
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
                        <Link href="/dashboard/calendar" key={d} className={`h-7 md:h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all relative ${bgClass}`}>
                          {d}
                          {hasEvent && !isToday && (
                             <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${hasHarvest ? 'bg-[#C25939]' : 'bg-white'}`}></span>
                          )}
                        </Link>
                      );
                    }
                    return cells;
                  })()}
                </div>
                <div className="shrink-0 pt-2 flex justify-end mt-2">
                  <Link href="/dashboard/calendar" className="inline-flex justify-center items-center gap-1.5 text-[10px] font-bold text-[#2B4C3B] bg-white px-3 py-1.5 rounded-full hover:bg-[#EEF2E6] transition-colors shadow-md w-fit">
                    Buka Kalender Penuh <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Pranata Intelligence Insight Card) */}
          <div className="md:col-span-4 flex flex-col h-full">
            <div className="bg-gradient-to-br from-[#2B4C3B] to-[#4A7C59] rounded-[2rem] border border-[#4A7C59] shadow-xl flex flex-col overflow-hidden h-full min-h-[300px] relative">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5990D] opacity-20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 opacity-20 blur-[80px] rounded-full pointer-events-none" />

              <div className="p-5 relative z-10 flex flex-col h-full">
                <img src="/logos/intelligence/intelligence-white.png" alt="Pranata Intelligence" className="h-7 sm:h-8 w-auto object-contain mb-2 drop-shadow-md origin-left self-start" />
                
                <h3 className="text-lg font-black text-white mb-1 leading-tight">
                  Business Insight
                </h3>

                <div className="flex-1 flex flex-col mt-1 overflow-hidden">
                  {profile && products.length === 0 && orders.length === 0 && events.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-6 text-center backdrop-blur-md">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                        <Info size={24} className="text-[#A4C4A8]" />
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">Belum Ada Data</h4>
                      <p className="text-xs text-[#84B0A5] leading-relaxed">
                        Agen intelijen membutuhkan riwayat produk, pesanan, atau kalender untuk memberikan analisis. Yuk, mulai aktivitas pertamamu!
                      </p>
                    </div>
                  ) : (!hasTriggeredInsight.current || isLoading) ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-black/10 rounded-3xl border border-white/10 p-6 text-center backdrop-blur-md shadow-inner">
                      <Loader2 size={32} className="text-[#F5990D] animate-spin mb-4" />
                      <h4 className="font-black text-white text-lg mb-2">Menganalisis Data</h4>
                      <p className="text-xs text-[#DDE2D6] font-medium leading-relaxed max-w-[200px]">
                        Menyinkronkan data toko dan pesanan secara real-time...
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                      {/* Label removed */}
                      
                      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 hide-scrollbar">
                        {(() => {
                          const content = messages.filter(m => m.role === 'assistant').pop()?.content || "";
                          const rawCards = content.split('---').map(c => c.trim()).filter(c => c);
                          
                          // Pad with empty cards if less than 2 so UI doesn't jump
                          while(rawCards.length < 2) rawCards.push("");

                          return rawCards.slice(0, 2).map((raw, idx) => {
                            const titleMatch = raw.match(/TITLE:\s*(.*)/i);
                            const valMatch = raw.match(/VALUE:\s*(.*)/i);
                            const descMatch = raw.match(/DESC:\s*(.*)/i);
                            const ctaTextMatch = raw.match(/CTA_TEXT:\s*(.*)/i);
                            const ctaUrlMatch = raw.match(/CTA_URL:\s*(.*)/i);
                            
                            const title = titleMatch ? titleMatch[1].replace(/\*/g, '') : (isLoading ? '...' : 'Menunggu');
                            const val = valMatch ? valMatch[1].replace(/\*/g, '') : (isLoading ? '...' : '-');
                            const desc = descMatch ? descMatch[1].replace(/\*/g, '') : (isLoading ? 'Memproses intelijen...' : '-');
                            const ctaText = ctaTextMatch ? ctaTextMatch[1].replace(/\*/g, '') : 'Tanya AI';
                            const ctaUrl = ctaUrlMatch ? ctaUrlMatch[1].replace(/\*/g, '') : '/dashboard/ai-vet';

                            return (
                              <div key={idx} className="bg-white/10 rounded-xl border border-white/20 p-3 backdrop-blur-md shadow-sm flex flex-col hover:bg-white/15 transition-colors group">
                                <div className="flex flex-col mb-1.5">
                                  <div className="mb-0.5">
                                    <h4 className="text-[9px] font-black text-[#A4C4A8] uppercase tracking-wider mb-0.5">{title}</h4>
                                    <div className="text-xl font-black text-white leading-tight break-words">{val}</div>
                                  </div>
                                  <p className="text-[10px] font-medium text-white/90 leading-snug">
                                    {desc}
                                  </p>
                                </div>
                                {!isLoading && ctaUrl !== '/dashboard/ai-vet' && (
                                  <div className="flex justify-end border-t border-white/10 pt-2 mt-auto">
                                    <Link href={ctaUrl} className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#F5990D] text-white px-3 py-1 rounded-full hover:bg-[#C25939] transition-colors shadow-sm group-hover:scale-105 origin-right">
                                      {ctaText} <ChevronRight size={10} />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                      
                      <Link href="/dashboard/ai-vet" className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-[#F5990D] hover:text-white transition-colors uppercase tracking-widest w-fit bg-black/20 px-3 py-1.5 rounded-full">
                        Tanya Lebih Lanjut <ChevronRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
