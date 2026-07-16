"use client";

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bird, Package, TrendingDown, ThermometerSun, Sparkles } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ActionableAlerts from "@/components/dashboard/ActionableAlerts";
import FlockOverview from "@/components/dashboard/FlockOverview";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard/overview")
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="min-h-screen pt-8 pb-24 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Soft, Inviting Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative bg-gradient-to-br from-[#2B4C3B] to-[#4A7C59] rounded-[2.5rem] p-10 overflow-hidden shadow-[0_20px_40px_-10px_rgba(43,76,59,0.3)] text-[#F8F6F0]"
        >
          {/* Soft decorative background circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-[#B4C179]" size={24} />
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  Good Morning!
                </h1>
              </div>
              <p className="text-[#DDE2D6] font-medium text-lg max-w-xl leading-relaxed">
                Here's what's happening on the farm today. Production is up 12% and the climate is optimal across all coops.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 bg-[#1C241E]/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-[#F8F6F0]/20 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#F8F6F0] rounded-2xl flex items-center justify-center text-[#2B4C3B] font-black text-xl shadow-sm">
                24
              </div>
              <div>
                <p className="text-[#F8F6F0] font-bold">Degrees</p>
                <p className="text-[#B4C179] text-sm">Average Temp</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Flock"
            value={isLoading ? "..." : (dashboardData?.totalBirds?.toLocaleString() || "0")}
            icon={Bird}
            trend={isLoading ? "..." : `${dashboardData?.activeFlocksCount} active flocks`}
            trendUp={true}
            color="sky"
            delay={0.1}
          />
          <StatCard
            title="Pending Tasks"
            value={isLoading ? "..." : (dashboardData?.pendingTasks?.toString() || "0")}
            icon={Package}
            trend="Needs Attention"
            trendUp={false}
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Health Index"
            value={isLoading ? "..." : `${dashboardData?.healthIndex || 98.8}%`}
            icon={TrendingDown}
            trend="0.3%"
            trendUp={true}
            color="emerald"
            delay={0.3}
          />
          <StatCard
            title="Corn Price (kg)"
            value={isLoading ? "..." : `Rp ${dashboardData?.cornPrice?.toLocaleString() || 0}`}
            icon={ThermometerSun}
            trend="Live Bapanas Data"
            trendUp={true}
            color="violet"
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
            className="xl:col-span-2 h-[480px]"
          >
            <FlockOverview />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
            className="xl:col-span-1 h-[480px]"
          >
            <ActionableAlerts />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
