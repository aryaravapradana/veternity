"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bird } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/profile/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          password
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      // Store custom session
      localStorage.setItem("farmpro_session", JSON.stringify(data));
      if (data.role === "BUYER") {
        router.push("/marketplace");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-6 text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#DDE2D6] p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(43,76,59,0.1)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#2B4C3B] to-[#4A7C59] rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <Bird size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-[#2B4C3B] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[#5A635B] text-sm font-medium">Log in with your FarmPro username.</p>
        </div>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#2B4C3B]">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-4 text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#B4C179] transition-all"
              required
              placeholder="budi_farm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#2B4C3B]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F6F0] border border-[#DDE2D6] rounded-xl p-4 text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#B4C179] transition-all"
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2B4C3B] hover:bg-[#1E362A] text-[#F8F6F0] rounded-xl font-bold text-lg py-4 shadow-lg transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-semibold">
          <p className="text-[#5A635B]">
            Don't have an account? <Link href="/register" className="text-[#F5990D] hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
