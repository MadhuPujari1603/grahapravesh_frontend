"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}

export default function PriceRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
  step = 100,
}: PriceRangeSliderProps) {
  const [minValue, setMinValue] = useState(currentMin || min);
  const [maxValue, setMaxValue] = useState(currentMax || max);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinValue(currentMin || min);
    setMaxValue(currentMax || max);
  }, [currentMin, currentMax, min, max]);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (type: "min" | "max") => {
    setIsDragging(type);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onChange(minValue, maxValue);
      setIsDragging(null);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    let value = Math.round((percentage / 100) * (max - min) + min);
    value = Math.round(value / step) * step;

    if (isDragging === "min") {
      const newMin = Math.min(value, maxValue - step);
      setMinValue(Math.max(min, newMin));
    } else {
      const newMax = Math.max(value, minValue + step);
      setMaxValue(Math.min(max, newMax));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    let value = Math.round((percentage / 100) * (max - min) + min);
    value = Math.round(value / step) * step;

    if (isDragging === "min") {
      const newMin = Math.min(value, maxValue - step);
      setMinValue(Math.max(min, newMin));
    } else {
      const newMax = Math.max(value, minValue + step);
      setMaxValue(Math.min(max, newMax));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, minValue, maxValue]);

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <div className="text-2xs text-brand-charcoal-light mb-1">Min Price</div>
          <div className="text-sm font-semibold text-brand-emerald">
            {formatPrice(minValue)}
          </div>
        </div>
        <div className="px-2 text-brand-charcoal-light">—</div>
        <div className="flex-1 text-center">
          <div className="text-2xs text-brand-charcoal-light mb-1">Max Price</div>
          <div className="text-sm font-semibold text-brand-emerald">
            {formatPrice(maxValue)}
          </div>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative pt-2 pb-6" ref={sliderRef}>
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-gray-200 rounded-full" />

        {/* Active Range Track */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 bg-gradient-to-r from-brand-emerald to-brand-emerald-light rounded-full shadow-sm"
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />

        {/* Min Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer touch-none select-none group"
          style={{ left: `${minPercentage}%` }}
          onMouseDown={() => handleMouseDown("min")}
          onTouchStart={() => handleMouseDown("min")}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white border-2 border-brand-emerald shadow-md transition-all
              ${isDragging === "min" ? "scale-125 shadow-lg ring-4 ring-brand-emerald/20" : "group-hover:scale-110"}`}
          />
          {/* Tooltip on hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-brand-charcoal text-white text-2xs px-2 py-1 rounded whitespace-nowrap">
              {formatPrice(minValue)}
            </div>
          </div>
        </div>

        {/* Max Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer touch-none select-none group"
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={() => handleMouseDown("max")}
          onTouchStart={() => handleMouseDown("max")}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white border-2 border-brand-emerald shadow-md transition-all
              ${isDragging === "max" ? "scale-125 shadow-lg ring-4 ring-brand-emerald/20" : "group-hover:scale-110"}`}
          />
          {/* Tooltip on hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-brand-charcoal text-white text-2xs px-2 py-1 rounded whitespace-nowrap">
              {formatPrice(maxValue)}
            </div>
          </div>
        </div>

        {/* Step Markers (subtle) */}
        <div className="absolute top-full left-0 right-0 mt-2 flex justify-between text-2xs text-brand-charcoal-light">
          <span>{formatPrice(min)}</span>
          <span className="hidden sm:inline">{formatPrice(Math.round((min + max) / 2))}</span>
          <span>{formatPrice(max)}</span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => {
            setMinValue(0);
            setMaxValue(1000);
            onChange(0, 1000);
          }}
          className="text-xs px-2 py-1.5 rounded-md border border-gray-200 text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-colors"
        >
          Under ₹1K
        </button>
        <button
          onClick={() => {
            setMinValue(1000);
            setMaxValue(2500);
            onChange(1000, 2500);
          }}
          className="text-xs px-2 py-1.5 rounded-md border border-gray-200 text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-colors"
        >
          ₹1K - ₹2.5K
        </button>
        <button
          onClick={() => {
            setMinValue(2500);
            setMaxValue(5000);
            onChange(2500, 5000);
          }}
          className="text-xs px-2 py-1.5 rounded-md border border-gray-200 text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-colors"
        >
          ₹2.5K - ₹5K
        </button>
        <button
          onClick={() => {
            setMinValue(5000);
            setMaxValue(max);
            onChange(5000, max);
          }}
          className="text-xs px-2 py-1.5 rounded-md border border-gray-200 text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-colors"
        >
          Above ₹5K
        </button>
      </div>

      {/* Reset Button */}
      {(minValue !== min || maxValue !== max) && (
        <button
          onClick={() => {
            setMinValue(min);
            setMaxValue(max);
            onChange(min, max);
          }}
          className="w-full text-xs text-brand-charcoal-light hover:text-brand-emerald transition-colors"
        >
          Reset to full range
        </button>
      )}
    </div>
  );
}
