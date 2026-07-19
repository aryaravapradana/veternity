"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect, useCallback, memo, useRef, useMemo } from "react";
import { Search, MapPin, ChevronRight, Package, ArrowRight, Minus, Plus, ShoppingBag, Store, User, Star, CheckCircle, Info, Crown, Truck, SlidersHorizontal, X, Settings, Bird, Menu, Zap, ChevronLeft, Sparkles, TrendingDown, TrendingUp, Layers } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Semua", icon: "🌾", image: null },
  { name: "Daging", icon: "🥩", image: "/icons/daging.png" },
  { name: "Susu", icon: "🥛", image: "/icons/susu.png" },
  { name: "Telur", icon: "🥚", image: "/icons/telor.png" },
];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const getCategoryFallbackImage = (category: string) => {
  const c = (category || "").toLowerCase();
  if (c.includes("sayur")) return "/mocks/mock_sayuran_1784287377280.png";
  if (c.includes("buah")) return "/mocks/mock_buah_1784287387762.png";
  if (c.includes("daging")) return "/mocks/mock_daging_1784287407027.png";
  if (c.includes("susu")) return "/mocks/mock_susu_1784287426207.png";
  if (c.includes("telur")) return "/mocks/mock_telur_1784287417129.png";
  if (c.includes("pupuk")) return "/mocks/mock_pupuk_1784287436416.png";
  if (c.includes("alat")) return "/mocks/mock_alat_1784287447181.png";
  return "/mocks/mock_ternak_1784287398084.png";
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ p, index, onClick, cartQty, onUpdateQuantity }: { p: any; index: number; onClick: () => void; cartQty: number; onUpdateQuantity: (e: React.MouseEvent, delta: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "500px" }}
      transition={{ duration: 0.3 }}
      onClick={p.stock > 0 ? onClick : undefined}
      className={`rounded-[2rem] flex flex-col p-4 shadow-[0_12px_24px_-12px_rgba(43,76,59,0.08)] group relative transition-all duration-500 overflow-hidden z-0 will-change-transform will-change-opacity ${
        cartQty > 0 ? "border-transparent shadow-[0_12px_24px_-8px_rgba(43,76,59,0.3)]" : "bg-white border border-[#E8E3D2]"
      } ${
        p.stock > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-60 grayscale-[0.8]"
      }`}
    >
      {/* Background Gradient Animation Layer */}
      <div 
        className={`absolute inset-0 bg-pranata -z-10 transition-opacity duration-500 ease-in-out ${cartQty > 0 ? 'opacity-100' : 'opacity-0'}`} 
      />
      {/* Product Image */}
      <div className="w-full h-32 flex items-center justify-center mb-4 bg-[#F8F6F0] rounded-[1.5rem] group-hover:scale-[0.98] transition-transform overflow-hidden relative shrink-0">
        {p.imageUrls && p.imageUrls.length > 0 ? (
          <img
            src={p.imageUrls[0]}
            alt={p.title}
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={getCategoryFallbackImage(p.category)} 
            alt={p.title} 
            decoding="async"
            className="w-full h-full object-cover opacity-90 mix-blend-multiply" 
          />
        )}
        
        {p.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <span className="bg-[#C25939] text-white font-black px-4 py-2 rounded-xl text-sm shadow-lg rotate-[-10deg]">
              HABIS
            </span>
          </div>
        )}
        {index < 2 && p.stock > 0 && (
          <div className="absolute top-2 right-2 bg-[#F5990D] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
            <Star size={10} fill="currentColor" /> TERLARIS
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-start flex-1 w-full text-left mt-1">
        <h3 className={`font-black text-[15px] leading-tight mb-2 line-clamp-2 w-full ${cartQty > 0 ? "text-white" : "text-[#1C241E]"}`} title={p.title}>{p.title}</h3>
        
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <div className={`px-2 py-1 rounded-lg ${cartQty > 0 ? "bg-white/10" : "bg-[#F8F6F0]"}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${cartQty > 0 ? "text-white/80" : "text-[#5A635B]"}`}>{p.category || "Produk"}</span>
          </div>
          {p.grade && (() => {
            const g = p.grade.toLowerCase();
            let style = { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", icon: Info };
            if (g === "premium") style = { bg: "bg-gradient-to-r from-amber-200 to-yellow-400", text: "text-amber-900", border: "border-amber-300", icon: Crown };
            else if (g.includes("a")) style = { bg: "bg-gradient-to-r from-emerald-100 to-emerald-300", text: "text-emerald-900", border: "border-emerald-400", icon: Star };
            else if (g.includes("b")) style = { bg: "bg-gradient-to-r from-cyan-100 to-cyan-300", text: "text-cyan-900", border: "border-cyan-400", icon: CheckCircle };
            else if (g.includes("c")) style = { bg: "bg-gradient-to-r from-orange-100 to-orange-300", text: "text-orange-900", border: "border-orange-400", icon: Info };
            const GradeIcon = style.icon;
            return (
              <span className={`${style.bg} ${style.text} border ${style.border} px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm ${cartQty > 0 ? "opacity-90" : ""}`}>
                <GradeIcon size={10} strokeWidth={3} />
                {p.grade}
              </span>
            );
          })()}
        </div>
        
        <div className={`mt-auto w-full pt-3 border-t flex items-end justify-between ${cartQty > 0 ? "border-white/20" : "border-[#E8E3D2]/50"}`}>
          <div>
            <p className={`text-lg font-black leading-none mb-1 ${cartQty > 0 ? "text-white" : "text-[#C25939]"}`}>
              Rp {p.price?.toLocaleString()}
            </p>
            <p className={`text-[10px] font-bold ${cartQty > 0 ? "text-white/80" : "text-[#2B4C3B]"}`}>Stok: {p.stock} {p.unit}</p>
          </div>
        </div>
      </div>

      {/* Add Button */}
      {p.stock > 0 ? (
        cartQty > 0 ? (
          <div className="mt-5 w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2 rounded-xl rounded-b-[1.25rem] flex items-center justify-between px-4 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => onUpdateQuantity(e, -1)} className="p-1 hover:bg-white/20 rounded-md transition-colors"><Minus size={18} strokeWidth={3} /></button>
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={cartQty}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-black"
              >
                {cartQty}
              </motion.span>
            </AnimatePresence>
            <button onClick={(e) => onUpdateQuantity(e, 1)} disabled={cartQty >= p.stock} className={`p-1 rounded-md transition-colors ${cartQty >= p.stock ? 'opacity-50 pointer-events-none' : 'hover:bg-white/20'}`}><Plus size={18} strokeWidth={3} /></button>
          </div>
        ) : (
          <button 
            onClick={(e) => onUpdateQuantity(e, 1)}
            className="mt-5 w-full bg-[#EEF2E6] hover:bg-[#DDE2D6] text-[#2B4C3B] py-3.5 rounded-xl rounded-b-[1.25rem] flex items-center justify-center transition-colors"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        )
      ) : (
        <div className="mt-5 w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl rounded-b-[1.25rem] flex items-center justify-center">
          <X size={20} strokeWidth={3} />
        </div>
      )}
    </motion.div>
  );
});

// Removed OrderRow as it's now in dedicated Orders page

// ─── Custom Dropdown ────────────────────────────────────────────────────────────
const CustomDropdown = ({ value, options, onChange, icon: Icon, placeholder }: { value: string, options: {label: any, value: string}[], onChange: (val: string) => void, icon: any, placeholder?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const displayValue = options.find(o => o.value === value)?.label || placeholder || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 bg-white border-2 border-[#E8E3D2] text-[#2B4C3B] font-black text-sm rounded-full py-2.5 pl-4 pr-3 hover:bg-[#F8F6F0] hover:border-[#DDE2D6] transition-all shadow-sm min-w-[160px]"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#C25939]" />
          <span>{displayValue}</span>
        </div>
        <ChevronRight size={16} className={`text-[#A4B0A7] transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#E8E3D2] rounded-3xl p-2 shadow-[0_12px_24px_-8px_rgba(43,76,59,0.15)] z-50 overflow-hidden"
          >
            {options.map((opt, i) => (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-colors flex items-center gap-2 ${
                  value === opt.value ? "bg-[#2B4C3B] text-white" : "text-[#5A635B] hover:bg-[#F8F6F0] hover:text-[#1C241E]"
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [selectedGrade, setSelectedGrade] = useState("Semua Grade");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  
  const [canScroll, setCanScroll] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScroll(scrollWidth > clientWidth + 2);
    setIsAtStart(scrollLeft <= 40);
    setIsAtEnd(Math.ceil(scrollLeft) >= scrollWidth - clientWidth - 40);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [products]); // Re-check when products load

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const { scrollWidth, clientWidth } = categoryScrollRef.current;
      categoryScrollRef.current.scrollTo({ 
        left: direction === 'left' ? 0 : scrollWidth - clientWidth, 
        behavior: "smooth" 
      });
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, p: any, delta: number) => {
    e.stopPropagation();
    
    // Spawn animation if adding for the first time
    const existing = cartItems.find(item => item.productId === p.id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty === 0 && delta > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const animId = Date.now();
      setAnimations(prev => [...prev, { id: animId, x: rect.left + rect.width/2 - 20, y: rect.top, image: p.imageUrls?.[0] }]);
      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== animId));
      }, 500); // 0.5s animation
    }

    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    const session = JSON.parse(sessionStr);

    const newQty = currentQty + delta;

    if (newQty > p.stock) return;

    // Optimistic update
    let newCart = [...cartItems];
    if (newQty <= 0) {
      newCart = newCart.filter(item => item.productId !== p.id);
    } else {
      if (existing) {
        existing.quantity = newQty;
      } else {
        newCart.push({ productId: p.id, quantity: newQty, product: p });
      }
    }
    setCartItems(newCart);
    if (currentQty === 0 && delta > 0) {
      setTimeout(() => setCartCount(newCart.length), 400); // Sync with animation arrival
    } else {
      setCartCount(newCart.length);
    }

    try {
      if (newQty <= 0) {
        await fetchApi(`${API_BASE}/api/cart/${session.id}/${p.id}`, { method: 'DELETE' });
      } else {
        await fetchApi(`${API_BASE}/api/cart/${session.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: p.id, quantity: newQty })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 280], [1, 0]);
  const heroY = useTransform(scrollY, [0, 280], [0, -60]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    const session = JSON.parse(sessionStr);
    setProfile(session);
    try {
      const [prodRes, ordRes, cartRes] = await Promise.all([
        fetchApi(`${API_BASE}/api/products?limit=200`).catch(() => null),
        fetchApi(`${API_BASE}/api/orders/BUYER/${session.id}`).catch(() => null),
        fetchApi(`${API_BASE}/api/cart/${session.id}`).catch(() => null)
      ]);
      
      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        const arr = Array.isArray(prodData) ? prodData : (prodData.data ?? []);
        setProducts(arr);
      }
      
      if (ordRes && ordRes.ok) {
        const ordData = await ordRes.json();
        if (Array.isArray(ordData)) setOrders(ordData);
      }
      
      if (cartRes && cartRes.ok) {
        const cartData = await cartRes.json();
        if (Array.isArray(cartData)) {
          setCartItems(cartData);
          setCartCount(cartData.length);
        }
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    
    setLoading(false);
  };

  const { displayedProducts, hasMore } = useMemo(() => {
    let filtered = products.filter(p => {
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchGrade = true;
      if (selectedCategory === "Daging" && selectedGrade !== "Semua Grade") {
        matchGrade = p.grade && p.grade.toLowerCase().includes(selectedGrade.toLowerCase());
      }
      
      return matchCat && matchSearch && matchGrade;
    });

    filtered.sort((a, b) => {
      if (sortBy === "Harga Terendah") return a.price - b.price;
      if (sortBy === "Harga Tertinggi") return b.price - a.price;
      // Terbaru
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      displayedProducts: filtered.slice(0, 10),
      hasMore: filtered.length > 10
    };
  }, [products, searchQuery, selectedCategory, selectedGrade, sortBy]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="px-4 pt-4 md:px-8">
        <div className="bg-pranata rounded-[2rem] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-24 h-6 rounded-md skeleton-shimmer bg-[#3A6B49] hidden sm:block" />
          </div>
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="w-full h-11 rounded-full skeleton-shimmer bg-[#3A6B49]" />
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-10 h-10 rounded-full skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-10 h-10 rounded-full skeleton-shimmer bg-[#3A6B49]" />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-4 relative z-10">
        <div className="bg-pranata rounded-t-[2.5rem] rounded-b-[4rem] sm:rounded-b-[6rem] p-8 md:p-16 h-[400px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="w-full max-w-xl space-y-4">
            <div className="w-3/4 h-12 rounded-xl skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-1/2 h-12 rounded-xl skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-2/3 h-4 rounded-md skeleton-shimmer bg-[#3A6B49] mt-6" />
            <div className="w-1/2 h-4 rounded-md skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-40 h-12 rounded-full skeleton-shimmer bg-[#3A6B49] mt-8" />
          </div>
          <div className="relative z-10 mt-12 md:mt-0 md:absolute md:-bottom-12 md:right-12 lg:right-24 h-64 md:h-96 w-64 md:w-96 bg-[#3A6B49] rounded-t-[3rem] rounded-b-xl skeleton-shimmer hidden md:block" />
        </div>
      </div>
      <div className="mt-6 md:-mt-8 relative z-20 w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="shrink-0 w-44 h-[140px] rounded-[2rem] skeleton-shimmer" />
          ))}
        </div>
      </div>
      <div className="px-4 md:px-8 mt-12 max-w-[1400px] mx-auto">
        <div className="w-64 h-8 rounded-lg skeleton-shimmer mb-8" />
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="shrink-0 w-48 h-[280px] rounded-[2rem] skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" >

      {/* ── Top Navbar ── */}
      <MarketplaceNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── Hero Section ── */}
      <div className="px-4 md:px-8 mt-4 relative z-10">
        <div className="bg-pranata rounded-t-[2.5rem] rounded-b-[4rem] sm:rounded-b-[6rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg min-h-[400px]">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Hasil panen segar <br /> langsung ke pintu Anda
            </h1>
            <p className="text-[#A4C4A8] text-base sm:text-lg font-medium mb-8 max-w-md">
              Dapatkan produk organik dan kebutuhan harian yang bersumber dari petani lokal dengan potongan harga hingga 40%.
            </p>
            <button 
              onClick={() => document.getElementById("search-mobile")?.focus()}
              className="bg-[#EEF2E6] hover:bg-white text-[#2B4C3B] px-8 py-3.5 rounded-full font-black text-lg transition-colors shadow-lg"
            >
              Belanja Sekarang
            </button>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 md:absolute md:-bottom-12 md:right-12 lg:right-24 h-64 md:h-96 w-64 md:w-96 flex items-end justify-center">
            {/* Image Slot Placeholder */}
          </div>
        </div>
      </div>

      {/* Mobile Search - Only visible on small screens */}
      <div className="md:hidden px-4 mt-6 relative z-20">
        <div className="relative">
          <input 
            id="search-mobile"
            type="text" 
            placeholder="Cari sayuran, buah, atau ternak..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#1C241E] font-semibold text-sm rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2B4C3B] border border-[#E8E3D2]"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A635B]" />
        </div>
      </div>

      {/* ── Categories Scroll ── */}
      <div className="mt-6 md:-mt-8 relative z-20 w-full max-w-[1400px] mx-auto group">
        
        {/* Left Arrow */}
        <button 
          onClick={() => scrollCategories('left')}
          className={`hidden md:flex absolute left-4 xl:left-8 top-[40%] -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-[0_8px_24px_-8px_rgba(43,76,59,0.3)] items-center justify-center text-[#2B4C3B] hover:scale-110 hover:bg-[#EEF2E6] transition-all border border-[#E8E3D2] ${canScroll && !isAtStart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={() => scrollCategories('right')}
          className={`hidden md:flex absolute right-4 xl:right-8 top-[40%] -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-[0_8px_24px_-8px_rgba(43,76,59,0.3)] items-center justify-center text-[#2B4C3B] hover:scale-110 hover:bg-[#EEF2E6] transition-all border border-[#E8E3D2] ${canScroll && !isAtEnd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>

        <div 
          ref={categoryScrollRef}
          onScroll={handleScroll}
          className="flex md:justify-center overflow-x-auto hide-scrollbar gap-4 pb-6 pt-2 snap-x px-4 md:px-8 scroll-smooth relative"
          style={{
            maskImage: canScroll ? `linear-gradient(to right, ${isAtStart ? 'black 0%' : 'transparent, black 60px'}, ${isAtEnd ? 'black 100%' : 'black calc(100% - 60px), transparent'})` : 'none',
            WebkitMaskImage: canScroll ? `linear-gradient(to right, ${isAtStart ? 'black 0%' : 'transparent, black 60px'}, ${isAtEnd ? 'black 100%' : 'black calc(100% - 60px), transparent'})` : 'none'
          }}
        >
          {CATEGORIES.map(cat => (
            <div 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`snap-start shrink-0 w-44 rounded-[2rem] p-5 flex flex-col min-h-[140px] relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-200 ${
                selectedCategory === cat.name 
                  ? "bg-pranata border-4 border-white shadow-[0_16px_32px_-12px_rgba(43,76,59,0.5)]" 
                  : "bg-white border-2 border-[#E8E3D2] shadow-[0_8px_24px_-12px_rgba(43,76,59,0.12)]"
              }`}
            >
              <h3 className={`font-black text-base ${selectedCategory === cat.name ? "text-white" : "text-[#1C241E]"}`}>{cat.name}</h3>
              <p className={`text-xs font-semibold ${selectedCategory === cat.name ? "text-[#A4C4A8]" : "text-[#7A8678]"}`}>Kategori</p>
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className={`w-10 h-10 absolute bottom-3 right-3 object-contain group-hover:scale-110 transition-transform origin-bottom-right ${selectedCategory === cat.name ? "opacity-100" : "opacity-80"}`} />
              ) : (
                <span className={`text-4xl absolute bottom-3 right-3 group-hover:scale-110 transition-transform origin-bottom-right ${selectedCategory === cat.name ? "opacity-100" : "opacity-80"}`}>{cat.icon}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Products Section ── */}
      <div className="px-4 md:px-8 mt-12 max-w-[1400px] mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#1C241E] tracking-tight">
            {selectedCategory === "Semua" ? "Mungkin Anda butuhkan" : selectedCategory}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 relative z-20">
            {selectedCategory === "Daging" && (
              <CustomDropdown
                value={selectedGrade}
                onChange={setSelectedGrade}
                icon={Star}
                placeholder="Filter Grade"
                options={[
                  { label: <div className="flex items-center gap-2">Semua Grade</div>, value: "Semua Grade" },
                  { label: <div className="flex items-center gap-2">Premium <Crown size={14} className="text-[#F5990D]" /></div>, value: "Premium" },
                  { label: <div className="flex items-center gap-2">Grade A <Star size={14} className="text-emerald-600" /></div>, value: "Grade A" },
                  { label: <div className="flex items-center gap-2">Grade B <CheckCircle size={14} className="text-cyan-600" /></div>, value: "Grade B" },
                  { label: <div className="flex items-center gap-2">Grade C <Info size={14} className="text-amber-600" /></div>, value: "Grade C" },
                ]}
              />
            )}

            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              icon={SlidersHorizontal}
              placeholder="Urutkan"
              options={[
                { label: <div className="flex items-center gap-2">Terbaru</div>, value: "Terbaru" },
                { label: <div className="flex items-center gap-2"><TrendingDown size={14} className="text-[#2B4C3B]" /> Harga Terendah</div>, value: "Harga Terendah" },
                { label: <div className="flex items-center gap-2"><TrendingUp size={14} className="text-[#C25939]" /> Harga Tertinggi</div>, value: "Harga Tertinggi" }
              ]}
            />

            {hasMore && (
              <button onClick={() => router.push(`/marketplace/products?category=${selectedCategory}`)} className="text-white font-bold text-sm flex items-center gap-2 bg-[#C25939] px-5 py-2.5 rounded-full hover:bg-[#A34529] hover:-translate-y-0.5 transition-all shadow-md ml-auto sm:ml-2">
                Lihat Semua <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#DDE2D6] rounded-[2rem] bg-white max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-[#5A635B] mb-2">Produk tidak ditemukan</h3>
            <p className="text-[#A4B0A7] text-sm font-medium">Coba ubah kata kunci atau kategori pencarian.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-8 snap-x px-1">
            {displayedProducts.map((p, i) => {
              const qty = cartItems.find(item => item.productId === p.id)?.quantity || 0;
              return (
                <div key={p.id} className="snap-start shrink-0 w-48">
                  <ProductCard 
                    p={p} 
                    index={i} 
                    onClick={() => router.push(`/marketplace/product/${p.id}`)}
                    cartQty={qty}
                    onUpdateQuantity={(e, delta) => handleUpdateQuantity(e, p, delta)} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fly to Cart Animations */}
      {animations.map(anim => (
        <motion.div
          key={anim.id}
          initial={{ x: anim.x, y: anim.y, scale: 1, opacity: 1 }}
          animate={{ x: window.innerWidth - 40, y: 30, scale: 0.1, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 z-[100] w-12 h-12 rounded-xl shadow-xl overflow-hidden border-2 border-[#2B4C3B] bg-white flex items-center justify-center pointer-events-none"
        >
          {anim.image ? <img src={anim.image} className="w-full h-full object-cover" /> : <Package size={20} className="text-[#2B4C3B]" />}
        </motion.div>
      ))}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>


      {/* ── Footer ── */}
      <footer className="bg-[#1C241E] text-white pt-16 pb-8 rounded-t-[3rem] mt-10 relative z-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pranata rounded-xl flex items-center justify-center">
                <Store size={20} className="text-[#F5990D]" />
              </div>
              <h2 className="font-black text-white text-2xl m-0 leading-none">Pranata</h2>
            </div>
            <p className="text-[#A4C4A8] text-sm font-medium leading-relaxed max-w-sm">
              Platform jual beli hasil pertanian langsung dari petani lokal. Mendorong kesejahteraan petani dengan harga yang lebih adil dan transparan.
            </p>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-white">Layanan Kami</h4>
            <ul className="space-y-3 text-sm font-medium text-[#A4C4A8]">
              <li><Link href="#" className="hover:text-white transition-colors">Bantuan & FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cara Berjualan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-white">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm font-medium text-[#A4C4A8]">
              <li>Jl. Pertanian Raya No. 42, Sleman, DI Yogyakarta</li>
              <li>Email: halo@pasartani.id</li>
              <li>Telepon: 0812-3456-7890</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-[#A4C4A8]">
          <p>© 2026 Pranata. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Dibuat dengan ❤️ di Yogyakarta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
