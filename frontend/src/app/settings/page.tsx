"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Lock, Camera, CheckCircle, AlertCircle, ChevronLeft,
  Eye, EyeOff, Save, Loader2, Store, MapPin, Phone, ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageLoading } from "@/components/loading-context";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Toast = { type: "success" | "error"; message: string };

function compressImage(file: File, maxPx = 400, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── Reusable file drop zone ──────────────────────────────────────────────────
function UploadZone({
  label, hint, onFile, inline = false, children
}: {
  label: string; hint: string; onFile: (f: File) => void;
  inline?: boolean; children?: React.ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
        className={`w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
          dragging
            ? "border-[#2B4C3B] bg-[#EEF2E6] scale-[1.01]"
            : "border-[#DDE2D6] hover:border-[#2B4C3B] hover:bg-[#F8FAF6]"
        } ${inline ? "p-4" : "p-7"}`}
      >
        {children ?? (
          <>
            <div className="w-10 h-10 bg-[#F1EBE1] rounded-xl flex items-center justify-center">
              <ImageIcon size={20} className="text-[#7A8678]" />
            </div>
            <p className="font-black text-[#1C241E] text-sm">{label}</p>
            <p className="text-xs text-[#7A8678] font-medium">{hint}</p>
          </>
        )}
      </button>
      <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AccountSettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);

  // Form state
  const [username, setUsername]   = useState("");
  const [fullName, setFullName]   = useState("");
  const [farmName, setFarmName]   = useState("");
  const [location, setLocation]   = useState("");
  const [contact,  setContact]    = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Password form
  const [currentPw, setCurrentPw]   = useState("");
  const [newPw,     setNewPw]       = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showCur,   setShowCur]     = useState(false);
  const [showNew,   setShowNew]     = useState(false);
  const [showConf,  setShowConf]    = useState(false);

  const [saving,    setSaving]      = useState(false);
  const [savingPw,  setSavingPw]    = useState(false);
  const [toast,     setToast]       = useState<Toast | null>(null);
  const [usernameAvail, setUsernameAvail]     = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem("farmpro_session");
    if (!sessionStr) { router.push("/login"); return; }
    fetchProfile(JSON.parse(sessionStr).id);
  }, []);

  const fetchProfile = async (id: string) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/profile/${id}`);
    if (res.ok) {
      const d = await res.json();
      setProfile(d);
      setUsername(d.username   || "");
      setFullName(d.fullName   || "");
      setFarmName(d.farmName   || "");
      setLocation(d.location   || "");
      setContact (d.contact    || "");
      setAvatarUrl(d.avatarUrl || null);
      setBannerUrl(d.bannerUrl || null);
    }
    setLoading(false);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Debounced username check
  useEffect(() => {
    if (!profile || username === profile.username || username.length < 3) {
      setUsernameAvail(null); return;
    }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const res = await fetch(`${API_BASE}/api/profile/check-username?username=${encodeURIComponent(username)}`);
      setUsernameAvail((await res.json()).available);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(t);
  }, [username, profile]);

  const handleSaveProfile = async () => {
    if (usernameAvail === false) { showToast("error", "Username sudah dipakai."); return; }
    setSaving(true);
    const res = await fetch(`${API_BASE}/api/profile/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, fullName, farmName, location, contact, avatarUrl, bannerUrl }),
    });
    const data = await res.json();
    if (!res.ok) { showToast("error", data.error || "Gagal menyimpan."); }
    else {
      const updated = { ...profile, ...data };
      setProfile(updated);
      localStorage.setItem("farmpro_session", JSON.stringify(updated));
      showToast("success", "Profil berhasil diperbarui!");
    }
    setSaving(false);
  };

  const handleChangePw = async () => {
    if (newPw.length < 6)       { showToast("error", "Password baru minimal 6 karakter."); return; }
    if (newPw !== confirmPw)    { showToast("error", "Konfirmasi password tidak cocok."); return; }
    setSavingPw(true);
    const res = await fetch(`${API_BASE}/api/profile/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (!res.ok) { showToast("error", data.error || "Gagal mengubah password."); }
    else { showToast("success", "Password berhasil diubah!"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }
    setSavingPw(false);
  };

  const backPath = profile?.role === "PRODUCER" ? "/dashboard" : "/marketplace";
  const initials = (profile?.fullName || profile?.username || "?").charAt(0).toUpperCase();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1C241E]" style={{ fontFamily: "'Stack Sans Notch', sans-serif" }}>

      {/* ── Back Navbar ── */}
      <div className="sticky top-0 z-40 px-4 pt-4">
        <div className="max-w-2xl mx-auto bg-white border border-[#E8E3D2] rounded-2xl shadow-[0_4px_24px_-8px_rgba(43,76,59,0.1)] px-5 h-14 flex items-center justify-between">
          <button onClick={() => router.push(backPath)} className="flex items-center gap-2 text-[#5A635B] hover:text-[#2B4C3B] font-bold text-sm transition-colors">
            <ChevronLeft size={20} />
            {profile?.role === "PRODUCER" ? "Dashboard" : "Marketplace"}
          </button>
          <span className="font-black text-sm text-[#1C241E]">Pengaturan Akun</span>
          <div className="w-28" />
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-sm whitespace-nowrap ${
              toast.type === "success" ? "bg-[#2B4C3B] text-white" : "bg-[#C25939] text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-6">

        {/* ══════════════════════════════════════════════════════
            TWITTER / FB STYLE PROFILE CARD
        ══════════════════════════════════════════════════════ */}
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] overflow-hidden shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">

          {/* Banner */}
          <div className="relative h-40 sm:h-52 bg-[#2B4C3B] group">
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              /* Default earthy pattern */
              <div className="w-full h-full overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <rect width="800" height="200" fill="#2B4C3B"/>
                  <circle cx="100" cy="-20" r="150" fill="#3A6B49" opacity="0.5"/>
                  <circle cx="700" cy="220" r="180" fill="#1E362A" opacity="0.6"/>
                  <circle cx="400" cy="100" r="120" fill="#4A7C59" opacity="0.25"/>
                  <circle cx="650" cy="20" r="90" fill="#F5990D" opacity="0.08"/>
                </svg>
              </div>
            )}

            {/* Banner upload overlay — always visible on hover */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-2">
              <div className="flex items-center gap-2 bg-white/90 text-[#1C241E] font-black text-xs px-4 py-2.5 rounded-xl shadow-lg">
                <Camera size={15} /> Ganti Sampul
              </div>
              <input
                type="file" accept="image/*" className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setBannerUrl(await compressImage(f, 1200, 0.85));
                }}
              />
            </label>
          </div>

          {/* Avatar + action row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#2B4C3B] border-4 border-white overflow-hidden shadow-lg">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                      {initials}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file" accept="image/*" className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) setAvatarUrl(await compressImage(f, 400, 0.8));
                    }}
                  />
                </label>
              </div>

              {/* Edit profile button (triggers save) */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSaveProfile}
                disabled={saving || usernameAvail === false}
                className="flex items-center gap-2 border-2 border-[#2B4C3B] text-[#2B4C3B] font-black text-sm px-5 py-2.5 rounded-full hover:bg-[#2B4C3B] hover:text-white transition-all disabled:opacity-40"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Menyimpan…" : "Simpan Profil"}
              </motion.button>
            </div>

            {/* Name / username */}
            <h1 className="text-2xl font-black text-[#1C241E] leading-tight">{profile?.fullName || profile?.username}</h1>
            <p className="text-sm font-bold text-[#7A8678]">@{profile?.username}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {profile?.location && (
                <span className="flex items-center gap-1 text-xs text-[#7A8678] font-semibold">
                  <MapPin size={13} className="text-[#C25939]" /> {profile.location}
                </span>
              )}
              {profile?.contact && (
                <span className="flex items-center gap-1 text-xs text-[#7A8678] font-semibold">
                  <Phone size={13} className="text-[#2B4C3B]" /> {profile.contact}
                </span>
              )}
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                profile?.role === "PRODUCER" ? "bg-[#EEF2E6] text-[#2B4C3B]" : "bg-[#FFF3E0] text-[#C25939]"
              }`}>
                {profile?.role === "PRODUCER" ? "Pedagang / Petani" : "Pembeli"}
              </span>
            </div>

            {/* Hint */}
            <p className="text-xs text-[#A4B0A7] font-semibold mt-4">
              Arahkan cursor ke foto atau sampul untuk menggantinya.
            </p>
          </div>
        </div>

        {/* ── Profile Info Form ── */}
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] p-7 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
          <h2 className="text-lg font-black text-[#1C241E] flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-[#EEF2E6] rounded-lg flex items-center justify-center">
              <User size={14} className="text-[#2B4C3B]" />
            </div>
            Informasi Profil
          </h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl px-4 py-3 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                  placeholder="username"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingUsername && <Loader2 size={15} className="text-[#A4B0A7] animate-spin" />}
                  {!checkingUsername && usernameAvail === true  && <CheckCircle size={15} className="text-emerald-500" />}
                  {!checkingUsername && usernameAvail === false && <AlertCircle  size={15} className="text-[#C25939]"   />}
                </div>
              </div>
              {usernameAvail === false && <p className="text-xs text-[#C25939] font-bold mt-1">Username sudah dipakai.</p>}
              {usernameAvail === true  && <p className="text-xs text-emerald-600 font-bold mt-1">Username tersedia!</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl px-4 py-3 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                placeholder="Nama lengkap" />
            </div>

            {/* Farm Name — PRODUCER only */}
            {profile?.role === "PRODUCER" && (
              <div>
                <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">Nama Usaha / Farm</label>
                <div className="relative">
                  <Store size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4B0A7]" />
                  <input value={farmName} onChange={(e) => setFarmName(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                    placeholder="Nama toko / farm" />
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">Lokasi</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4B0A7]" />
                <input value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                  placeholder="Kota, Provinsi" />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">Kontak / WhatsApp</label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A4B0A7]" />
                <input value={contact} onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                  placeholder="+62 812 xxxx xxxx" />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSaveProfile}
            disabled={saving || usernameAvail === false}
            className="mt-6 w-full py-3.5 bg-[#2B4C3B] hover:bg-[#1E362A] disabled:opacity-50 text-white font-black rounded-2xl shadow-[0_6px_16px_-4px_rgba(43,76,59,0.4)] transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Menyimpan…" : "Simpan Perubahan"}
          </motion.button>
        </div>

        {/* ── Change Password ── */}
        <div className="bg-white border border-[#E8E3D2] rounded-[2rem] p-7 shadow-[0_4px_24px_-8px_rgba(43,76,59,0.08)]">
          <h2 className="text-lg font-black text-[#1C241E] flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-[#FFF3E0] rounded-lg flex items-center justify-center">
              <Lock size={14} className="text-[#C25939]" />
            </div>
            Ubah Password
          </h2>

          <div className="space-y-4">
            {[
              { label: "Password Saat Ini",          val: currentPw, set: setCurrentPw, show: showCur,  toggle: () => setShowCur (v => !v) },
              { label: "Password Baru",               val: newPw,     set: setNewPw,     show: showNew,  toggle: () => setShowNew (v => !v) },
              { label: "Konfirmasi Password Baru",    val: confirmPw, set: setConfirmPw, show: showConf, toggle: () => setShowConf(v => !v) },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-black text-[#5A635B] uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <input
                    type={f.show ? "text" : "password"}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full bg-[#F8F6F0] border border-[#E8E3D2] rounded-xl px-4 py-3 pr-11 font-bold text-sm text-[#1C241E] focus:outline-none focus:ring-2 focus:ring-[#2B4C3B]/30 focus:border-[#2B4C3B] transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A4B0A7] hover:text-[#5A635B] transition-colors">
                    {f.show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            ))}

            {newPw && newPw.length < 6 && (
              <p className="text-xs text-[#C25939] font-bold flex items-center gap-1.5"><AlertCircle size={13} /> Minimal 6 karakter.</p>
            )}
            {newPw && confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-[#C25939] font-bold flex items-center gap-1.5"><AlertCircle size={13} /> Password tidak cocok.</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleChangePw}
            disabled={savingPw || !currentPw || !newPw || newPw !== confirmPw || newPw.length < 6}
            className="mt-6 w-full py-3.5 bg-[#C25939] hover:bg-[#A84A2E] disabled:opacity-40 text-white font-black rounded-2xl shadow-[0_6px_16px_-4px_rgba(194,89,57,0.4)] transition-colors flex items-center justify-center gap-2"
          >
            {savingPw ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {savingPw ? "Menyimpan…" : "Ubah Password"}
          </motion.button>
        </div>

        {/* ── Danger Zone ── */}
        <div className="border-2 border-dashed border-[#E8E3D2] rounded-[2rem] p-7">
          <h2 className="text-sm font-black text-[#A4B0A7] uppercase tracking-wider mb-4">Zona Berbahaya</h2>
          <button
            onClick={() => {
              if (confirm("Yakin ingin keluar dari akun?")) {
                localStorage.removeItem("farmpro_session");
                router.push("/login");
              }
            }}
            className="w-full py-3 border-2 border-[#E8E3D2] text-[#C25939] font-black rounded-2xl hover:bg-[#FFF3E0] hover:border-[#C25939]/40 transition-all text-sm"
          >
            Keluar (Logout)
          </button>
        </div>

      </main>
    </div>
  );
}
