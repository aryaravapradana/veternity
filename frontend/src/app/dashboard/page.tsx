"use client";

/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { Bird, Package, TrendingDown, ThermometerSun, Sparkles } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ActionableAlerts from "@/components/dashboard/ActionableAlerts";
import FlockOverview from "@/components/dashboard/FlockOverview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Soft, Inviting Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative bg-gradient-to-br from-sky-400 to-indigo-500 rounded-[2.5rem] p-10 overflow-hidden puffy-shadow text-white"
        >
          {/* Soft decorative background circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-sky-200" size={24} />
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  Good Morning!
                </h1>
              </div>
              <p className="text-sky-100 font-medium text-lg max-w-xl leading-relaxed">
                Here's what's happening on the farm today. Production is up 12% and the climate is optimal across all coops.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/30 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 font-black text-xl shadow-sm">
                24
              </div>
              <div>
                <p className="text-white font-bold">Degrees</p>
                <p className="text-sky-100 text-sm">Average Temp</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Flock"
            value="12,450"
            icon={Bird}
            trend="2.4%"
            trendUp={true}
            color="sky"
            delay={0.1}
          />
          <StatCard
            title="Feed Remaining"
            value="450 kg"
            icon={Package}
            trend="Low"
            trendUp={false}
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Health Index"
            value="98.8%"
            icon={TrendingDown}
            trend="0.3%"
            trendUp={true}
            color="emerald"
            delay={0.3}
          />
          <StatCard
            title="Avg Climate"
            value="26.4°C"
            icon={ThermometerSun}
            trend="Optimal"
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
