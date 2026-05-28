"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Bell, LogOut, ChevronRight } from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];
    let path = "";
    for (const part of parts) {
      path += `/${part}`;
      crumbs.push({
        label: part.charAt(0).toUpperCase() + part.slice(1),
        href: path,
      });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "rgba(240, 235, 224, 0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.55)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 24px 0 rgba(10,61,46,0.08)",
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-brand-charcoal-medium hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-charcoal-light" />
                )}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "font-medium text-brand-charcoal"
                      : "text-brand-charcoal-light"
                  }
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-brand-charcoal-medium hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Info */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-brand-charcoal">
                {user?.name}
              </p>
              <p className="text-xs text-brand-charcoal-light">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-emerald flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-brand-charcoal-light hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
