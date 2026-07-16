"use client";

import { useEffect, useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { LayoutDashboard, Bird, Package, Settings, Users, LogOut, LineChart, Sparkles, Store } from "lucide-react";

export default function Navigation() {
  const links = [
    {
      title: "Agri-LLM",
      icon: (
        <Sparkles className="h-full w-full text-[#3A6B49]" /> // Darker green for contrast
      ),
      href: "/dashboard/ai-vet",
    },
    {
      title: "Flocks",
      icon: (
        <Bird className="h-full w-full text-[#A34B30]" /> // Darker rust/vibrant
      ),
      href: "/dashboard/flocks",
    },
    {
      title: "My Store",
      icon: (
        <Store className="h-full w-full text-[#F5990D]" />
      ),
      href: "/dashboard/store",
    },
    {
      title: "Team",
      icon: (
        <Users className="h-full w-full text-[#5B6010]" /> // Dark olive
      ),
      href: "/dashboard/staff",
    },
    {
      title: "Settings",
      icon: (
        <Settings className="h-full w-full text-[#3F4841]" /> // Darker warm gray
      ),
      href: "/dashboard/settings",
    },
    {
      title: "Logout",
      icon: (
        <LogOut className="h-full w-full text-rose-700" /> // Standard visible red
      ),
      href: "/",
    },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock
        items={links}
      />
    </div>
  );
}
