"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, Zap, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MarketplaceNavbar({ 
  searchQuery, 
  setSearchQuery,
  leftContent,
  centerContent
}: { 
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (sessionStr) setProfile(JSON.parse(sessionStr));

    const checkCart = () => {
      const saved = localStorage.getItem("farmpro_cart");
      if (saved) setCartCount(JSON.parse(saved).length);
      else setCartCount(0);
    };

    checkCart();
    
    // Polling is acceptable for localstorage sync across identical tabs in a demo
    const interval = setInterval(checkCart, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 sticky top-0 z-50 bg-[#F8F6F0] py-4 px-4 md:px-8 border-b border-[#E8E3D2]/50 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.05)] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      {/* Left */}
      {leftContent ? (
        <div className="flex items-center gap-4 shrink-0">{leftContent}</div>
      ) : (
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/marketplace" className="flex items-center gap-2 group">
            <div className="h-8 group-hover:scale-105 transition-transform">
              <img src="/logo black.png" alt="PRANALA" className="h-full object-contain" />
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
        <button onClick={() => router.push("/marketplace/cart")} className="relative transition-transform hover:scale-105">
          <div className="w-10 h-10 bg-white border border-[#E8E3D2] rounded-xl flex items-center justify-center shadow-sm">
            <ShoppingCart size={18} className="text-[#2B4C3B]" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#C25939] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
        <button onClick={() => router.push("/settings")} className="flex items-center gap-3 transition-transform hover:scale-105 pl-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8E3D2] overflow-hidden shadow-sm">
            <img src={profile?.avatarUrl || profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </button>
      </div>
    </header>
  );
}
