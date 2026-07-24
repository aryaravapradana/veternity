"use client";
import { fetchApi, getApiBaseUrl } from "@/lib/apiClient";

import { useState, useEffect, use } from "react";
import { Store, ArrowLeft, ShieldCheck, MapPin, Phone, Package, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

const API_BASE = getApiBaseUrl();

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sellerId = resolvedParams.id;

  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);
  const router = useRouter();

  useEffect(() => { loadData(); }, [sellerId]);

  const loadData = async () => {
    setLoading(true);
    const [sellerRes, prodRes] = await Promise.all([
      fetchApi(`${API_BASE}/api/profile/${sellerId}`),
      fetchApi(`${API_BASE}/api/products`),
    ]);
    if (sellerRes.ok) setSeller(await sellerRes.json());
    const raw = await prodRes.json();
    const all = Array.isArray(raw) ? raw : (raw.data ?? []);
    setProducts(all.filter((p: any) => p.sellerId === sellerId));
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-7xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] h-14 flex items-center px-4 md:px-8 lg:px-12">
          <div className="w-24 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto pt-6 pb-24 space-y-8 px-4 md:px-8 lg:px-12">
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-12px_rgba(43,76,59,0.14)]">
          <div className="relative h-40 sm:h-52 skeleton-shimmer bg-[#E8E3D2]" />
          <div className="px-6 sm:px-8 pb-7">
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white skeleton-shimmer bg-[#E8E3D2] shrink-0" />
              <div className="w-24 h-14 rounded-2xl skeleton-shimmer bg-[#E8E3D2] shrink-0" />
            </div>
            <div className="w-64 h-8 rounded-xl skeleton-shimmer bg-[#E8E3D2] mb-3" />
            <div className="w-40 h-4 rounded-md skeleton-shimmer bg-[#E8E3D2] mb-5" />
            <div className="flex gap-2">
              <div className="w-32 h-8 rounded-full skeleton-shimmer bg-[#E8E3D2]" />
              <div className="w-40 h-8 rounded-full skeleton-shimmer bg-[#E8E3D2]" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="w-40 h-8 rounded-xl skeleton-shimmer bg-[#E8E3D2]" />
            <div className="w-20 h-4 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white border border-[#E8E3D2] rounded-[1.75rem] overflow-hidden h-[340px] skeleton-shimmer bg-[#E8E3D2]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (!seller) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0]">
      <div className="text-center">
        <Store size={56} className="mx-auto text-[#C4BAA8] mb-4" />
        <p className="font-black text-xl text-[#5A635B]">Toko tidak ditemukan.</p>
        <button onClick={() => router.push("/market")} className="mt-4 text-[#2B4C3B] font-bold underline">Kembali</button>
      </div>
    </div>
  );

  const initials = (seller.farmName || seller.fullName || seller.username || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" >
      <MarketplaceNavbar />
      {/* Ambient blobs */}

      <div className="relative z-10 max-w-7xl mx-auto pt-6 pb-24 space-y-8 px-4 md:px-8 lg:px-12">
        <div>
          <button onClick={() => router.push("/market")} className="inline-flex items-center gap-2 bg-white border border-[#E8E3D2] hover:bg-[#F8F6F0] text-[#1C241E] hover:text-[#2B4C3B] font-bold text-sm px-4 py-2 rounded-full transition-colors shadow-sm">
            <ChevronLeft size={18} /> Back
          </button>
        </div>

        {/* ── Store Hero (Twitter / FB style) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white border border-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-12px_rgba(43,76,59,0.14)]"
        >
          {/* Banner */}
          <div className="relative h-40 sm:h-52 bg-pranata overflow-hidden">
            {seller.bannerUrl ? (
              <img src={seller.bannerUrl} alt="Banner" decoding="async" className="w-full h-full object-cover"  loading="lazy" />
            ) : (
              /* Fallback earthy SVG pattern */
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="200" fill="#2B4C3B"/>
                <circle cx="100" cy="-20" r="150" fill="#3A6B49" opacity="0.5"/>
                <circle cx="700" cy="220" r="180" fill="#1E362A" opacity="0.6"/>
                <circle cx="400" cy="100" r="120" fill="#4A7C59" opacity="0.25"/>
                <circle cx="650" cy="20" r="90" fill="#F5990D" opacity="0.08"/>
              </svg>
            )}
          </div>

          {/* Avatar + info row */}
          <div className="px-6 sm:px-8 pb-7">
            <div className="flex items-end justify-between -mt-12 mb-5">
              {/* Circular avatar overlapping banner */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-pranata shadow-xl shrink-0">
                {seller.avatarUrl ? (
                  <img src={seller.avatarUrl} alt={seller.farmName || seller.fullName} decoding="async" className="w-full h-full object-cover"  loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                    {initials}
                  </div>
                )}
              </div>

              {/* Stats card */}
              <div className="bg-[#EEF2E6] rounded-2xl px-5 py-3 text-center shrink-0">
                <p className="text-2xl font-black text-[#2B4C3B]">{products.length}</p>
                <p className="text-[#5A635B] text-xs font-semibold mt-0.5">Produk Aktif</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C241E] leading-tight">
                {seller.farmName || seller.fullName}
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-[#EEF2E6] text-[#2B4C3B] text-xs font-black px-3 py-1.5 rounded-full">
                <ShieldCheck size={12} /> Verified
              </span>
            </div>

            {seller.fullName && seller.farmName && (
              <p className="text-sm font-bold text-[#7A8678] mb-3">@{seller.username || seller.fullName}</p>
            )}

            {/* Location + contact pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#F8F6F0] border border-[#E8E3D2] text-[#5A635B] text-sm font-semibold px-4 py-2 rounded-full">
                <MapPin size={13} className="text-[#C25939]" />
                {seller.location || "Lokasi tidak ditentukan"}
              </span>
              {seller.contact && (
                <span className="inline-flex items-center gap-1.5 bg-[#F8F6F0] border border-[#E8E3D2] text-[#5A635B] text-sm font-semibold px-4 py-2 rounded-full">
                  <Phone size={13} className="text-[#2B4C3B]" />
                  {seller.contact}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Products Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#1C241E]">Etalase Produk</h2>
            <p className="text-sm text-[#7A8678] font-semibold">{products.length} produk</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[#DDE2D6] rounded-[2rem]">
              <Package size={48} className="mx-auto text-[#C4BAA8] mb-4" />
              <p className="font-black text-xl text-[#5A635B] mb-1">Belum ada produk</p>
              <p className="text-sm text-[#A4B0A7] font-medium">Penjual ini belum menambahkan produk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3), ease: "easeOut" }}
                  onClick={p.stock > 0 ? () => router.push(`/market/product/${p.id}`) : undefined}
                  className={`bg-white border border-[#E8E3D2] rounded-[1.75rem] overflow-hidden group will-change-transform transition-all duration-200 ${
                    p.stock > 0 ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(43,76,59,0.18)]" : "cursor-not-allowed opacity-60 grayscale-[0.8]"
                  }`}
                  style={{ contain: "layout style" }}
                >
                  {/* Image */}
                  <div className="h-52 w-full bg-[#F1EBE1] overflow-hidden relative">
                    {p.imageUrls && p.imageUrls.length > 0 ? (
                      <img
                        src={p.imageUrls[0]}
                        alt={p.title}
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                       loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-[#C4BAA8] opacity-60" />
                      </div>
                    )}
                    {p.category && (
                      <div className="absolute top-3 left-3 bg-white text-[#2B4C3B] text-[11px] font-black px-3 py-1.5 rounded-full border border-[#E8E3D2] shadow-sm">
                        {p.category}
                      </div>
                    )}
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <span className="bg-[#C25939] text-white font-black px-4 py-2 rounded-xl text-sm shadow-lg rotate-[-10deg]">
                          HABIS
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-base font-black text-[#1C241E] truncate group-hover:text-[#2B4C3B] transition-colors mb-1">{p.title}</h3>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <p className="text-xl font-black text-[#C25939] leading-none">Rp {p.price?.toLocaleString()}</p>
                        <p className="text-[11px] text-[#7A8678] font-semibold mt-0.5">/{p.unit}</p>
                      </div>
                      <span className={`text-[11px] font-black px-2.5 py-1.5 rounded-xl ${
                        p.stock > 0 ? "bg-[#EEF2E6] text-[#2B4C3B]" : "bg-gray-200 text-gray-500"
                      }`}>
                        Stok {p.stock} {p.unit}
                      </span>
                    </div>
                    {p.minOrder && p.minOrder > 1 && (
                      <p className="text-[10px] text-[#7A8678] font-semibold mt-2">Min. order {p.minOrder} {p.unit}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
