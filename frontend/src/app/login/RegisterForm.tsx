"use client";
import { fetchApi } from "@/lib/apiClient";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ShoppingCart, Beef, Bird, Tractor, Droplet, Circle, MoreHorizontal, ArrowRight, Check, X } from "lucide-react";

const LIVESTOCK_OPTIONS = [
  { id: "SAPI", label: "Sapi", icon: Beef },
  { id: "AYAM", label: "Ayam", icon: Bird },
  { id: "KAMBING", label: "Kambing", icon: Tractor },
  { id: "SUSU", label: "Susu", icon: Droplet },
  { id: "TELUR", label: "Telur", icon: Circle },
  { id: "BEBEK", label: "Bebek", icon: Bird },
  { id: "LAINNYA", label: "Lainnya", icon: MoreHorizontal },
];

export function RegisterForm({ onSuccess, onSwitchToLogin }: { onSuccess: () => void, onSwitchToLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const [role, setRole] = useState<"PRODUCER" | "BUYER" | null>(null);
  const [livestock, setLivestock] = useState<string[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Debounced Username Checker
  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }
    
    if (username.includes(" ")) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    const timeoutId = setTimeout(async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetchApi(`${API_BASE}/api/profile/check-username?username=${encodeURIComponent(username.trim().toLowerCase())}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch (err) {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Step 1: Validate local inputs and move to next step
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.includes(" ")) {
      setError("Username cannot contain spaces.");
      return;
    }
    if (usernameAvailable === false) {
      setError("Please choose a different username.");
      return;
    }
    setError(null);
    setStep(2);
  };

  // Finalize Profile in Backend
  const finalizeRegistration = async (selectedRole: "PRODUCER" | "BUYER") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/profile/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username: username.toLowerCase().trim(),
          password,
          role: selectedRole,
          livestockTypes: selectedRole === "PRODUCER" ? livestock : []
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      
      localStorage.setItem("farmpro_session", JSON.stringify(data));
      if (data.role === "BUYER") {
        router.push("/marketplace");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to finalize registration");
      setLoading(false);
    }
  };

  const handleRoleSelection = (selected: "PRODUCER" | "BUYER") => {
    setRole(selected);
    if (selected === "BUYER") {
      finalizeRegistration(selected);
    } else {
      setStep(3);
    }
  };

  const handleLivestockSubmit = () => {
    if (role === "PRODUCER") {
      finalizeRegistration(role);
    }
  };

  const toggleLivestock = (id: string) => {
    setLivestock(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };



  return (
    <>
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-black text-[#2B4C3B] mb-2 tracking-tight">
            {step === 1 ? "Join Pranata" : step === 2 ? "Who are you?" : "What do you farm?"}
          </h1>
          <p className="text-[#5A635B] text-sm font-medium">
            {step === 1 ? "Create your account locally." : step === 2 ? "Help us customize your experience." : "Select all commodities you produce."}
          </p>
        </div>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm font-bold">{error}</div>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStep1Submit} 
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#B4C179] transition-all" required placeholder="Budi Santoso" />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Username</label>
                <div className="relative">
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className={`w-full bg-[#F8F6F0] border ${usernameAvailable === false ? 'border-red-400 focus:ring-red-400' : 'border-[#DDE2D6] focus:ring-[#B4C179]'} rounded-xl p-3 text-[#1C241E] focus:outline-none focus:ring-2 transition-all pr-12`} required placeholder="budi_farm" />
                  
                  {username.trim() && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#DDE2D6] border-t-[#2B4C3B] animate-spin" />
                      ) : usernameAvailable ? (
                        <Check size={20} className="text-emerald-500" />
                      ) : usernameAvailable === false ? (
                        <X size={20} className="text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {usernameAvailable === false && !checkingUsername && username.trim() && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold ml-1">{username.includes(" ") ? "Username cannot contain spaces" : "Username is already taken"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-[#2B4C3B]">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-3 text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#B4C179] transition-all" required minLength={6} placeholder="••••••••" />
              </div>
              
              <button 
                type="submit" 
                disabled={loading || checkingUsername || usernameAvailable === false} 
                className="w-full bg-pranata hover:bg-[#1E362A] text-white rounded-xl font-bold text-lg py-4 shadow-lg transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={20} />
              </button>

              <div className="mt-6 text-center text-sm font-semibold">
                <p className="text-[#5A635B]">
                  Already have an account? <button type="button" onClick={onSwitchToLogin} className="text-[#F5990D] hover:underline">Log in</button>
                </p>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button 
                onClick={() => handleRoleSelection("PRODUCER")}
                disabled={loading}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-[#DDE2D6] hover:border-[#2B4C3B] hover:bg-[#F8F6F0] transition-all text-left"
              >
                <div className="w-12 h-12 bg-pranata rounded-full flex items-center justify-center text-white shrink-0"><Store size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg text-[#1C241E]">Farmer / Producer</h3>
                  <p className="text-sm text-[#5A635B]">I want to manage my farm and sell products directly.</p>
                </div>
              </button>

              <button 
                onClick={() => handleRoleSelection("BUYER")}
                disabled={loading}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-[#DDE2D6] hover:border-[#F5990D] hover:bg-[#F8F6F0] transition-all text-left"
              >
                <div className="w-12 h-12 bg-[#F5990D] rounded-full flex items-center justify-center text-white shrink-0"><ShoppingCart size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg text-[#1C241E]">Buyer / Consumer</h3>
                  <p className="text-sm text-[#5A635B]">I want to buy directly from local farmers.</p>
                </div>
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {LIVESTOCK_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = livestock.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleLivestock(item.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                        isSelected 
                          ? "border-[#2B4C3B] bg-pranata text-white shadow-md" 
                          : "border-[#DDE2D6] bg-[#F8F6F0] text-[#5A635B] hover:border-[#B4C179]"
                      }`}
                    >
                      <Icon size={28} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={handleLivestockSubmit}
                disabled={loading || livestock.length === 0}
                className="w-full bg-[#F5990D] hover:bg-[#C25939] text-white rounded-xl font-bold text-lg py-4 shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Finishing..." : "Complete Setup"} <Check size={20} />
              </button>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
