"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Paperclip, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function AiVetPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input && (!files || files.length === 0)) return;
    
    handleSubmit(e, {
      experimental_attachments: files || undefined,
    });
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen pt-8 pb-8 px-4 sm:px-8 lg:px-12 bg-slate-50 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 h-[calc(100vh-6rem)]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B4C3B] to-[#4A7C59] p-6 flex flex-col md:flex-row items-center justify-between shadow-md z-10 shrink-0">
          <div className="flex items-center gap-4 text-[#F8F6F0]">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <Sparkles size={24} className="text-emerald-50" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Pranata Agri-LLM</h1>
              <p className="text-[#DDE2D6] text-sm font-medium">Veterinary Intelligence & Diagnosis Engine</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 opacity-60">
              <Bot size={64} className="text-emerald-400" />
              <h3 className="text-xl font-bold text-slate-700">Ready to assist your flock.</h3>
              <p className="text-slate-500">
                Describe symptoms, upload photos of sick livestock, or ask for optimal feed formulas. I am powered by Google Gemini and trained on veterinary sciences.
              </p>
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
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm mt-1">
                      <Bot size={20} />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-[#2B4C3B] text-[#F8F6F0] rounded-tr-none' 
                      : 'bg-white border border-[#E8E3D2] text-[#1C241E] rounded-tl-none prose prose-emerald max-w-none'
                  }`}>
                    {/* Render Images if any */}
                    {m.experimental_attachments && m.experimental_attachments.map((att, i) => (
                      <div key={i} className="mb-3">
                        {att.contentType?.startsWith('image/') ? (
                          <img src={att.url} alt="Attachment" className="rounded-lg max-h-60 object-cover border border-slate-200" />
                        ) : (
                          <div className="bg-slate-100 text-slate-800 px-3 py-2 rounded flex items-center gap-2 text-sm">
                            <Paperclip size={16} /> {att.name || "File attached"}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Render Text */}
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm mt-1 animate-pulse">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          
          {/* File Preview before sending */}
          {files && files.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {Array.from(files).map((file, i) => (
                <div key={i} className="relative bg-slate-100 rounded-lg p-2 flex items-center gap-2 text-xs font-semibold text-slate-600 border border-slate-200 shrink-0">
                  <Paperclip size={14} />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setFiles(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm font-bold mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
              API Error: {error.message}. (Did you add GEMINI_API_KEY to .env.local?)
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-end gap-3">
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
              className="p-4 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors border border-slate-200"
              title="Upload Image or Document"
            >
              <Paperclip size={22} />
            </button>
            
            <textarea
              className="w-full bg-[#E8E3D2]/50 border border-[#D5D0C5] rounded-2xl p-4 text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#3A6B49]/50 resize-none max-h-32 min-h-[56px] placeholder:text-[#5A635B]"
              placeholder="Ask for diagnosis, feed mix, or attach photos..."
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
              className="p-4 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-emerald-600 shadow-md"
            >
              {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
            </button>
          </form>
          <div className="text-center mt-3 text-xs font-semibold text-slate-400">
            Powered by Google Gemini 2.5 Flash. AI can make mistakes. Verify clinical advice.
          </div>
        </div>

      </div>
    </div>
  );
}
