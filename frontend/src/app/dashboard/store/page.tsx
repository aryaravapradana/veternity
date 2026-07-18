"use client";

import { useState, useEffect } from "react";
import { Store, Package, Plus, CheckCircle, Image as ImageIcon, Info, X, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/shared/loading-context";
import { useRouter } from "next/navigation";

export default function StoreDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);
  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", category: "Sayuran", price: 0, stock: 0, minOrder: 1, unit: "kg", imageUrls: [] as string[] });
  const [benchmarkPrice, setBenchmarkPrice] = useState<number | null>(null);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showAddModal]);

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

    const prodRes = await fetch(`${API_BASE}/api/products/seller/${session.id}`);
    setProducts(await prodRes.json());
    
    const ordRes = await fetch(`${API_BASE}/api/orders/PRODUCER/${session.id}`);
    setOrders(await ordRes.json());
    
    setLoading(false);
  };

  const checkBenchmark = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_BASE}/api/prices`);
    const data = await res.json();
    if (data.length > 0) {
      setBenchmarkPrice(data[0].pricePerKg);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    if (editingProductId) {
      await fetch(`${API_BASE}/api/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProduct.title,
          description: newProduct.description,
          category: newProduct.category,
          price: newProduct.price,
          stock: newProduct.stock,
          minOrder: newProduct.minOrder,
          unit: newProduct.unit,
          imageUrls: newProduct.imageUrls.length > 0 ? newProduct.imageUrls : ["https://images.unsplash.com/photo-1595856728084-2b63897d2644?q=80&w=600&auto=format&fit=crop"]
        })
      });
    } else {
      await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: profile.id,
          title: newProduct.title,
          description: newProduct.description,
          category: newProduct.category,
          price: newProduct.price,
          stock: newProduct.stock,
          minOrder: newProduct.minOrder,
          unit: newProduct.unit,
          imageUrls: newProduct.imageUrls.length > 0 ? newProduct.imageUrls : ["https://images.unsplash.com/photo-1595856728084-2b63897d2644?q=80&w=600&auto=format&fit=crop"]
        })
      });
    }
    
    setShowAddModal(false);
    setEditingProductId(null);
    setNewProduct({ title: "", description: "", category: "Sayuran", price: 0, stock: 0, minOrder: 1, unit: "kg", imageUrls: [] });
    loadData();
  };

  const openEditModal = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      title: product.title,
      description: product.description || "",
      category: product.category || "Sayuran",
      price: product.price,
      stock: product.stock,
      minOrder: product.minOrder || 1,
      unit: product.unit || "kg",
      imageUrls: product.imageUrls || []
    });
    checkBenchmark();
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - newProduct.imageUrls.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/webp", 0.7);
          setNewProduct(prev => ({ ...prev, imageUrls: [...prev.imageUrls, compressedBase64] }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F0] p-6 sm:p-10 text-[#1C241E]">
      <div className="max-w-6xl mx-auto space-y-8 pb-32">
        <div className="bg-pranala rounded-3xl p-8 shadow-xl flex justify-between items-center">
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
    <div className="min-h-screen bg-[#F8F6F0] p-6 sm:p-10 text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8 pb-32">
        
        {/* Header */}
        <div className="bg-pranala rounded-3xl p-8 text-[#F8F6F0] shadow-xl flex justify-between items-center">
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
            onClick={() => { 
              setEditingProductId(null);
              setNewProduct({ title: "", description: "", category: "Sayuran", price: 0, stock: 0, minOrder: 1, unit: "kg", imageUrls: [] });
              setShowAddModal(true); 
              checkBenchmark(); 
            }}
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
                    <span className="bg-[#E8E3D2] text-[#2B4C3B] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {p.stock} {p.unit}
                    </span>
                  </div>
                  {p.description && <p className="text-xs text-[#5A635B] line-clamp-2 mb-3">{p.description}</p>}
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-2xl font-black text-[#C25939]">Rp {p.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(p)} className="p-2 bg-[#F8F6F0] text-[#5A635B] rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
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

        {/* Enhanced Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
              
              <div className="flex min-h-full items-center justify-center p-4 sm:p-6 relative pointer-events-none">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto pointer-events-auto"
                >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-[#E8E3D2] flex justify-between items-center bg-[#F8F6F0]">
                  <h2 className="text-2xl font-black text-[#2B4C3B]">{editingProductId ? 'Edit Product' : 'Create Listing'}</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-[#5A635B] hover:text-[#C25939] transition-colors p-2 bg-white rounded-full shadow-sm">
                    <X size={24} />
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 md:p-8">
                    <form id="productForm" onSubmit={handleAddProduct} className="space-y-6">
                      {/* Photo Row */}
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-1/3 flex flex-col gap-2">
                          <div className="flex justify-between items-end">
                            <label className="block text-sm font-bold text-[#2B4C3B]">Product Photos</label>
                            <span className="text-xs font-semibold text-[#7A8678]">{newProduct.imageUrls.length}/5</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {newProduct.imageUrls.map((url, idx) => (
                              <div key={idx} className="aspect-square bg-[#F8F6F0] rounded-xl border border-[#DDE2D6] overflow-hidden relative group">
                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => setNewProduct(prev => ({...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== idx)}))}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="text-white" size={20} />
                                </button>
                              </div>
                            ))}
                            
                            {newProduct.imageUrls.length < 5 && (
                              <div className="aspect-square bg-[#F8F6F0] rounded-xl border-2 border-dashed border-[#DDE2D6] flex flex-col items-center justify-center relative group cursor-pointer hover:border-[#B4C179] transition-colors">
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <ImageIcon className="text-[#A4B0A7] group-hover:text-[#B4C179] transition-colors" size={24} />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Product Name</label>
                            <input required type="text" placeholder="e.g. Telur Ayam Kampung Premium" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E]" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Description (Optional)</label>
                            <textarea rows={3} placeholder="Describe the quality, origin, or freshness of your product..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E] resize-none" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Minimum Order</label>
                          <input required type="number" min="1" max={newProduct.stock} value={newProduct.minOrder || ""} onChange={e => setNewProduct({...newProduct, minOrder: Number(e.target.value)})} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E] font-bold" />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Category</label>
                          <div className="relative">
                            <button 
                              type="button" 
                              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                              className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E] font-bold flex justify-between items-center"
                            >
                              <span>{newProduct.category}</span>
                              <svg className={`fill-current h-4 w-4 text-[#5A635B] transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </button>
                            
                            <AnimatePresence>
                              {showCategoryDropdown && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-10 w-full mt-2 bg-white border border-[#DDE2D6] rounded-xl shadow-xl max-h-48 overflow-y-auto"
                                >
                                  {["Sayuran", "Buah-buahan", "Ternak (Hidup)", "Daging", "Telur", "Susu & Olahan", "Pupuk & Bibit", "Alat Tani", "Lainnya"].map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() => {
                                        setNewProduct({...newProduct, category: c});
                                        setShowCategoryDropdown(false);
                                      }}
                                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${newProduct.category === c ? 'bg-[#F8F6F0] text-[#2B4C3B]' : 'text-[#5A635B] hover:bg-[#F8F6F0] hover:text-[#1C241E]'}`}
                                    >
                                      {c}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Metric Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Stock Quantity</label>
                          <input required type="number" min="1" value={newProduct.stock || ""} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E] font-bold" />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Unit</label>
                          <div className="relative">
                            <button 
                              type="button" 
                              onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                              className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#1C241E] font-bold flex justify-between items-center"
                            >
                              <span>{newProduct.unit}</span>
                              <svg className={`fill-current h-4 w-4 text-[#5A635B] transition-transform duration-200 ${showUnitDropdown ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </button>
                            
                            <AnimatePresence>
                              {showUnitDropdown && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-10 w-full bottom-full mb-2 bg-white border border-[#DDE2D6] rounded-xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] max-h-48 overflow-y-auto"
                                >
                                  {["kg", "g", "liter", "ml", "ekor", "butir", "pcs", "ikat", "ton"].map((u) => (
                                    <button
                                      key={u}
                                      type="button"
                                      onClick={() => {
                                        setNewProduct({...newProduct, unit: u});
                                        setShowUnitDropdown(false);
                                      }}
                                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${newProduct.unit === u ? 'bg-[#F8F6F0] text-[#2B4C3B]' : 'text-[#5A635B] hover:bg-[#F8F6F0] hover:text-[#1C241E]'}`}
                                    >
                                      {u}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Price (Rp) / unit</label>
                          <input 
                            required 
                            type="text" 
                            value={newProduct.price ? newProduct.price.toLocaleString() : ""} 
                            onChange={e => {
                              const rawVal = e.target.value.replace(/\D/g, '');
                              setNewProduct({...newProduct, price: Number(rawVal)});
                            }} 
                            className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 focus:ring-2 focus:ring-[#B4C179] outline-none transition-all text-[#C25939] font-black" 
                          />
                        </div>
                      </div>
                    </form>
                </div>
                
                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-[#E8E3D2] bg-white flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-[#5A635B] bg-[#F8F6F0] hover:bg-[#E8E3D2] rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" form="productForm" className="flex-[2] py-4 font-black text-white bg-pranala hover:bg-[#1E362A] rounded-xl shadow-[0_10px_20px_-10px_rgba(43,76,59,0.5)] transition-all">
                    {editingProductId ? 'Save Changes' : 'Publish Listing'}
                  </button>
                </div>
              </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
