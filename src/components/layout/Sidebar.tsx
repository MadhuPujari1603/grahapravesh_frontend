"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingBag,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  X,
  Lock,
  Unlock,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag },
  { label: "Payments",   href: "/admin/payments",   icon: CreditCard },
  { label: "Products",   href: "/admin/products",   icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
  { label: "Customers",  href: "/admin/customers",  icon: Users },
  { label: "Messages",   href: "/admin/messages",   icon: MessageSquare },
  { label: "Settings",   href: "/admin/settings",   icon: Settings },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const desktopContent = (
    <div className="flex flex-col h-full bg-brand-emerald-dark text-white">
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-white/10 transition-all duration-300",
        isCollapsed ? "flex-col gap-3 px-3 py-4" : "justify-between px-6 py-5"
      )}>
        {isCollapsed ? (
          <>
            <Link href="/admin/dashboard">
              <img src="/images/SAMPAGANGA.jpg" alt="GP" className="h-9 w-9 object-cover rounded-full brightness-150" />
            </Link>
            <button
              onClick={onToggleCollapse}
              title="Unlock sidebar"
              className="p-1.5 rounded-lg text-emerald-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <img src="/images/SAMPAGANGA.jpg" alt="Graha Pravesh" className="h-8 w-8 rounded-lg object-cover brightness-110" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                <span
                  className="text-white"
                  style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1, display: 'block' }}
                >
                  Graha Pravesh
                </span>
                <span
                  className="text-brand-gold"
                  style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', lineHeight: 1, display: 'block', textTransform: 'uppercase' }}
                >
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-emerald-300 hover:bg-white/10 hover:text-white transition-colors shrink-0"
            >
              <Lock className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-1", isCollapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-emerald-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    )}
                  </>
                )}
              </Link>
              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className={cn("py-3 border-t border-white/10", isCollapsed ? "px-2" : "px-3")}>
        {isCollapsed ? (
          <div className="relative group">
            <Link
              href="/"
              className="flex items-center justify-center p-3 rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Store className="w-5 h-5" />
            </Link>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Back to Store
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        ) : (
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            Back to Store
          </Link>
        )}
      </div>

    </div>
  );

  const mobileContent = (
    <div className="flex flex-col h-full bg-brand-emerald-dark text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <img src="/images/SAMPAGANGA.jpg" alt="Graha Pravesh" className="h-8 w-8 rounded-lg object-cover brightness-110" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            <span
              className="text-white"
              style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1, display: 'block' }}
            >
              Graha Pravesh
            </span>
            <span
              className="text-brand-gold"
              style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', lineHeight: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Admin Panel
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-emerald-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {desktopContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <aside className="absolute inset-y-0 left-0 w-64 z-50">
            {mobileContent}
          </aside>
        </div>
      )}
    </>
  );
}
