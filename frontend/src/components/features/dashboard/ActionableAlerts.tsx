"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AlertType = "critical" | "warning" | "success";

interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  actionText?: string;
}

const defaultAlerts: AlertItem[] = [
  {
    id: "1",
    type: "critical",
    title: "Low Feed Stock",
    description: "You have less than 2 days of starter feed remaining for Coop A.",
    actionText: "Order Feed",
  },
  {
    id: "2",
    type: "warning",
    title: "Mortality Rate Alert",
    description: "Coop B mortality increased by 1.2% today. Check temperature settings.",
    actionText: "View Details",
  },
  {
    id: "3",
    type: "success",
    title: "Harvest Ready",
    description: "500 Broilers in Coop C have reached optimal harvest weight (2.1kg).",
    actionText: "Schedule Harvest",
  },
];

const icons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
};

const styles = {
  critical: "bg-white border-rose-100 shadow-sm shadow-rose-100",
  warning: "bg-white border-amber-100 shadow-sm shadow-amber-100",
  success: "bg-white border-emerald-100 shadow-sm shadow-emerald-100",
};

const iconStyles = {
  critical: "text-rose-500 bg-rose-50",
  warning: "text-amber-500 bg-amber-50",
  success: "text-emerald-500 bg-emerald-50",
};

export default function ActionableAlerts() {
  const [alerts, setAlerts] = useState(defaultAlerts);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-800">AI Insights</h2>
        <motion.span 
          key={alerts.length}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-sky-50 text-sky-600 text-xs font-bold px-4 py-1.5 rounded-full"
        >
          {alerts.length} Active
        </motion.span>
      </div>

      <AnimatePresence mode="popLayout">
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 3 }}
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-slate-700 font-bold text-xl mb-2">All clear!</h3>
            <p className="text-slate-400 font-medium">Everything is running smoothly on the farm.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const Icon = icons[alert.type];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.4 }}
                  key={alert.id}
                  className={cn(
                    "relative overflow-hidden rounded-[1.5rem] border p-5 group",
                    styles[alert.type]
                  )}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={cn("p-2.5 rounded-2xl mt-0.5", iconStyles[alert.type])}>
                      <Icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pr-8">
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{alert.title}</h3>
                      <p className="text-sm font-medium text-slate-500 mb-3 leading-relaxed">{alert.description}</p>
                      {alert.actionText && (
                        <motion.button 
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
                        >
                          {alert.actionText} <ArrowRight size={16} strokeWidth={2.5} />
                        </motion.button>
                      )}
                    </div>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 text-slate-300 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-all absolute top-4 right-4"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
