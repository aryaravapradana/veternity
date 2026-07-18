"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "sky" | "emerald" | "amber" | "violet";
  delay?: number;
}

const colorVariants = {
  sky: "bg-sky-50 text-sky-500",
  emerald: "bg-emerald-50 text-emerald-500",
  amber: "bg-amber-50 text-amber-500",
  violet: "bg-violet-50 text-violet-500",
};

const trendColors = {
  up: "bg-emerald-50 text-emerald-600",
  down: "bg-rose-50 text-rose-600",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "sky",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      className="flex flex-col p-6 bg-white rounded-[2rem] border border-slate-100 relative group puffy-shadow hover:puffy-shadow-hover transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            colorVariants[color]
          )}
        >
          <Icon size={26} strokeWidth={2.5} />
        </motion.div>
        {trend && (
          <span
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1",
              trendUp ? trendColors.up : trendColors.down
            )}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-slate-400 font-bold text-sm mb-1">{title}</h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className="text-[2rem] font-extrabold text-slate-800 tracking-tight leading-none"
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}
