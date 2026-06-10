"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";

export interface AdminNotification {
  id: string;
  type: "order" | "message";
  title: string;
  description: string;
  href: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: AdminNotification[];
  totalUnread: number;
  pendingOrdersCount: number;
  unreadMessagesCount: number;
  isLoading: boolean;
  error: string | null;
}

const POLL_INTERVAL_MS = 30_000; // refresh every 30 seconds

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    totalUnread: 0,
    pendingOrdersCount: 0,
    unreadMessagesCount: 0,
    isLoading: false,
    error: null,
  });

  // Track which notification IDs have been locally dismissed
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = sessionStorage.getItem("admin-dismissed-notifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchNotifications = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN_NOTIFICATIONS);
      const data = res.data.data;
      setState((prev) => ({
        ...prev,
        notifications: data.notifications ?? [],
        totalUnread: data.totalUnread ?? 0,
        pendingOrdersCount: data.pendingOrdersCount ?? 0,
        unreadMessagesCount: data.unreadMessagesCount ?? 0,
        isLoading: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.response?.data?.message || "Failed to load notifications",
      }));
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const dismissNotification = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem(
          "admin-dismissed-notifications",
          JSON.stringify(Array.from(next))
        );
      } catch {/* ignore */}
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed((prev) => {
      const next = new Set(prev);
      state.notifications.forEach((n) => next.add(n.id));
      try {
        sessionStorage.setItem(
          "admin-dismissed-notifications",
          JSON.stringify(Array.from(next))
        );
      } catch {/* ignore */}
      return next;
    });
  }, [state.notifications]);

  // Visible = not yet dismissed
  const visible = state.notifications.filter((n) => !dismissed.has(n.id));
  const unreadCount = visible.length;

  return {
    notifications: visible,
    unreadCount,
    pendingOrdersCount: state.pendingOrdersCount,
    unreadMessagesCount: state.unreadMessagesCount,
    isLoading: state.isLoading,
    error: state.error,
    refresh: fetchNotifications,
    dismissNotification,
    dismissAll,
  };
}
