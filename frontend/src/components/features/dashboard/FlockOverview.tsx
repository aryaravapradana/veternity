"use client";

import { motion } from "framer-motion";
import { Plus, Check, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockData = [
  { day: "Mon", count: 420 },
  { day: "Tue", count: 435 },
  { day: "Wed", count: 410 },
  { day: "Thu", count: 450 },
  { day: "Fri", count: 460 },
  { day: "Sat", count: 480 },
  { day: "Sun", count: 495 },
];

export default function FlockOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loggedToday, setLoggedToday] = useState(false);

  const maxCount = Math.max(...mockData.map((d) => d.count));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col h-full relative group puffy-shadow"
    >
      <div className="flex items-start justify-between mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Egg Production</h2>
          </div>
          <p className="text-sm font-semibold text-slate-400">Weekly Harvest Overview</p>
        </div>
        
        <motion.button
          whileHover={!loggedToday ? { scale: 1.05 } : {}}
          whileTap={!loggedToday ? { scale: 0.95 } : {}}
          onClick={() => setLoggedToday(true)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300",
            loggedToday
              ? "bg-emerald-50 text-emerald-600 pointer-events-none"
              : "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-200"
          )}
        >
          {loggedToday ? (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="flex items-center gap-2"
            >
              <Check size={18} strokeWidth={3} /> Logged
            </motion.div>
          ) : (
            <>
              <Plus size={18} strokeWidth={3} /> Log Today
            </>
          )}
        </motion.button>
      </div>

      <div className="flex-1 flex items-end gap-3 sm:gap-5 min-h-[240px] mt-auto relative z-10">
        {mockData.map((data, index) => {
          const heightPercentage = (data.count / maxCount) * 100;
          return (
            <div
              key={data.day}
              className="flex-1 flex flex-col items-center gap-3 relative cursor-pointer group/bar"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-full flex justify-center h-[200px] items-end relative">
                {/* Tooltip */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? -10 : 10,
                    scale: hoveredIndex === index ? 1 : 0.8,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute -top-12 bg-slate-800 text-white text-sm font-bold py-2 px-4 rounded-2xl pointer-events-none z-20 shadow-xl"
                >
                  {data.count}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45 rounded-sm" />
                </motion.div>
                
                {/* Bar Background Track */}
                <div className="absolute bottom-0 w-full max-w-[40px] h-full bg-slate-50 rounded-full" />

                {/* Animated Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.3 + (index * 0.1),
                    type: "spring",
                    damping: 15,
                  }}
                  className={cn(
                    "relative w-full max-w-[40px] rounded-full transition-colors duration-300 z-10",
                    hoveredIndex === index 
                      ? "bg-sky-500 shadow-lg shadow-sky-200" 
                      : "bg-sky-200"
                  )}
                />
              </div>
              <span className={cn(
                "text-sm font-bold transition-colors duration-300",
                hoveredIndex === index ? "text-sky-600" : "text-slate-400"
              )}>
                {data.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          +12% vs last week
        </div>
        <motion.button 
          whileHover={{ x: 5 }}
          className="text-sky-500 text-sm font-bold flex items-center gap-1 transition-all"
        >
          Full Report <ChevronRight size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
