"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, Zap, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketplaceNavbar({ 
  searchQuery, 
  setSearchQuery,
  leftContent,
  centerContent,
  cartCount
}: { 
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  cartCount?: number;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [localCartCount, setLocalCartCount] = useState(0);

  const displayCartCount = cartCount !== undefined ? cartCount : localCartCount;

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (sessionStr) setProfile(JSON.parse(sessionStr));

    const checkCart = async () => {
      if (!sessionStr) return;
      const session = JSON.parse(sessionStr);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      try {
        const res = await fetchApi(`${API_BASE}/api/cart/${session.id}`);
        if (res.ok) {
          const cartData = await res.json();
          if (Array.isArray(cartData)) setLocalCartCount(cartData.length);
        }
      } catch (e) {
        // network error, ignore polling failure
      }
    };

    checkCart();
    
    const interval = setInterval(checkCart, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 sticky top-0 z-50 bg-[#F8F6F0] py-4 px-4 md:px-8 border-b border-[#E8E3D2]/50 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.05)] text-[#1C241E]" >
      {/* Left */}
      {leftContent ? (
        <div className="flex items-center gap-4 shrink-0">{leftContent}</div>
      ) : (
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/marketplace" className="flex items-center gap-2 group">
            <div className="h-8 group-hover:scale-105 transition-transform">
              <img src="/logos/marketplace/marketplace-black.png" alt="Pranata" className="h-full object-contain" />
            </div>
          </Link>
        </div>
      )}

      {/* Center */}
      {centerContent ? (
        <div className="flex-1 flex justify-center mx-4">{centerContent}</div>
      ) : setSearchQuery !== undefined ? (
        <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
          <input 
            type="text" 
            placeholder="Cari sayuran, buah, atau ternak..." 
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E8E3D2] text-[#1C241E] font-bold text-sm rounded-2xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2B4C3B] transition-all shadow-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A635B]" />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-semibold text-[#84B0A5]">
          {/* Removed default links */}
        </div>
      )}

      {/* Right: Info & Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Cart */}
        <Link href="/marketplace/cart" className="relative p-2 text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#E8E3D2]/50 rounded-xl transition-all">
          <ShoppingCart size={24} />
          <AnimatePresence>
            {displayCartCount > 0 && (
              <motion.span 
                key={displayCartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -top-1 -right-1 bg-[#C25939] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-[#F8F6F0]"
              >
                {displayCartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button onClick={() => router.push("/settings")} className="flex items-center gap-3 transition-transform hover:scale-105 pl-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8E3D2] overflow-hidden shadow-sm flex items-center justify-center">
            {(profile?.avatarUrl || profile?.avatar) ? (
              <img src={profile.avatarUrl || profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#3A6B49] flex items-center justify-center text-white font-bold text-lg">
                {(profile?.fullName || profile?.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
