"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { LayoutDashboard, Bird, Package, Settings, Users, LogOut } from "lucide-react";

export default function Navigation() {
  const links = [
    {
      title: "Dashboard",
      icon: (
        <LayoutDashboard className="h-full w-full text-slate-500" />
      ),
      href: "/dashboard",
    },
    {
      title: "Flocks",
      icon: (
        <Bird className="h-full w-full text-sky-500" />
      ),
      href: "/dashboard/flocks",
    },
    {
      title: "Inventory",
      icon: (
        <Package className="h-full w-full text-slate-500" />
      ),
      href: "/dashboard/inventory",
    },
    {
      title: "Team",
      icon: (
        <Users className="h-full w-full text-slate-500" />
      ),
      href: "/dashboard/staff",
    },
    {
      title: "Settings",
      icon: (
        <Settings className="h-full w-full text-slate-500" />
      ),
      href: "/dashboard/settings",
    },
    {
      title: "Logout",
      icon: (
        <LogOut className="h-full w-full text-rose-500" />
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
