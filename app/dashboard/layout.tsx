"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto transition-transform duration-300 transform lg:translate-x-0 border-r bg-background/50 backdrop-blur lg:static lg:w-64 flex-shrink-0`}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Wallet className="h-6 w-6" />
          <span className="font-bold">DJK Internatioanal</span>
        </div>
        <div className="px-4 py-4">
          <Input placeholder="Search" className="bg-background/50" />
        </div>
        <nav className="space-y-2 px-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/stats">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics & Income
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Orders
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Funding
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Wallet className="h-4 w-4" />
            Yield Vaults
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
          <Link href="/dashboard/support">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 lg:hidden">
          <button
            className="p-2 bg-background/50 backdrop-blur rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Vaultify</h1>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </header>
        {children}
      </div>
    </div>
  );
}
