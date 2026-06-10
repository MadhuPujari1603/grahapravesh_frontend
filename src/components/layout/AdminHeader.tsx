"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Bell,
  LogOut,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  X,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNotifications, AdminNotification } from "@/hooks/useNotifications";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationItem({
  notification,
  onDismiss,
  onNavigate,
}: {
  notification: AdminNotification;
  onDismiss: (id: string) => void;
  onNavigate: () => void;
}) {
  const Icon = notification.type === "order" ? ShoppingBag : MessageSquare;
  const iconBg =
    notification.type === "order"
      ? "bg-brand-emerald/10 text-brand-emerald"
      : "bg-blue-50 text-blue-600";

  return (
    <div className="group relative flex items-start gap-3 px-4 py-3 hover:bg-white/50 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-4 h-4" />
      </div>

      <Link
        href={notification.href}
        onClick={onNavigate}
        className="flex-1 min-w-0"
      >
        <p className="text-sm font-semibold text-brand-charcoal leading-snug">
          {notification.title}
        </p>
        <p className="text-xs text-brand-charcoal-light mt-0.5 leading-relaxed line-clamp-2">
          {notification.description}
        </p>
        <p className="text-[10px] text-brand-charcoal-light/70 mt-1 font-medium">
          {timeAgo(notification.createdAt)}
        </p>
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-200 text-brand-charcoal-light hover:text-brand-charcoal shrink-0"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    dismissNotification,
    dismissAll,
  } = useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  const handleNavigate = () => setNotifOpen(false);

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
          {/* ── Notifications Bell ── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-brand-charcoal-medium hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden animate-slide-down z-50"
                style={{
                  background: "rgba(250, 247, 240, 0.95)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.65)",
                  boxShadow:
                    "0 8px 32px 0 rgba(10,61,46,0.14), 0 1px 0 rgba(255,255,255,0.9) inset",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.45)" }}
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-charcoal">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <p className="text-xs text-brand-charcoal-light">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={refresh}
                      disabled={isLoading}
                      className="p-1.5 rounded-lg text-brand-charcoal-light hover:text-brand-emerald hover:bg-white/60 transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                      />
                    </button>
                    {notifications.length > 0 && (
                      <button
                        onClick={dismissAll}
                        className="p-1.5 rounded-lg text-brand-charcoal-light hover:text-brand-emerald hover:bg-white/60 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-white/40">
                  {isLoading && notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-brand-charcoal-light mx-auto mb-2" />
                      <p className="text-xs text-brand-charcoal-light">Loading…</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-brand-charcoal">
                        All caught up!
                      </p>
                      <p className="text-xs text-brand-charcoal-light mt-1">
                        No pending orders or unread messages.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onDismiss={dismissNotification}
                        onNavigate={handleNavigate}
                      />
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div
                    className="border-t grid grid-cols-2"
                    style={{ borderColor: "rgba(255,255,255,0.45)" }}
                  >
                    <Link
                      href="/admin/orders?status=pending"
                      onClick={handleNavigate}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-brand-charcoal-medium hover:text-brand-emerald hover:bg-white/50 transition-colors border-r"
                      style={{ borderColor: "rgba(255,255,255,0.45)" }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Pending Orders
                    </Link>
                    <Link
                      href="/admin/messages"
                      onClick={handleNavigate}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-brand-charcoal-medium hover:text-brand-emerald hover:bg-white/50 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Messages
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

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
