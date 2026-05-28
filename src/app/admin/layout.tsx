"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import { FullPageSpinner } from "@/components/ui/Spinner";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminSidebarCollapsed") === "true";
    }
    return false;
  });
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("adminSidebarCollapsed", String(next));
      return next;
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden w-full" style={{ backgroundColor: '#f0ebe0', backgroundImage: 'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(10,61,46,0.07) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 85% 85%, rgba(201,168,76,0.06) 0%, transparent 60%)', backgroundAttachment: 'fixed' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={cn(
          "transition-all duration-300 w-full min-w-0 overflow-x-hidden",
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
