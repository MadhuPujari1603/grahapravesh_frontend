"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "gold";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  gold: "bg-amber-100 text-amber-800",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeProps["variant"]> = {
    pending: "warning",
    confirmed: "info",
    processing: "purple",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
  };

  const labelMap: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <Badge variant={variantMap[status] || "default"} size="md">
      {labelMap[status] || status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeProps["variant"]> = {
    pending: "warning",
    completed: "success",
    failed: "danger",
    refunded: "default",
  };

  const labelMap: Record<string, string> = {
    pending: "Pending",
    completed: "Paid",
    failed: "Failed",
    refunded: "Refunded",
  };

  return (
    <Badge variant={variantMap[status] || "default"} size="md">
      {labelMap[status] || status}
    </Badge>
  );
}
