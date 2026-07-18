"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Store, ShoppingCart, Truck, CheckCircle, Search, SlidersHorizontal, ArrowRight, Package, MapPin, Star, ShieldCheck, X, Settings, Bird, Plus, Minus, Menu, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Semua", icon: "🌾" },
  { name: "Sayuran", icon: "🥬" },
  { name: "Buah-buahan", icon: "🍎" },
  { name: "Ternak (Hidup)", icon: "🐄" },
  { name: "Daging", icon: "🥩" },
  { name: "Telur", icon: "🥚" },
  { name: "Susu & Olahan", icon: "🥛" },
  { name: "Pupuk & Bibit", icon: "🌱" },
  { name: "Alat Tani", icon: "🚜" },
];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ p, index, onClick, cartQty, onUpdateQuantity }: { p: any; index: number; onClick: () => void; cartQty: number; onUpdateQuantity: (e: React.MouseEvent, delta: number) => void }) {
  return (
    <motion.div
      onClick={p.stock > 0 ? onClick : undefined}
      whileHover={p.stock > 0 ? { y: -4, boxShadow: "0 12px 24px -12px rgba(43,76,59,0.15)" } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-[2rem] flex flex-col p-4 shadow-[0_12px_24px_-12px_rgba(43,76,59,0.08)] group relative transition-all duration-500 overflow-hidden z-0 ${
        cartQty > 0 ? "border-transparent shadow-[0_12px_24px_-8px_rgba(43,76,59,0.3)]" : "bg-white border border-[#E8E3D2]"
      } ${
        p.stock > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-60 grayscale-[0.8]"
      }`}
    >
      {/* Background Gradient Animation Layer */}
      <div 
        className={`absolute inset-0 bg-pranala -z-10 transition-opacity duration-500 ease-in-out ${cartQty > 0 ? 'opacity-100' : 'opacity-0'}`} 
      />
      {/* Product Image */}
      <div className="w-full h-32 flex items-center justify-center mb-4 bg-[#F8F6F0] rounded-[1.5rem] group-hover:scale-[0.98] transition-transform overflow-hidden relative shrink-0">
        {p.imageUrls && p.imageUrls.length > 0 ? (
          <img
            src={p.imageUrls[0]}
            alt={p.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={40} className="text-[#C4BAA8] opacity-60" />
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
      <div className="flex flex-col items-center text-center flex-1">
        <h3 className={`font-black text-[15px] leading-tight mb-1 line-clamp-1 w-full ${cartQty > 0 ? "text-white" : "text-[#1C241E]"}`} title={p.title}>{p.title}</h3>
        <p className={`text-xs font-semibold ${cartQty > 0 ? "text-white/80" : "text-[#5A635B]"}`}>{p.category || "Produk"}</p>
        <p className={`text-[11px] font-bold mt-1.5 mb-3 ${cartQty > 0 ? "text-white/60" : "text-[#A4B0A7]"}`}>Stok {p.stock} {p.unit}</p>
        
        <p className={`text-xl font-black mt-auto ${cartQty > 0 ? "text-white" : "text-[#2B4C3B]"}`}>
          Rp {p.price?.toLocaleString()}
        </p>
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
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);
  const [viewAll, setViewAll] = useState(false);
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
        await fetch(`${API_BASE}/api/cart/${session.id}/${p.id}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_BASE}/api/cart/${session.id}`, {
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
        fetch(`${API_BASE}/api/products`).catch(() => null),
        fetch(`${API_BASE}/api/orders/BUYER/${session.id}`).catch(() => null),
        fetch(`${API_BASE}/api/cart/${session.id}`).catch(() => null)
      ]);
      
      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);
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



  const filteredProducts = products.filter(p =>
    (selectedCategory === "Semua" || p.category === selectedCategory) &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="px-4 pt-4 md:px-8">
        <div className="bg-pranala rounded-[2rem] p-4 flex items-center justify-between shadow-md">
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
        <div className="bg-pranala rounded-t-[2.5rem] rounded-b-[4rem] sm:rounded-b-[6rem] p-8 md:p-16 h-[400px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-lg">
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
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>

      {/* ── Top Navbar ── */}
      <MarketplaceNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ── Hero Section ── */}
      <div className="px-4 md:px-8 mt-4 relative z-10">
        <div className="bg-pranala rounded-t-[2.5rem] rounded-b-[4rem] sm:rounded-b-[6rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg min-h-[400px]">
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
            <div className="w-full h-full bg-[#3A6B49]/50 backdrop-blur-sm rounded-t-[3rem] rounded-b-xl border-2 border-dashed border-[#A4C4A8] flex items-center justify-center relative overflow-hidden">
              <span className="text-[#A4C4A8] font-bold tracking-widest text-sm uppercase">Image Slot</span>
            </div>
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
          className="flex overflow-x-auto hide-scrollbar gap-4 pb-6 pt-2 snap-x px-4 md:px-8 scroll-smooth relative"
          style={{
            maskImage: canScroll ? `linear-gradient(to right, ${isAtStart ? 'black 0%' : 'transparent, black 60px'}, ${isAtEnd ? 'black 100%' : 'black calc(100% - 60px), transparent'})` : 'none',
            WebkitMaskImage: canScroll ? `linear-gradient(to right, ${isAtStart ? 'black 0%' : 'transparent, black 60px'}, ${isAtEnd ? 'black 100%' : 'black calc(100% - 60px), transparent'})` : 'none'
          }}
        >
          {CATEGORIES.map(cat => (
            <div 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`snap-start shrink-0 w-44 border rounded-[2rem] p-5 flex flex-col min-h-[140px] relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-200 ${
                selectedCategory === cat.name 
                  ? "bg-pranala border-[#2B4C3B] shadow-[0_12px_24px_-12px_rgba(43,76,59,0.3)]" 
                  : "bg-white border-[#E8E3D2] shadow-[0_8px_24px_-12px_rgba(43,76,59,0.12)]"
              }`}
            >
              <h3 className={`font-black text-base ${selectedCategory === cat.name ? "text-white" : "text-[#1C241E]"}`}>{cat.name}</h3>
              <p className={`text-xs font-semibold ${selectedCategory === cat.name ? "text-[#A4C4A8]" : "text-[#7A8678]"}`}>Kategori</p>
              <span className={`text-4xl absolute bottom-3 right-3 group-hover:scale-110 transition-transform origin-bottom-right ${selectedCategory === cat.name ? "opacity-100" : "opacity-80"}`}>{cat.icon}</span>
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
          <button 
            onClick={() => router.push('/marketplace/products')}
            className="flex items-center gap-1 text-[#C25939] font-bold text-sm hover:gap-2 transition-all"
          >
            Lihat lainnya <ChevronRight size={16} strokeWidth={3} className="transition-transform" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#DDE2D6] rounded-[2rem] bg-white max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-[#5A635B] mb-2">Produk tidak ditemukan</h3>
            <p className="text-[#A4B0A7] text-sm font-medium">Coba ubah kata kunci atau kategori pencarian.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-8 snap-x px-1">
            {filteredProducts.map((p, i) => {
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
              <div className="w-10 h-10 bg-pranala rounded-xl flex items-center justify-center">
                <Store size={20} className="text-[#F5990D]" />
              </div>
              <h2 className="font-black text-white text-2xl m-0 leading-none">PRANALA</h2>
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
          <p>© 2026 PRANALA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Dibuat dengan ❤️ di Yogyakarta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
