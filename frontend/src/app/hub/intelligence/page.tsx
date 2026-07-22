"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Paperclip, Loader2, Sparkles, X, Briefcase, TrendingUp, BrainCircuit, Cpu, LineChart, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { fetchApi } from "@/lib/apiClient";

export default function IntelligencePage() {
  const [contextData, setContextData] = useState<any>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
    body: { contextData }
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Auto-fetch context data in background
  useEffect(() => {
    const fetchContext = async () => {
      const sessionStr = localStorage.getItem("farmpro_session");
      if (!sessionStr) return;
      const session = JSON.parse(sessionStr);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetchApi(`${API_BASE}/api/products/seller/${session.id}`).catch(() => null),
          fetchApi(`${API_BASE}/api/orders/PRODUCER/${session.id}`).catch(() => null)
        ]);
        
        const products = prodRes && prodRes.ok ? await prodRes.json() : [];
        const orders = ordRes && ordRes.ok ? await ordRes.json() : [];
        setContextData({ profile: session, products: Array.isArray(products) ? products : (products.data || []), orders: Array.isArray(orders) ? orders : (orders.data || []) });
      } catch (e) {
        console.error("Background context fetch failed", e);
      }
    };
    fetchContext();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.75): Promise<{ name: string; contentType: string; url: string }> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, contentType: file.type, url: reader.result as string });
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ name: file.name, contentType: file.type, url: e.target?.result as string });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({
            name: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            contentType: 'image/jpeg',
            url: compressedDataUrl,
          });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input && (!files || files.length === 0)) return;
    
    let attachments: Array<{ name: string; contentType: string; url: string }> | undefined = undefined;
    if (files && files.length > 0) {
      attachments = await Promise.all(
        Array.from(files).map((file) => compressImage(file))
      );
    }

    handleSubmit(e, {
      experimental_attachments: attachments as any,
    });
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerateInsights = async () => {
    if (!contextData) {
      alert("Sedang menyinkronkan data dengan backend, mohon tunggu sebentar...");
      return;
    }
    
    append({
      role: 'user',
      content: 'Tolong berikan ringkasan performa bisnis saya saat ini dan berikan 1-2 rekomendasi (Actionable Insights) terpenting berdasarkan data penjualan dan produk saya di backend.'
    });
  };

  return (
    <div className="min-h-screen pt-8 pb-8 px-4 sm:px-8 lg:px-12 bg-[#F8F6F0] flex flex-col" >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-[#E8E3D2] h-[calc(100vh-6rem)] px-0">
        {/* Header */}
        <div className="bg-[#1C241E] p-6 flex flex-col md:flex-row items-center justify-between shadow-md z-10 shrink-0 relative overflow-hidden">
          {/* Decorative glowing orb */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-4 text-white relative z-10">
            <img src="/logos/intelligence/intelligence-white.png" alt="Intelligence Logo" className="h-12 w-auto object-contain drop-shadow-md"  loading="lazy" decoding="async" />
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">Pranata Intelligence <Sparkles size={16} className="text-emerald-400" /></h1>
              <p className="text-white/60 text-sm font-medium">Advanced agricultural analytics & veterinary AI</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md relative z-10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Gemini 1.5 Flash</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-transparent custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center w-full">
              <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="md:col-span-2 bg-[#1C241E] p-10 rounded-[2rem] text-white text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] mb-6 relative overflow-hidden border border-[#2B4C3B]">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
                      <Cpu size={40} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black mb-3">Pranata Intelligence Center</h3>
                    <p className="text-white/70 text-sm font-medium max-w-xl mx-auto leading-relaxed">
                      Sistem kecerdasan buatan komprehensif untuk memantau performa bisnis, menganalisis penyakit ternak, dan memberikan rekomendasi strategis secara *real-time*.
                    </p>
                  </div>
                </div>
                
                <button onClick={() => handleInputChange({ target: { value: "Hitung FCR untuk 1000 ekor ayam broiler" } } as any)} className="bg-white p-6 rounded-[2rem] border border-[#E8E3D2] hover:border-emerald-400 hover:shadow-[0_10px_30px_-15px_rgba(52,211,153,0.3)] hover:-translate-y-1 transition-all text-left group">
                  <div className="w-10 h-10 bg-[#F1EBE1] group-hover:bg-emerald-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <Sprout size={20} className="text-[#C25939] group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h4 className="font-bold text-[#1C241E] mb-1 group-hover:text-emerald-600 transition-colors">Simulasi Pakan</h4>
                  <p className="text-xs text-[#5A635B] font-medium leading-relaxed">Bantu hitung rasio efisiensi pakan (FCR) dan optimalkan biaya operasional harian Anda.</p>
                </button>
                
                <button onClick={() => handleInputChange({ target: { value: "Kapan saya harus vaksin ND pada anak ayam?" } } as any)} className="bg-white p-6 rounded-[2rem] border border-[#E8E3D2] hover:border-[#F5990D] hover:shadow-[0_10px_30px_-15px_rgba(245,153,13,0.3)] hover:-translate-y-1 transition-all text-left group">
                  <div className="w-10 h-10 bg-[#F1EBE1] group-hover:bg-orange-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <BrainCircuit size={20} className="text-[#C25939] group-hover:text-[#F5990D] transition-colors" />
                  </div>
                  <h4 className="font-bold text-[#1C241E] mb-1 group-hover:text-[#F5990D] transition-colors">Jadwal Vaksinasi</h4>
                  <p className="text-xs text-[#5A635B] font-medium leading-relaxed">Konsultasi jadwal pencegahan penyakit dan identifikasi gejala klinis pada ternak.</p>
                </button>
                
                <button onClick={handleGenerateInsights} disabled={!contextData || isLoading} className="md:col-span-2 relative overflow-hidden bg-gradient-to-r from-[#2B4C3B] to-[#4A7C59] p-8 rounded-[2rem] border-none shadow-[0_15px_30px_-10px_rgba(43,76,59,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(43,76,59,0.5)] hover:-translate-y-1 transition-all text-center group flex flex-col items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  
                  {(!contextData || isLoading) ? (
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Loader2 size={28} className="text-[#F5990D] animate-spin" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-white/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm transition-colors border border-white/20">
                      <TrendingUp size={28} className="text-[#F5990D] group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  
                  <h4 className="font-black text-white text-xl mb-2 relative z-10">Generate Business Insights</h4>
                  <p className="text-sm text-white/80 font-medium max-w-lg mx-auto relative z-10">AI akan menganalisis seluruh data penjualan, cuaca, dan pesanan Anda secara real-time dari sistem untuk memberikan strategi bisnis akurat.</p>
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map(m => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#1C241E] to-[#2B4C3B] flex items-center justify-center text-white shadow-md mt-1 border border-[#E8E3D2]">
                      <BrainCircuit size={20} className="text-emerald-400" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-[2rem] p-5 shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-pranata text-[#F8F6F0] rounded-tr-none' 
                      : 'bg-white border border-[#E8E3D2] text-[#1C241E] rounded-tl-none'
                  }`}>
                    {/* Render Images if any */}
                    {m.experimental_attachments && m.experimental_attachments.map((att, i) => (
                      <div key={i} className="mb-4">
                        {att.contentType?.startsWith('image/') ? (
                          <img src={att.url} alt="Attachment" className="rounded-2xl max-h-64 object-cover border border-[#E8E3D2] shadow-sm"  loading="lazy" decoding="async" />
                        ) : (
                          <div className="bg-[#F8F6F0] text-[#1C241E] px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-[#E8E3D2]">
                            <Paperclip size={16} className="text-[#C25939]" /> {att.name || "File attached"}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Render Text */}
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                    ) : (
                      <div 
                        className="text-[15px] leading-relaxed max-w-none" 
                        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", letterSpacing: "normal" }}
                      >
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p className="mb-5 last:mb-0 text-[#1C241E] font-medium" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-2xl font-black text-[#2B4C3B] mt-6 mb-3 first:mt-0" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-black text-[#2B4C3B] mt-6 mb-3 first:mt-0" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-black text-[#2B4C3B] mt-6 mb-2 first:mt-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2 text-[#1C241E] font-medium marker:text-[#C25939]" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-[#1C241E] font-medium marker:text-[#C25939]" {...props} />,
                            li: ({node, ...props}) => <li className="" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-black text-[#1C241E]" {...props} />,
                            a: ({node, ...props}) => <a className="text-[#C25939] hover:text-[#F5990D] font-bold underline" {...props} />,
                            table: ({node, ...props}) => <div className="overflow-x-auto mb-5"><table className="w-full text-left border-collapse" {...props} /></div>,
                            th: ({node, ...props}) => <th className="border-b-2 border-[#E8E3D2] p-3 font-bold text-[#2B4C3B] bg-[#F8F6F0]" {...props} />,
                            td: ({node, ...props}) => <td className="border-b border-[#E8E3D2] p-3" {...props} />
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#2B4C3B] to-[#4A7C59] flex items-center justify-center text-white shadow-md mt-1 border border-white/20 animate-pulse">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="bg-white border border-[#E8E3D2] rounded-[2rem] rounded-tl-none p-5 flex items-center gap-2 text-[#5A635B] text-sm font-bold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5990D] animate-bounce" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5990D] animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5990D] animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-[#E8E3D2] shrink-0">
          
          {/* File Preview before sending */}
          {files && files.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {Array.from(files).map((file, i) => (
                <div key={i} className="relative bg-[#F8F6F0] rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-[#1C241E] border border-[#E8E3D2] shadow-sm shrink-0">
                  <Paperclip size={14} className="text-[#C25939]" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setFiles(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-1 p-1 hover:bg-white rounded-full text-[#5A635B] hover:text-[#C25939] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm font-bold mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
              API Error: {error.message}. (Did you add GEMINI_API_KEY to .env.local?)
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-end gap-3 bg-[#F8F6F0] p-2 rounded-[2rem] border border-[#E8E3D2] shadow-inner">
            <input 
              type="file" 
              multiple
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => setFiles(e.target.files)}
              accept="image/*,.pdf,.csv,.txt"
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 shrink-0 bg-white hover:bg-[#E8E3D2] text-[#2B4C3B] rounded-full transition-colors border border-[#E8E3D2] shadow-sm ml-1"
              title="Upload Image or Document"
            >
              <Paperclip size={22} />
            </button>
            
            <textarea
              className="w-full bg-transparent border-none p-4 text-[#1C241E] font-medium focus:outline-none focus:ring-0 resize-none max-h-32 min-h-[56px] placeholder:text-[#A4B0A7]"
              placeholder="Tanya Pranata Intelligence atau lampirkan foto..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // Trigger form submission
                  onSubmit(e as any);
                }
              }}
              rows={1}
            />
            
            <button 
              type="submit" 
              disabled={isLoading || (!input && !files)}
              className="p-4 shrink-0 bg-[#F5990D] hover:bg-[#C25939] text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-[#F5990D] shadow-md mr-1"
            >
              {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
            </button>
          </form>
          <div className="text-center mt-4 text-[10px] font-bold text-[#A4B0A7] tracking-wider uppercase">
            Powered by Google Gemini. AI can make mistakes. Verify clinical advice.
          </div>
        </div>

      </div>
    </div>
  );
}
