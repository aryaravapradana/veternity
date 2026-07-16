"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Package, Clock, CheckCircle, Truck, Store, User, MapPin } from "lucide-react";
import { usePageLoading } from "@/components/loading-context";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-[#FFF3E0] text-[#C25939]",
  PAID: "bg-[#EEF2E6] text-[#2B4C3B]",
  SHIPPED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-[#EEF2E6] text-[#2B4C3B]",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Dibayar - Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  usePageLoading(loading);

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    
    const fetchOrders = async () => {
      try {
        const parsedSession = JSON.parse(sessionStr);
        setSession(parsedSession);
        
        // If not a BUYER, redirect them to the seller's order dashboard instead
        if (parsedSession.role !== "BUYER") {
          router.push("/dashboard/store/orders");
          return;
        }

        const res = await fetch(`${API_BASE}/api/orders/BUYER/${parsedSession.id}`);
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      {/* ── Navbar ── */}
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-4xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex items-center gap-2 text-[#5A635B] hover:text-[#2B4C3B] font-bold text-sm transition-colors"
          >
            <ChevronLeft size={20} /> Belanja Lagi
          </button>
          <span className="font-black text-sm text-[#1C241E] flex items-center gap-2">
            <Package size={16} /> Pesanan Saya
          </span>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24">
        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8E3D2] rounded-[2rem] p-12 text-center shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)] mt-10">
            <div className="w-20 h-20 bg-[#F1EBE1] rounded-full flex items-center justify-center mx-auto mb-5">
              <Package size={32} className="text-[#A4B0A7]" />
            </div>
            <h2 className="text-2xl font-black text-[#1C241E] mb-2">Belum ada pesanan</h2>
            <p className="text-[#5A635B] mb-6 font-medium">Kamu belum memiliki riwayat pesanan.</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="px-6 py-3 bg-[#2B4C3B] text-white font-black rounded-2xl hover:bg-[#1E362A] transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white border border-[#E8E3D2] rounded-[1.5rem] p-5 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 border-b border-[#E8E3D2] pb-4">
                  <div>
                    <p className="text-xs font-bold text-[#7A8678] mb-1 flex items-center gap-1.5">
                      <Store size={14} className="text-[#A4B0A7]" />
                      Toko: {o.seller?.farmName || o.seller?.fullName}
                    </p>
                    <p className="text-[10px] text-[#A4B0A7] flex items-center gap-2">
                      <span className="font-bold text-[#1C241E]">Order #{o.id.substring(o.id.length - 8).toUpperCase()}</span>
                      <span>•</span>
                      <span>{new Date(o.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1.5 ${STATUS_COLORS[o.status]}`}>
                    {o.status === "PENDING" && <Clock size={12} />}
                    {o.status === "PAID" && <CheckCircle size={12} />}
                    {o.status === "SHIPPED" && <Truck size={12} />}
                    {o.status === "COMPLETED" && <CheckCircle size={12} />}
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {o.items.map((i: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#F1EBE1] overflow-hidden shrink-0">
                        {i.product?.imageUrl ? (
                          <img src={i.product.imageUrl} alt={i.product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-[#C4BAA8]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-sm text-[#1C241E]">{i.product?.title || "Produk dihapus"}</h4>
                        <p className="text-xs font-semibold text-[#7A8678] mt-0.5">
                          {i.quantity} × Rp {i.priceAtTime?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer & Address */}
                <div className="mt-4 pt-4 border-t border-[#E8E3D2] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-start gap-2 text-xs text-[#5A635B] bg-[#F8F6F0] p-3 rounded-xl border border-[#DDE2D6]">
                    <MapPin size={16} className="text-[#C25939] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#1C241E] mb-0.5">Alamat Pengiriman:</p>
                      <p>{o.buyer?.location || "Jl. Pertanian Raya No. 42, Sleman, DI Yogyakarta"}</p>
                    </div>
                  </div>
                  <div className="sm:text-right flex justify-between sm:block items-center">
                    <span className="text-xs font-bold text-[#5A635B] block mb-1">Total Belanja</span>
                    <span className="font-black text-xl text-[#C25939]">Rp {o.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
