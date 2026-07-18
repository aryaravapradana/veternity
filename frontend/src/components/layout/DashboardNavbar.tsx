"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, Bell, ChevronDown } from "lucide-react";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (sessionStr) {
      setProfile(JSON.parse(sessionStr));
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="flex flex-col xl:flex-row items-center justify-between gap-6 sticky top-0 z-50 bg-[#F8F6F0] py-4 px-4 md:px-8 border-b border-[#E8E3D2]/50 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.05)] text-[#1C241E]" >
      
      {/* Brand Logo - Kiri */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/dashboard" className="h-8 transition-transform hover:scale-105">
          <img src="/logos/hub/hub-black.png" alt="Pranata" className="h-full object-contain" />
        </Link>
      </div>

      {/* Navigasi Utama - Tengah */}
      <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-bold text-[#7A8678]">
        <Link 
          href="/dashboard" 
          className={`pb-1 ${isActive('/dashboard') ? 'text-[#1C241E] border-b-2 border-[#1C241E]' : 'hover:text-[#2B4C3B]'}`}
        >
          Hub
        </Link>
        <Link 
          href="/dashboard/calendar" 
          className={`pb-1 ${isActive('/dashboard/calendar') ? 'text-[#1C241E] border-b-2 border-[#1C241E]' : 'hover:text-[#2B4C3B]'}`}
        >
          Kalender
        </Link>
        <Link 
          href="/dashboard/store" 
          className={`pb-1 ${isActive('/dashboard/store') ? 'text-[#1C241E] border-b-2 border-[#1C241E]' : 'hover:text-[#2B4C3B]'}`}
        >
          Toko Saya
        </Link>
        <Link 
          href="/dashboard/orders" 
          className={`pb-1 ${isActive('/dashboard/orders') ? 'text-[#1C241E] border-b-2 border-[#1C241E]' : 'hover:text-[#2B4C3B]'}`}
        >
          Pesanan
        </Link>
      </nav>

      {/* Aksesoris & Akun - Kanan */}
      <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#5A635B] hover:bg-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#C25939] rounded-full border-2 border-[#F8F6F0]"></span>
          </button>
          
          <button onClick={() => router.push("/settings")} className="flex items-center gap-2 text-sm font-bold text-[#1C241E] transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-[#E8E3D2] border-2 border-white overflow-hidden shadow-sm flex items-center justify-center">
              {(profile?.avatarUrl || profile?.avatar) ? (
                <img src={profile.avatarUrl || profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#3A6B49] flex items-center justify-center text-white font-bold text-lg">
                  {(profile?.fullName || profile?.name || profile?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="hidden sm:inline">Hi, {profile?.name?.split(" ")[0] || profile?.fullName?.split(" ")[0] || "User"} <ChevronDown size={14} className="inline text-[#7A8678]"/></span>
          </button>
        </div>
      </div>

    </header>
  );
}
