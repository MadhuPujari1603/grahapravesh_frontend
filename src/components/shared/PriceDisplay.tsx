"use client";

import React from "react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { price: "text-sm", compare: "text-xs", badge: "text-xs px-1.5 py-0.5" },
  md: { price: "text-lg", compare: "text-sm", badge: "text-xs px-2 py-0.5" },
  lg: { price: "text-2xl", compare: "text-base", badge: "text-sm px-2.5 py-1" },
};

export default function PriceDisplay({
  price,
  comparePrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const discount = comparePrice
    ? getDiscountPercentage(price, comparePrice)
    : 0;
  const styles = sizeStyles[size];

  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      <span
        className={cn("font-bold text-brand-emerald", styles.price)}
      >
        {formatPrice(price)}
      </span>
      {comparePrice && comparePrice > price && (
        <>
          <span
            className={cn(
              "text-brand-charcoal-light line-through",
              styles.compare
            )}
          >
            {formatPrice(comparePrice)}
          </span>
          <span
            className={cn(
              "bg-red-100 text-red-700 font-semibold rounded-full",
              styles.badge
            )}
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
