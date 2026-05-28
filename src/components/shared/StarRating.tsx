"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeStyles = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
  // Round to nearest 0.5 for non-interactive display
  const roundedRating = interactive
    ? displayRating
    : Math.round(displayRating * 2) / 2;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={() => interactive && setHoverRating(0)}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = roundedRating >= starIndex;
        const isHalf = !isFilled && roundedRating >= starIndex - 0.5;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            className={cn(
              "relative shrink-0",
              interactive
                ? "cursor-pointer transition-transform hover:scale-110"
                : "cursor-default"
            )}
          >
            {/* Background (empty) star */}
            <Star className={cn(sizeStyles[size], "text-gray-300")} />

            {/* Filled or half-filled overlay */}
            {(isFilled || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? "50%" : "100%" }}
              >
                <Star
                  className={cn(
                    sizeStyles[size],
                    "fill-brand-gold text-brand-gold"
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
