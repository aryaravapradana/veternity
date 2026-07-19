"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect } from "react";
import { CheckCircle, ShieldCheck, MapPin, Truck, Store, ChevronLeft, Building2, QrCode, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";
import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState(45000);
  const [shippingMethod, setShippingMethod] = useState("kargo");
  const [paymentMethod, setPaymentMethod] = useState("bca");
  const [session, setSession] = useState<any>(null);
  usePageLoading(loading);

  useEffect(() => {
    const fetchCart = async () => {
      const sessionStr = localStorage.getItem("farmpro_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setSession(session);
        try {
          const res = await fetchApi(`${API_BASE}/api/cart/${session.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.length === 0) {
              router.push("/marketplace/cart");
            } else {
              setCart(data);
            }
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        router.push("/marketplace/cart");
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) return;
    const session = JSON.parse(sessionStr);

    // Assuming all items belong to same seller for MVP
    const sellerId = cart[0].product?.sellerId || cart[0].sellerId;

    await fetchApi(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerId: session.id,
        sellerId: sellerId,
        shippingAddress: session.location || "Jl. Pertanian Raya No. 42, Sleman, DI Yogyakarta",
        shippingMethod,
        paymentMethod,
        shippingFee,
        platformFee: 2500,
        items: cart.map(item => ({ 
          productId: item.product?.id || item.productId, 
          quantity: item.quantity || item.orderQuantity || 1, 
          price: item.product?.price || item.price || 0
        })),
      }),
    });
    
    // Clear DB cart
    try {
      await fetchApi(`${API_BASE}/api/cart/${session.id}`, { method: 'DELETE' });
    } catch (e) {}

    router.push("/marketplace/checkout/success");
  };

  const subtotal = cart.reduce((s, i) => s + (i.product?.price || i.price || 0) * (i.quantity || i.orderQuantity || 1), 0);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]">
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-4xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] px-5 h-14 flex items-center justify-between">
          <div className="w-40 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
          <div className="w-32 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
          <div className="w-24" />
        </div>
      </div>
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map(i => (
            <section key={i} className="bg-white border border-[#E8E3D2] rounded-[1.5rem] p-6">
              <div className="w-48 h-5 rounded-md skeleton-shimmer bg-[#E8E3D2] mb-4" />
              <div className="w-full h-32 rounded-2xl skeleton-shimmer bg-[#E8E3D2]" />
            </section>
          ))}
        </div>
        <div className="md:w-80">
          <div className="bg-white border border-[#E8E3D2] rounded-2xl p-6">
            <div className="w-3/4 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2] mb-5" />
            <div className="space-y-4 mb-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl skeleton-shimmer shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 rounded-md skeleton-shimmer" />
                    <div className="w-2/3 h-3 rounded-md skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E3D2] pt-4 space-y-3">
              <div className="w-full h-4 rounded-md skeleton-shimmer" />
              <div className="w-full h-4 rounded-md skeleton-shimmer" />
              <div className="w-full h-4 rounded-md skeleton-shimmer" />
              <div className="w-full h-8 rounded-md skeleton-shimmer mt-4" />
              <div className="w-full h-14 rounded-2xl skeleton-shimmer mt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" >
      <MarketplaceNavbar 
        centerContent={
          <span className="font-black text-sm text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#A4C4A8]" /> Checkout Aman
          </span>
        }
      />
      {/* ── Breadcrumb ── */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24 flex flex-col md:flex-row gap-6">
        {/* Left: Forms */}
        <div className="flex-1 space-y-6">
          <div className="mb-2">
            <button onClick={() => router.push("/marketplace/cart")} className="inline-flex items-center gap-2 bg-white border border-[#E8E3D2] hover:bg-[#F8F6F0] text-[#1C241E] hover:text-[#2B4C3B] font-bold text-sm px-4 py-2 rounded-full transition-colors shadow-sm">
              <ChevronLeft size={18} /> Back
            </button>
          </div>

          {/* Address */}
          <section className="bg-white border border-[#E8E3D2] rounded-[1.5rem] p-6 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
            <h3 className="text-sm font-black text-[#5A635B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-[#C25939]" /> Alamat Pengiriman
            </h3>
            <div className="bg-[#F8F6F0] rounded-2xl p-4 border border-[#E8E3D2]">
              <p className="font-black text-[#1C241E] mb-1">{session?.fullName || "Nama Pembeli"}</p>
              <p className="text-sm text-[#7A8678] mb-3">{session?.location || "Jl. Pertanian Raya No. 42, Sleman, DI Yogyakarta"}</p>
              <div className="h-32 rounded-xl overflow-hidden border border-[#E8E3D2]">
                <iframe width="100%" height="100%" frameBorder="0" scrolling="no"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=110.36,-7.77,110.38,-7.75&layer=mapnik&marker=-7.76,110.37"
                  style={{ filter: "grayscale(20%) contrast(1.05)" }}
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white border border-[#E8E3D2] rounded-[1.5rem] p-6 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
            <h3 className="text-sm font-black text-[#5A635B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Truck size={16} className="text-[#767C15]" /> Metode Pengiriman
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kargo Express", sub: "2-3 Hari • Rp 45.000", id: "kargo", fee: 45000 },
                { label: "Lokal Kurir", sub: "Same Day • Rp 15.000", id: "lokal", fee: 15000 },
              ].map(s => (
                <label key={s.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="shipping" 
                    className="peer sr-only" 
                    checked={shippingFee === s.fee}
                    onChange={() => {
                      setShippingFee(s.fee);
                      setShippingMethod(s.id);
                    }}
                  />
                  <div className="rounded-2xl border-2 border-[#E8E3D2] p-4 peer-checked:border-[#2B4C3B] peer-checked:bg-[#EEF2E6] transition-all text-center">
                    <p className="font-black text-[#1C241E] text-sm">{s.label}</p>
                    <p className="text-[11px] text-[#7A8678] mt-1">{s.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white border border-[#E8E3D2] rounded-[1.5rem] p-6 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
            <h3 className="text-sm font-black text-[#5A635B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2B4C3B]" /> Metode Pembayaran
            </h3>
            <div className="space-y-3">
              {[
                { label: "Transfer Bank (Virtual Account)", tag: "BCA", tagColor: "bg-blue-100 text-blue-700", id: "bca", Icon: Building2 },
                { label: "Scan QR (GoPay, OVO, Dana)", tag: "QRIS", tagColor: "bg-emerald-100 text-emerald-700", id: "qris", Icon: QrCode },
                { label: "COD (Bayar di Tempat)", tag: "COD", tagColor: "bg-amber-100 text-amber-700", id: "cod", Icon: HandCoins },
              ].map(pm => (
                <label key={pm.id} className="flex items-center gap-3 p-4 border-2 border-[#E8E3D2] rounded-2xl cursor-pointer hover:border-[#2B4C3B]/40 has-[:checked]:border-[#2B4C3B] has-[:checked]:bg-[#EEF2E6] transition-colors">
                  <input 
                    type="radio" 
                    name="payment" 
                    className="w-4 h-4 accent-[#2B4C3B]" 
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)} 
                  />
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E8E3D2]">
                    <pm.Icon size={16} className="text-[#5A635B]" />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${pm.tagColor}`}>{pm.tag}</span>
                  <span className="font-bold text-[#1C241E] text-sm">{pm.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="md:w-80">
          <div className="bg-white border border-[#E8E3D2] rounded-2xl p-6 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)] sticky top-20">
            <h3 className="font-black text-lg text-[#1C241E] mb-5">Ringkasan Pesanan</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F1EBE1] overflow-hidden shrink-0">
                    {item.product?.imageUrls && item.product.imageUrls.length > 0
                      ? <img src={item.product.imageUrls[0]} className="w-full h-full object-cover" decoding="async" />
                      : <div className="w-full h-full flex items-center justify-center"><Store size={18} className="text-[#A4B0A7]" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-[#1C241E] truncate">{item.product?.title || item.title}</p>
                    <p className="text-xs text-[#7A8678] mt-0.5">{item.quantity || item.orderQuantity || 1}× Rp {(item.product?.price || item.price || 0)?.toLocaleString()}</p>
                  </div>
                  <p className="font-black text-sm text-[#C25939] shrink-0">Rp {((item.product?.price || item.price || 0) * (item.quantity || item.orderQuantity || 1))?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E3D2] pt-4 space-y-3">
              {[
                { label: "Subtotal", val: subtotal },
                { label: "Ongkir", val: shippingFee },
                { label: "Biaya Platform", val: 2500 },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-[#7A8678] font-bold">{row.label}</span>
                  <span className="font-black text-[#1C241E]">Rp {row.val.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-[#E8E3D2] mt-2">
                <span className="font-black text-[#1C241E]">Total Pembayaran</span>
                <span className="text-xl font-black text-[#F5990D]">
                  Rp {(subtotal + shippingFee + 2500).toLocaleString()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full mt-4 py-4 font-black text-white bg-pranata hover:bg-[#1E362A] rounded-2xl shadow-[0_8px_20px_-6px_rgba(43,76,59,0.5)] transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={19} /> Bayar Sekarang
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
