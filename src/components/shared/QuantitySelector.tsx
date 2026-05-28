"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "inline-flex items-center border border-gray-200 rounded-lg",
        className
      )}
    >
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={cn(
          "flex items-center justify-center text-brand-charcoal-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-lg",
          isSmall ? "w-8 h-8" : "w-10 h-10"
        )}
      >
        <Minus className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
      </button>
      <span
        className={cn(
          "flex items-center justify-center font-medium text-brand-charcoal border-x border-gray-200 bg-white",
          isSmall ? "w-10 h-8 text-sm" : "w-12 h-10 text-base"
        )}
      >
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={cn(
          "flex items-center justify-center text-brand-charcoal-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-r-lg",
          isSmall ? "w-8 h-8" : "w-10 h-10"
        )}
      >
        <Plus className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </div>
  );
}
