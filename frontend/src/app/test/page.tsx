"use client";

import React, { useState } from "react";
import { Search, ShoppingCart, Menu, Zap, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MockupCartPage() {
  const [qty1, setQty1] = useState(1);
  const [qty2, setQty2] = useState(2);

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart size={16} className="text-[#EEF2E6]" />
              </div>
              <span className="font-black text-xl tracking-tight hidden sm:block">FarmPro</span>
            </div>
          </div>

          {/* Center: Links */}
          <div className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold text-[#A4C4A8]">
            <a href="#" className="text-white">Home</a>
            <a href="#" className="hover:text-white transition-colors">Best Seller</a>
            <a href="#" className="hover:text-white transition-colors">New Arrival</a>
            <a href="#" className="hover:text-white transition-colors">Collection</a>
          </div>

          {/* Right: Info & Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <ShoppingCart size={20} className="text-[#2B4C3B]" />
              </div>
              <span className="absolute -top-1 -right-1 bg-[#C25939] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#2B4C3B]">
                2
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#EEF2E6]">
                Hi, Aryo <span className="text-[#A4C4A8]">⌄</span>
            </div>
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

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Cart Items) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Item 1 */}
            <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-[#E8E3D2]">
              <div className="w-32 h-32 rounded-[1.5rem] bg-[#F1EBE1] flex-shrink-0 flex items-center justify-center text-5xl">
                🥩
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#1C241E] mb-1 leading-tight tracking-tight">Daging Sapi (Tulang)</h3>
                    <p className="text-[13px] font-semibold text-[#5A635B] mb-3">Rumah Potong Lokal dengan Kualitas Premium...</p>
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#A4B0A7]">
                      <span>Kategori <span className="text-[#1C241E]">Daging Segar</span></span>
                      <span className="text-[#DDE2D6]">/</span>
                      <span>Berat <span className="text-[#1C241E]">500 gr</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[22px] font-bold text-[#1C241E]">Rp 45.000</span>
                  <span className="text-sm font-bold text-[#A4B0A7] line-through">Rp 50.000</span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#DDE2D6] rounded-xl px-2 py-1 bg-white">
                    <button onClick={() => setQty1(Math.max(1, qty1 - 1))} className="w-8 h-8 flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95 rounded-lg transition-all font-bold">-</button>
                    <div className="w-8 h-6 relative overflow-hidden flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={qty1}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                          className="font-bold text-[#1C241E] text-sm absolute"
                        >
                          {qty1}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={() => setQty1(qty1 + 1)} className="w-8 h-8 flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95 rounded-lg transition-all font-bold">+</button>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="w-10 h-10 flex items-center justify-center text-[#A4B0A7] hover:text-[#C25939] hover:bg-red-50 border border-[#E8E3D2] bg-white rounded-xl active:scale-95 transition-all">
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-[#E8E3D2]">
              <div className="w-32 h-32 rounded-[1.5rem] bg-[#F1EBE1] flex-shrink-0 flex items-center justify-center text-5xl">
                🥛
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#1C241E] mb-1 leading-tight tracking-tight">Susu Segar Murni</h3>
                    <p className="text-[13px] font-semibold text-[#5A635B] mb-3">Diperah Pagi Hari Dari Koperasi Susu Lembang...</p>
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#A4B0A7]">
                      <span>Kategori <span className="text-[#1C241E]">Susu & Olahan</span></span>
                      <span className="text-[#DDE2D6]">/</span>
                      <span>Isi <span className="text-[#1C241E]">1 Liter</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[22px] font-bold text-[#1C241E]">Rp 24.000</span>
                  <span className="text-sm font-bold text-[#A4B0A7] line-through">Rp 26.500</span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#DDE2D6] rounded-xl px-2 py-1 bg-white">
                    <button onClick={() => setQty2(Math.max(1, qty2 - 1))} className="w-8 h-8 flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95 rounded-lg transition-all font-bold">-</button>
                    <div className="w-8 h-6 relative overflow-hidden flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={qty2}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                          className="font-bold text-[#1C241E] text-sm absolute"
                        >
                          {qty2}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={() => setQty2(qty2 + 1)} className="w-8 h-8 flex items-center justify-center text-[#5A635B] hover:text-[#2B4C3B] hover:bg-[#EEF2E6] active:scale-95 rounded-lg transition-all font-bold">+</button>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="w-10 h-10 flex items-center justify-center text-[#A4B0A7] hover:text-[#C25939] hover:bg-red-50 border border-[#E8E3D2] bg-white rounded-xl active:scale-95 transition-all">
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Order Summary) */}
          <div className="bg-[#F1EBE1] rounded-[2rem] p-8 shadow-[0_8px_32px_-16px_rgba(43,76,59,0.15)]">
            <h2 className="text-xl font-bold text-[#1C241E] mb-8">Ringkasan Pesanan</h2>
            
            <div className="space-y-5 text-sm font-semibold mb-6">
              <div className="flex justify-between items-center text-[#5A635B]">
                <span>Sub Total</span>
                <span className="text-[#1C241E] font-bold text-[15px]">Rp 69.000</span>
              </div>
              <div className="flex justify-between items-center text-[#5A635B]">
                <span>Diskon</span>
                <span className="text-[#1C241E] font-bold text-[15px]">Rp 7.500</span>
              </div>
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
              <span className="text-[22px] font-bold text-[#2B4C3B]">Rp 61.500</span>
            </div>
            
            <button className="w-full bg-[#1C241E] hover:bg-[#2B4C3B] text-white py-4 rounded-full font-bold transition-all shadow-lg shadow-[#1C241E]/20 hover:shadow-[#2B4C3B]/30 hover:-translate-y-0.5">
              Lanjut ke Pembayaran
            </button>
            
            <p className="text-center text-xs font-semibold text-[#5A635B] mt-6 flex justify-center items-center gap-1">
              Estimasi Pengiriman pada <span className="text-[#1C241E] font-bold">18 Juli 2026</span>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
