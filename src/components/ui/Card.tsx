"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  className,
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        // Glassmorphism base
        "rounded-xl border",
        "backdrop-blur-[12px]",
        paddingStyles[padding],
        hover
          ? "hover:shadow-lg transition-all duration-200 cursor-default"
          : "",
        className
      )}
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        borderColor: "rgba(255, 255, 255, 0.50)",
        boxShadow: hover
          ? undefined
          : "0 2px 16px 0 rgba(10, 61, 46, 0.06), 0 1px 0 0 rgba(255,255,255,0.8) inset",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
