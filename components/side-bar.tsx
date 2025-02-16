"use client";

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  Video,
  Settings,
  Menu,
  ListOrdered,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/djk_logo.png"
                alt="Acme"
                width={100}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="/djk_logo.png"
                alt="Acme"
                width={100}
                height={66}
                className="flex-shrink-0 block dark:hidden"
              />
              {/* <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                DJK International
              </span> */}
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Home}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/dashboard/orders" icon={ListOrdered}>
                    Orders
                  </NavItem>
                  <NavItem href="/dashboard/customers" icon={BarChart2}>
                    Customers
                  </NavItem>
                  <NavItem href="/dashboard/analytics" icon={BarChart2}>
                    Analytics
                  </NavItem>
                  <NavItem href="/dashboard/organization" icon={Building2}>
                    Organization
                  </NavItem>
                  <NavItem href="/dashboard/documents" icon={Folder}>
                    Documents
                  </NavItem>
                </div>
              </div>
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Registration
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard/open-files" icon={Wallet}>
                    Open Files
                  </NavItem>
                  <NavItem href="/dashboard/manage-files" icon={Receipt}>
                    Manage Files
                  </NavItem>
                  <NavItem href="/dashboard/manage-cargo" icon={CreditCard}>
                    Manage Cargo
                  </NavItem>
                  <NavItem href="/dashboard/cargo-position" icon={CreditCard}>
                    Cargo Position
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard/transactions" icon={Wallet}>
                    Transactions
                  </NavItem>
                  <NavItem href="/dashboard/invoices" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="/dashboard/payments" icon={CreditCard}>
                    Payments
                  </NavItem>
                  <NavItem href="/dashboard/expenses" icon={CreditCard}>
                    Expenses
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Team
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Users2}>
                    Members
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    Permissions
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
