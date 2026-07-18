"use client";

import { useState, useEffect, memo } from "react";
import { Search, ChevronLeft, Package, Star, Plus, Minus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

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


export default function MarketplaceProductsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  usePageLoading(loading);

  useEffect(() => { loadData(); }, []);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    
    const session = JSON.parse(sessionStr);
    setProfile(session);
    
    try {
      const [prodRes, cartRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`).catch(() => null),
        fetch(`${API_BASE}/api/cart/${session.id}`).catch(() => null)
      ]);
      
      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);
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

  const filteredProducts = products.filter(p =>
    (selectedCategory === "Semua" || p.category === selectedCategory) &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="p-8 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full skeleton-shimmer bg-[#E8E3D2]" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      <MarketplaceNavbar cartCount={cartCount} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-24">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/marketplace')}
            className="w-10 h-10 bg-white border border-[#E8E3D2] rounded-full flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] shadow-sm transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-[#1C241E]">Semua Produk</h1>
        </div>

        {/* Filter Section (Moved from Homepage) */}
        <div className="bg-white rounded-t-[2.5rem] rounded-b-xl md:rounded-full p-2 pl-2 md:pl-6 shadow-[0_8px_30px_-12px_rgba(43,76,59,0.12)] border border-[#E8E3D2]/50 flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto px-4 md:px-0 py-2 md:py-0">
            <Search className="text-[#A4B0A7] shrink-0" size={20} />
            <input 
              type="text"
              placeholder="Cari sayuran, alat tani..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-transparent outline-none text-[#1C241E] placeholder:text-[#A4B0A7] font-medium"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-[#E8E3D2]" />
          
          <div className="w-full md:flex-1 overflow-x-auto hide-scrollbar relative">
            <div className="flex items-center gap-2 px-2 pb-2 md:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                    selectedCategory === cat.name
                      ? "bg-[#2B4C3B] text-white shadow-md"
                      : "bg-[#F8F6F0] text-[#5A635B] hover:bg-[#E8E3D2] hover:text-[#1C241E]"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#DDE2D6] rounded-[2rem] bg-white max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-[#5A635B] mb-2">Produk tidak ditemukan</h3>
            <p className="text-[#A4B0A7] text-sm font-medium">Coba ubah kata kunci atau kategori pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-8">
            {filteredProducts.map((p, i) => {
              const qty = cartItems.find(item => item.productId === p.id)?.quantity || 0;
              return (
                <ProductCard 
                  key={p.id} 
                  p={p} 
                  index={i} 
                  onClick={() => router.push(`/marketplace/product/${p.id}`)}
                  cartQty={qty}
                  onUpdateQuantity={(e, delta) => handleUpdateQuantity(e, p, delta)} 
                />
              );
            })}
          </div>
        )}
      </main>

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
    </div>
  );
}
