"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-xl animate-slide-up border",
          sizeStyles[size],
          className
        )}
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.60)",
          boxShadow: "0 25px 60px -12px rgba(10,61,46,0.20), 0 1px 0 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.40)" }}>
            <h3 className="text-lg font-semibold text-brand-charcoal">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-brand-charcoal-light hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-brand-charcoal-light hover:text-brand-charcoal hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.40)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
