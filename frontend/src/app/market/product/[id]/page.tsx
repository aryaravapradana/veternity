"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect, use, useCallback } from "react";
import {
  Store, ShoppingCart, ArrowLeft, ShieldCheck, MapPin,
  Truck, CheckCircle, Package, Star, ChevronLeft, X,
  ChevronDown, ChevronUp, Heart, Crown, Info, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  usePageLoading(loading);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isDescOpen, setIsDescOpen] = useState(true);

  useEffect(() => { loadProduct(); }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const prodRes = await fetchApi(`${API_BASE}/api/products/${productId}`);
      if (prodRes.ok) {
        const found = await prodRes.json();
        setProduct(found);
        setQuantity(found.minOrder || 1);
        if (found.sellerId) {
          const sellerRes = await fetchApi(`${API_BASE}/api/profile/${found.sellerId}`);
          if (sellerRes.ok) setSeller(await sellerRes.json());
        }
      } else {
        setProduct(null);
      }
    } catch (e) {
      console.error(e);
      setProduct(null);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (isSubmitting) return;
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    const session = JSON.parse(sessionStr);
    
    setIsSubmitting(true);
    try {
      await fetchApi(`${API_BASE}/api/cart/${session.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity })
      });
      router.push("/market/cart");
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const maxQ = product?.stock || 0;
  // If out of stock, quantity should be 0. If minOrder is greater than stock, use stock.
  const minQ = maxQ === 0 ? 0 : Math.min(product?.minOrder || 1, maxQ);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-7xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] h-14 flex items-center justify-between px-4 md:px-8 lg:px-12">
          <div className="w-24 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
          <div className="w-48 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2] hidden sm:block" />
          <div className="w-20" />
        </div>
      </div>
      <main className="relative z-10 max-w-7xl mx-auto pt-6 pb-32 space-y-6 px-4 md:px-8 lg:px-12">
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-12px_rgba(43,76,59,0.12)]">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 lg:w-1/2 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] skeleton-shimmer" />
            <div className="w-full md:w-3/5 lg:w-1/2 p-7 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-3/4 h-10 rounded-xl skeleton-shimmer mb-4" />
                <div className="w-1/2 h-8 rounded-lg skeleton-shimmer mb-6" />
                <div className="w-full h-24 rounded-2xl skeleton-shimmer mb-6" />
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="h-24 rounded-2xl skeleton-shimmer" />
                  <div className="h-24 rounded-2xl skeleton-shimmer" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-32 h-14 rounded-2xl skeleton-shimmer" />
                <div className="flex-1 h-14 rounded-2xl skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl skeleton-shimmer shrink-0" />
          <div className="flex-1 w-full space-y-3">
            <div className="w-1/2 h-6 rounded-md skeleton-shimmer mx-auto sm:mx-0" />
            <div className="w-1/3 h-4 rounded-md skeleton-shimmer mx-auto sm:mx-0" />
          </div>
          <div className="w-full sm:w-32 h-12 rounded-2xl skeleton-shimmer shrink-0" />
        </div>
      </main>
    </div>
  );
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0]">
      <div className="text-center">
        <Package size={56} className="mx-auto text-[#C4BAA8] mb-4" />
        <p className="font-black text-xl text-[#5A635B]">Produk tidak ditemukan.</p>
        <button onClick={() => router.push("/market")} className="mt-4 text-[#2B4C3B] font-bold underline">
          Kembali ke Marketplace
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E] font-sans pb-24 lg:pb-12" >
      <MarketplaceNavbar />

      <div className="max-w-7xl mx-auto pt-4 lg:pt-8 relative z-10 px-4 md:px-8 lg:px-12">
        
        <div className="mb-6">
          <button onClick={() => router.push("/market")} className="inline-flex items-center gap-2 bg-white border border-[#E8E3D2] hover:bg-[#F8F6F0] text-[#1C241E] hover:text-[#2B4C3B] font-bold text-sm px-4 py-2 rounded-full transition-colors shadow-sm">
            <ChevronLeft size={18} /> Back
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Images */}
          <div className="w-full md:w-2/5 lg:w-1/2 flex flex-col">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-sm">
              
              {/* Main Image */}
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <motion.img 
                  key={currentImageIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.imageUrls[currentImageIdx]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F1EBE1]">
                  <Package size={80} className="text-[#C4BAA8] opacity-50" />
                </div>
              )}

              {/* Progress Bars Overlay */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
                  {product.imageUrls.map((_: any, idx: number) => (
                    <div key={idx} className="h-1.5 flex-1 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className={`h-full ${idx === currentImageIdx ? 'bg-white' : 'bg-transparent'}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Thumbnails Overlay */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-4">
                  <div className="flex sm:justify-center gap-3 sm:gap-4 overflow-x-auto hide-scrollbar snap-x pb-2 -mb-2">
                    {product.imageUrls.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIdx(idx)}
                        className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-[3px] transition-all shadow-lg bg-white snap-center ${currentImageIdx === idx ? 'border-white scale-105 z-10' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-100'}`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Grading Moved to Left Column under Image */}
            {product.aiAnalysis && (
              <div className={`mt-8 rounded-3xl overflow-hidden shadow-sm border-2 ${
                product.grade === "Premium" ? "bg-[#FFF9E6] border-[#F5990D]" :
                product.grade?.includes("A") ? "bg-emerald-50 border-emerald-400" :
                product.grade?.includes("B") ? "bg-cyan-50 border-cyan-400" :
                "bg-amber-50 border-amber-400"
              }`}>
                <div className="p-6">
                  <h3 className={`font-black text-lg mb-3 ${
                    product.grade === "Premium" ? "text-[#F5990D]" :
                    product.grade?.includes("A") ? "text-emerald-900" :
                    product.grade?.includes("B") ? "text-cyan-900" :
                    "text-amber-900"
                  }`}>
                    Grading Result
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-black/5">
                    <div className={`p-1.5 rounded-full ${
                      product.grade === "Premium" ? "bg-[#F5990D]/20 text-[#F5990D]" :
                      product.grade?.includes("A") ? "bg-emerald-100 text-emerald-600" :
                      product.grade?.includes("B") ? "bg-cyan-100 text-cyan-600" :
                      "bg-amber-100 text-amber-600"
                    }`}>
                      {product.grade === "Premium" && <Crown size={18} />}
                      {product.grade?.includes("A") && <Star size={18} />}
                      {product.grade?.includes("B") && <CheckCircle size={18} />}
                      {product.grade?.includes("C") && <Info size={18} />}
                    </div>
                    <h4 className={`text-base font-black ${
                      product.grade === "Premium" ? "text-[#F5990D]" :
                      product.grade?.includes("A") ? "text-emerald-700" :
                      product.grade?.includes("B") ? "text-cyan-700" :
                      "text-amber-700"
                    }`}>{product.grade}</h4>
                  </div>

                  <p className="text-sm font-semibold text-[#5A635B] leading-relaxed mb-1">
                    {product.aiAnalysis}
                  </p>

                  <div className="flex items-center gap-1.5 mt-5 justify-start">
                    <span className="text-[10px] font-light tracking-tight text-[#2B4C3B] uppercase">Powered By</span>
                    <img src="/logos/intelligence/intelligence-black.png" alt="Pranata Intelligence" className="h-6 drop-shadow-sm"  loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col pt-2 lg:pt-0">
            
            <div className="mb-6">
              {product.category && (
                <span className="inline-block px-4 py-1.5 rounded-full border border-[#DDE2D6] text-xs font-black text-[#2B4C3B] uppercase tracking-wider mb-4 bg-white shadow-sm">
                  {product.category}
                </span>
              )}
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C241E] leading-tight mb-4">
                {product.title}
              </h1>
              
              <p className="text-2xl sm:text-3xl font-black text-[#1C241E]">
                Rp {product.price?.toLocaleString()} <span className="text-lg text-[#5A635B] font-bold">/ {product.unit}</span>
              </p>
            </div>

            {/* Seller Info Box */}
            {seller && (
              <Link href={`/market/seller/${seller.id}`} className="flex items-center gap-4 bg-white hover:bg-[#F8F6F0] border border-[#E8E3D2] p-4 rounded-2xl mb-8 shadow-sm transition-colors group">
                {seller.avatarUrl ? (
                  <img src={seller.avatarUrl} alt="Seller Avatar" className="w-12 h-12 rounded-full object-cover shrink-0 shadow-inner group-hover:scale-105 transition-transform"  loading="lazy" decoding="async" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-pranata text-white flex items-center justify-center font-black text-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {(seller.farmName || seller.fullName || seller.username || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-black text-[#1C241E] flex items-center gap-1.5 mb-0.5">
                    {seller.farmName || seller.fullName}
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                  </h3>
                  {seller.location && (
                    <p className="text-xs font-bold text-[#7A8678] flex items-center gap-1">
                      <MapPin size={12} className="text-[#C25939]" />
                      {seller.location}
                    </p>
                  )}
                </div>
              </Link>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-[#5A635B] uppercase text-xs tracking-wider">Kuantitas Pembelian</h3>
                <span className="text-xs font-bold text-[#C25939]">Sisa Stok: {product.stock} {product.unit}</span>
              </div>
              
              <div className="flex gap-4">
                <div className={`flex items-center bg-white border border-[#E8E3D2] rounded-2xl overflow-hidden shadow-sm h-14 ${maxQ === 0 ? 'opacity-50' : ''}`}>
                  <button 
                    onClick={() => setQuantity(Math.max(minQ, quantity - 1))}
                    disabled={maxQ === 0}
                    className="w-14 h-full flex items-center justify-center text-2xl font-black text-[#2B4C3B] hover:bg-[#F8F6F0] transition-colors z-10 bg-white disabled:hover:bg-white"
                  >-</button>
                  <div className="w-16 h-full flex items-center justify-center font-black text-lg border-x border-[#E8E3D2] relative overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={quantity}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute"
                      >
                        {maxQ === 0 ? 0 : quantity}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(maxQ, quantity + 1))}
                    disabled={maxQ === 0}
                    className="w-14 h-full flex items-center justify-center text-2xl font-black text-[#2B4C3B] hover:bg-[#F8F6F0] transition-colors z-10 bg-white disabled:hover:bg-white"
                  >+</button>
                </div>
                <div className="flex flex-col justify-center text-xs text-[#5A635B] font-medium">
                  <p>Min. Order: <span className="font-bold text-[#1C241E]">{product.minOrder || 1} {product.unit}</span></p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-10">
              <motion.button 
                whileHover={maxQ > 0 && !isSubmitting ? { scale: 1.01 } : {}} 
                whileTap={maxQ > 0 && !isSubmitting ? { scale: 0.97 } : {}}
                onClick={handleAddToCart}
                disabled={maxQ === 0 || isSubmitting}
                className={`flex-1 h-14 rounded-2xl font-black text-lg shadow-[0_8px_20px_-6px_rgba(43,76,59,0.4)] flex items-center justify-center gap-2 transition-all text-white ${
                  maxQ === 0 || isSubmitting 
                    ? 'bg-gray-400 opacity-60 cursor-not-allowed shadow-none' 
                    : 'bg-pranata hover:bg-[#1E362A]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-white" />
                    <span>Menambahkan...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>{maxQ === 0 ? 'Stok Habis' : 'Add to Cart'}</span>
                  </>
                )}
              </motion.button>
              <button className="w-14 h-14 flex items-center justify-center border-2 border-[#DDE2D6] rounded-2xl text-[#1C241E] hover:bg-white hover:border-[#1C241E] transition-all bg-transparent shrink-0">
                <Heart size={24} />
              </button>
            </div>

            {/* Accordions */}
            <div className="space-y-4">

              {product.description && (
                <div className="bg-white border border-[#E8E3D2] rounded-3xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setIsDescOpen(!isDescOpen)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-[#F8F6F0]/50 transition-colors"
                  >
                    <h3 className="font-black text-lg text-[#1C241E]">Description & Details</h3>
                    {isDescOpen ? <ChevronUp className="text-[#5A635B]" /> : <ChevronDown className="text-[#5A635B]" />}
                  </button>
                  <AnimatePresence>
                    {isDescOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-sm text-[#5A635B] leading-relaxed pt-2 border-t border-[#F8F6F0]">
                          {product.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
