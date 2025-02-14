"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table";
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

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="text-sm text-muted-foreground">
                Aug 13, 2023 - Aug 18, 2023
              </div>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              Ethereum Network
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value="$74,892"
              change={{
                value: "$1,340",
                percentage: "-2.1%",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="Your Deposits"
              value="$54,892"
              change={{
                value: "$1,340",
                percentage: "+13.2%",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="Accrued Yield"
              value="$20,892"
              change={{
                value: "$1,340",
                percentage: "+1.2%",
                isPositive: true,
              }}
            />
          </div>
          <Card className="mt-6 p-6">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">General Statistics</h2>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost">
                  Today
                </Button>
                <Button size="sm" variant="ghost">
                  Last week
                </Button>
                <Button size="sm" variant="ghost">
                  Last month
                </Button>
                <Button size="sm" variant="ghost">
                  Last 6 month
                </Button>
                <Button size="sm" variant="ghost">
                  Year
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-6">
            <VaultTable />
          </div>
        </main>
      </div>
    </div>
  );
}
