"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, Zap, Trash2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/loading-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  usePageLoading(loading);

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    setProfile(JSON.parse(sessionStr));

    const saved = localStorage.getItem("farmpro_cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("farmpro_cart", JSON.stringify(newCart));
  };

  const updateQty = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const stock = item.product?.stock || 0;
        const currentQ = item.quantity || item.orderQuantity || 1;
        const minQ = 1;
        const newQ = Math.max(minQ, Math.min(stock, currentQ + delta));
        return { ...item, quantity: newQ, orderQuantity: newQ };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || item.orderQuantity || 1)), 0);
  const discount = subtotal > 100000 ? 5000 : 0; // Simple dummy logic for discount
  const total = subtotal - discount || 0;

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E] font-sans pb-24" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      
      {/* ── Top Navbar ── */}
      <div className="px-4 pt-4 md:px-8">
        <nav className="bg-[#2B4C3B] text-white rounded-[2rem] p-4 flex items-center justify-between shadow-md">
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <Menu size={24} />
            </button>
            <Link href="/marketplace" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart size={16} className="text-[#EEF2E6]" />
              </div>
              <span className="font-black text-xl tracking-tight hidden sm:block">Pasar Tani</span>
            </Link>
          </div>

          {/* Center: Links */}
          <div className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold text-[#A4C4A8]">
            <Link href="/marketplace" className="hover:text-white transition-colors">Semua Produk</Link>
            <Link href="/marketplace/orders" className="hover:text-white transition-colors">Pesanan Saya</Link>
          </div>

          {/* Right: Info & Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[#EEF2E6] text-sm font-bold bg-white/10 px-4 py-2 rounded-full">
              <Zap size={16} className="text-[#F5990D] fill-[#F5990D]" />
              Belanja segar hari ini!
            </div>
            <button onClick={() => router.push("/marketplace/cart")} className="relative transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <ShoppingCart size={20} className="text-[#2B4C3B]" />
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C25939] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#2B4C3B]">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => router.push("/settings")} className="flex items-center gap-2 text-sm font-bold text-[#EEF2E6] transition-transform hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-[#E8E3D2] border-2 border-[#EEF2E6] overflow-hidden">
                <img src={profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Hi, {profile?.name?.split(" ")[0]} <span className="text-[#A4C4A8]">⌄</span></span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16">
        
        {/* Header */}
        <h1 className="text-4xl md:text-[3.5rem] font-black tracking-tight text-[#1C241E] mb-6">
          Keranjang
        </h1>

        {/* Stepper */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-[#1C241E] mb-12">
          <span className="text-[#1C241E]">1. Keranjang</span>
          <div className="w-8 sm:w-16 h-px bg-[#DDE2D6]"></div>
          <span className="text-[#A4B0A7] font-semibold">2. Checkout</span>
          <div className="w-8 sm:w-16 h-px bg-[#DDE2D6]"></div>
          <span className="text-[#A4B0A7] font-semibold">3. Pembayaran</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#DDE2D6] rounded-[2rem] bg-white max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-[#5A635B] mb-2">Keranjang Kosong</h3>
            <p className="text-[#A4B0A7] text-sm font-medium mb-6">Belum ada produk yang kamu tambahkan.</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="px-8 py-3.5 bg-[#2B4C3B] text-white font-black rounded-full hover:bg-[#1E362A] transition-colors shadow-lg"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (Cart Items) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-[#E8E3D2]">
                  <div className="w-32 h-32 rounded-[1.5rem] bg-[#F1EBE1] flex-shrink-0 overflow-hidden flex items-center justify-center text-5xl relative">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-[#C4BAA8] opacity-60" size={40} />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="text-[22px] font-bold text-[#1C241E] mb-1 leading-tight tracking-tight">{item.product?.title}</h3>
                        <p className="text-[13px] font-semibold text-[#5A635B] mb-3 line-clamp-1">{item.product?.description || "Produk Pilihan Pasar Tani"}</p>
                        <div className="flex items-center gap-2 text-[13px] font-bold text-[#A4B0A7]">
                          <span>Kategori <span className="text-[#1C241E]">{item.product?.category}</span></span>
                          <span className="text-[#DDE2D6]">/</span>
                          <span>Unit <span className="text-[#1C241E]">{item.product?.unit}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-[22px] font-bold text-[#1C241E]">Rp {item.product?.price?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity */}
                      <div className="flex items-center border border-[#DDE2D6] rounded-xl px-2 py-1 bg-white">
                        <button 
                          onClick={() => updateQty(item.id, -1)} 
                          className="w-8 h-8 flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95 rounded-lg transition-all font-bold"
                        >-</button>
                        
                        <div className="w-8 h-6 relative overflow-hidden flex items-center justify-center">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={item.quantity || item.orderQuantity || 1}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                              className="font-bold text-[#1C241E] text-sm absolute"
                            >
                              {item.quantity || item.orderQuantity || 1}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        
                        <button 
                          onClick={() => updateQty(item.id, 1)} 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all font-bold ${
                            (item.quantity || item.orderQuantity || 1) >= (item.product?.stock || 0) 
                              ? "text-[#DDE2D6] cursor-not-allowed" 
                              : "text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95"
                          }`}
                          disabled={(item.quantity || item.orderQuantity || 1) >= (item.product?.stock || 0)}
                        >+</button>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#A4B0A7]">Stok Tersedia: {item.product?.stock}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-[#A4B0A7] hover:text-[#C25939] hover:bg-red-50 border border-[#E8E3D2] bg-white rounded-xl active:scale-95 transition-all"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (Order Summary) */}
            <div className="bg-[#F1EBE1] rounded-[2rem] p-8 shadow-[0_8px_32px_-16px_rgba(43,76,59,0.15)] sticky top-28">
              <h2 className="text-xl font-bold text-[#1C241E] mb-8">Ringkasan Pesanan</h2>
              
              <div className="space-y-5 text-sm font-semibold mb-6">
                <div className="flex justify-between items-center text-[#5A635B]">
                  <span>Sub Total</span>
                  <span className="text-[#1C241E] font-bold text-[15px]">Rp {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[#5A635B]">
                    <span>Diskon</span>
                    <span className="text-[#1C241E] font-bold text-[15px]">Rp {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[#5A635B]">
                  <span>Pajak</span>
                  <span className="text-[#1C241E] font-bold text-[15px]">Rp 0</span>
                </div>
                <div className="flex justify-between items-center text-[#5A635B]">
                  <span>Ongkos Kirim</span>
                  <span className="text-[#C25939] font-bold text-[15px]">Gratis</span>
                </div>
              </div>
              
              <div className="h-px bg-[#DDE2D6] mb-6"></div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-[#1C241E] font-bold">Total Keseluruhan</span>
                <span className="text-[22px] font-bold text-[#2B4C3B]">Rp {total.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={() => router.push("/marketplace/checkout")}
                className="w-full bg-[#1C241E] hover:bg-[#2B4C3B] text-white py-4 rounded-full font-bold transition-all shadow-lg shadow-[#1C241E]/20 hover:shadow-[#2B4C3B]/30 hover:-translate-y-0.5"
              >
                Lanjut ke Pembayaran
              </button>
              
              <p className="text-center text-xs font-semibold text-[#5A635B] mt-6 flex justify-center items-center gap-1">
                Estimasi Pengiriman pada <span className="text-[#1C241E] font-bold">Esok Hari</span>
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
