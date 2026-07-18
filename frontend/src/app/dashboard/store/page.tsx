"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect } from "react";
import { Store, Package, Plus, CheckCircle, Image as ImageIcon, Info, X, Edit2, Trash2, Sparkles, ChevronRight, Crown, Star, Medal, ArrowLeft } from "lucide-react";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";

export default function StoreDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) {
      router.push("/login");
      return;
    }
    const session = JSON.parse(sessionStr);
    
    if (session.role === 'BUYER') {
      router.push("/marketplace");
      return;
    }
    
    setProfile(session);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const prodRes = await fetchApi(`${API_BASE}/api/products/seller/${session.id}`);
    const pData = await prodRes.json();
    setProducts(Array.isArray(pData) ? pData : []);
    
    const ordRes = await fetchApi(`${API_BASE}/api/orders/PRODUCER/${session.id}`);
    const oData = await ordRes.json();
    setOrders(Array.isArray(oData) ? oData : []);
    
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await fetchApi(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
    loadData();
  };


  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] p-6 sm:p-10 text-[#1C241E]">
      <div className="max-w-6xl mx-auto space-y-8 pb-32">
        <div className="bg-pranata rounded-3xl p-8 shadow-xl flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-64 h-10 rounded-xl skeleton-shimmer bg-[#3A6B49]" />
            <div className="w-96 h-5 rounded-md skeleton-shimmer bg-[#3A6B49] hidden md:block" />
          </div>
          <div className="w-40 h-12 rounded-xl skeleton-shimmer bg-[#3A6B49]" />
        </div>
        <div className="space-y-6">
          <div className="w-48 h-8 rounded-xl skeleton-shimmer bg-[#E8E3D2]" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-[#DDE2D6] rounded-3xl p-5">
                <div className="h-40 w-full rounded-2xl skeleton-shimmer bg-[#E8E3D2] mb-4" />
                <div className="flex justify-between items-start mb-2">
                  <div className="w-1/2 h-6 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
                  <div className="w-16 h-6 rounded-full skeleton-shimmer bg-[#E8E3D2]" />
                </div>
                <div className="w-full h-3 rounded-md skeleton-shimmer bg-[#E8E3D2] mb-3" />
                <div className="w-1/3 h-8 rounded-md skeleton-shimmer bg-[#E8E3D2]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F0] p-6 sm:p-10 text-[#1C241E]" >
      <div className="max-w-6xl mx-auto space-y-8 pb-32">
        
        {/* Header */}
        <div className="bg-pranata rounded-3xl p-8 text-[#F8F6F0] shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Store className="text-[#F5990D]" size={32} />
              My Farm Store
            </h1>
            <p className="text-[#DDE2D6] font-medium">
              Manage your listings and incoming orders without middlemen.
            </p>
          </div>
          
          <button 
            onClick={() => { router.push("/dashboard/store/new") }}
            className="bg-[#F5990D] hover:bg-[#C25939] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Content Tabs */}
        <div className="space-y-6">
          
          {/* Main List */}
          <h2 className="text-2xl font-black text-[#2B4C3B]">
            My Active Listings
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length === 0 && <p className="text-[#5A635B]">No active products.</p>}
              {products.map((p) => (
                <div key={p.id} className="bg-white border border-[#DDE2D6] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <div className="h-40 w-full rounded-2xl bg-gray-100 mb-4 overflow-hidden">
                    {p.imageUrls && p.imageUrls.length > 0 ? (
                      <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={40} /></div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#1C241E] truncate pr-2">{p.title}</h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-[#E8E3D2] text-[#2B4C3B] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {p.stock} {p.unit}
                      </span>
                      {p.grade && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                          {p.grade}
                        </span>
                      )}
                    </div>
                  </div>
                  {p.description && <p className="text-xs text-[#5A635B] line-clamp-2 mb-3">{p.description}</p>}
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-2xl font-black text-[#C25939]">Rp {p.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/dashboard/store/edit/${p.id}`)} className="p-2 bg-[#F8F6F0] text-[#5A635B] rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-[#F8F6F0] text-[#5A635B] rounded-full hover:bg-red-100 hover:text-red-700 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
