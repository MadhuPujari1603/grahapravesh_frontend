"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "text-white hover:opacity-90 active:opacity-80 backdrop-blur-sm",
  secondary:
    "border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white backdrop-blur-sm",
  ghost:
    "text-brand-charcoal-medium hover:bg-white/50 hover:text-brand-charcoal backdrop-blur-sm",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const variantInlineStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "rgba(10, 61, 46, 0.92)",
    boxShadow: "0 2px 12px 0 rgba(10,61,46,0.30), 0 1px 0 rgba(255,255,255,0.08) inset",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  secondary: {},
  ghost: {},
  danger: {},
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      style={variantInlineStyles[variant]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!isLoading && icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
}
