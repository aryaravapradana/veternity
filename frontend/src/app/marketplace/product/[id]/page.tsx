"use client";

import { useState, useEffect, use, useCallback } from "react";
import {
  Store, ShoppingCart, ArrowLeft, ShieldCheck, MapPin,
  Truck, CheckCircle, Package, Star, ChevronLeft, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/loading-context";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { loadProduct(); }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    const prodRes = await fetch(`${API_BASE}/api/products`);
    const products = await prodRes.json();
    const found = products.find((p: any) => p.id === productId);
    if (found) {
      setProduct(found);
      setQuantity(found.minOrder || 1);
      const sellerRes = await fetch(`${API_BASE}/api/profile/${found.sellerId}`);
      if (sellerRes.ok) setSeller(await sellerRes.json());
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    const item = { ...product, orderQuantity: quantity };
    const savedCart = localStorage.getItem("farmpro_cart");
    let cartArr = savedCart ? JSON.parse(savedCart) : [];
    
    // Always clear the cart first if we assume only buying from 1 seller for now, or just append it.
    // For now, let's append. If they already have this item, update qty.
    const existingIdx = cartArr.findIndex((i: any) => i.id === item.id);
    if (existingIdx >= 0) {
      cartArr[existingIdx].orderQuantity += quantity;
    } else {
      cartArr.push(item);
    }
    localStorage.setItem("farmpro_cart", JSON.stringify(cartArr));
    router.push("/marketplace/cart");
  };

  const maxQ = product?.stock || 0;
  // If out of stock, quantity should be 0. If minOrder is greater than stock, use stock.
  const minQ = maxQ === 0 ? 0 : Math.min(product?.minOrder || 1, maxQ);

  if (loading) return null;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0]">
      <div className="text-center">
        <Package size={56} className="mx-auto text-[#C4BAA8] mb-4" />
        <p className="font-black text-xl text-[#5A635B]">Produk tidak ditemukan.</p>
        <button onClick={() => router.push("/marketplace")} className="mt-4 text-[#2B4C3B] font-bold underline">
          Kembali ke Marketplace
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>

      {/* Ambient blobs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8E3D2]/40 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
      </div>

      {/* ── Back Bar ── */}
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-5xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex items-center gap-2 text-[#5A635B] hover:text-[#2B4C3B] font-bold text-sm transition-colors"
          >
            <ChevronLeft size={20} /> Pasar Tani
          </button>
          <span className="font-black text-sm text-[#1C241E] truncate max-w-[60%] text-center hidden sm:block">
            {product.title}
          </span>
          <div className="w-20" />
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-32 space-y-6">

        {/* ── Product Card ── */}
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-12px_rgba(43,76,59,0.12)]">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/2 aspect-square bg-[#F1EBE1] relative overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={80} className="text-[#C4BAA8] opacity-50" />
                </div>
              )}
              {product.category && (
                <div className="absolute top-4 left-4 bg-white text-[#2B4C3B] text-xs font-black px-4 py-1.5 rounded-full border border-[#E8E3D2] shadow-sm">
                  {product.category}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#1C241E] leading-tight mb-3">{product.title}</h1>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-[#C25939]">Rp {product.price?.toLocaleString()}</span>
                  <span className="text-lg font-bold text-[#7A8678]">/{product.unit}</span>
                </div>

                {product.description && (
                  <div className="bg-[#F8F6F0] rounded-2xl p-4 border border-[#E8E3D2] mb-6">
                    <p className="text-sm text-[#5A635B] leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-[#EEF2E6] rounded-2xl p-4 text-center">
                    <p className="text-xs text-[#5A635B] font-bold uppercase tracking-wide mb-1">Stok Tersedia</p>
                    <p className="text-2xl font-black text-[#2B4C3B]">{product.stock}</p>
                    <p className="text-xs text-[#7A8678] font-semibold">{product.unit}</p>
                  </div>
                  <div className="bg-[#FFF3E0] rounded-2xl p-4 text-center">
                    <p className="text-xs text-[#5A635B] font-bold uppercase tracking-wide mb-1">Min. Order</p>
                    <p className="text-2xl font-black text-[#C25939]">{product.minOrder || 1}</p>
                    <p className="text-xs text-[#7A8678] font-semibold">{product.unit}</p>
                  </div>
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className={`flex items-center rounded-2xl border overflow-hidden shrink-0 ${maxQ === 0 ? 'bg-gray-100 border-gray-200' : 'bg-[#F1EBE1] border-[#E8E3D2]'}`}>
                  <button
                    onClick={() => setQuantity(q => Math.max(minQ, q - 1))}
                    disabled={maxQ === 0}
                    className="w-12 h-12 text-2xl font-black text-[#5A635B] hover:bg-[#E8E3D2] disabled:hover:bg-transparent disabled:opacity-50 transition-colors flex items-center justify-center"
                  >-</button>
                  <span className={`w-14 text-center font-black text-lg ${maxQ === 0 ? 'text-gray-400' : 'text-[#1C241E]'}`}>{maxQ === 0 ? 0 : quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(maxQ, q + 1))}
                    disabled={maxQ === 0}
                    className="w-12 h-12 text-2xl font-black text-[#5A635B] hover:bg-[#E8E3D2] disabled:hover:bg-transparent disabled:opacity-50 transition-colors flex items-center justify-center"
                  >+</button>
                </div>
                <motion.button
                  whileHover={maxQ > 0 ? { scale: 1.01 } : {}} 
                  whileTap={maxQ > 0 ? { scale: 0.97 } : {}}
                  onClick={handleAddToCart}
                  disabled={maxQ === 0}
                  className={`flex-1 py-3.5 font-black text-white rounded-2xl transition-colors flex items-center justify-center gap-2 ${
                    maxQ === 0 
                      ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                      : 'bg-[#2B4C3B] hover:bg-[#1E362A] shadow-[0_8px_20px_-6px_rgba(43,76,59,0.4)]'
                  }`}
                >
                  <ShoppingCart size={20} /> {maxQ === 0 ? 'Stok Habis' : 'Beli Sekarang'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Seller Card ── */}
        {seller && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white border border-[#E8E3D2] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)] flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#2B4C3B] text-white flex items-center justify-center font-black text-3xl shrink-0 shadow-inner">
              {(seller.farmName || seller.fullName || seller.username || "?").charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-black text-[#1C241E] flex items-center justify-center sm:justify-start gap-2 mb-1">
                {seller.farmName || seller.fullName}
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              </h3>
              <p className="text-sm text-[#7A8678] font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin size={13} className="text-[#C25939]" />
                {seller.location || "Lokasi tidak ditentukan"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/marketplace/seller/${seller.id}`)}
              className="px-6 py-3 border-2 border-[#2B4C3B] text-[#2B4C3B] font-black rounded-2xl hover:bg-[#2B4C3B] hover:text-white transition-all text-sm flex items-center gap-2 shrink-0"
            >
              <Store size={16} /> Lihat Toko
            </motion.button>
          </motion.div>
        )}
      </main>


    </div>
  );
}
