"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
}

const sizeMap = {
  sm: { track: "w-9 h-5",   knob: "w-4 h-4",   translate: "translate-x-4", shadow: "shadow" },
  md: { track: "w-12 h-6",  knob: "w-5 h-5",   translate: "translate-x-6", shadow: "shadow-md" },
  lg: { track: "w-14 h-7",  knob: "w-6 h-6",   translate: "translate-x-7", shadow: "shadow-md" },
};

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
}: ToggleProps) {
  const s = sizeMap[size];

  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} select-none`}>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-semibold text-brand-charcoal">{label}</span>}
          {description && <span className="text-xs text-brand-charcoal-light">{description}</span>}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-1 ${s.track}`}
        style={{
          background: checked
            ? "linear-gradient(135deg, #0e8a5f 0%, #0a3d2e 100%)"
            : "#d1d5db",
          boxShadow: checked
            ? "0 0 0 1px rgba(10,61,46,0.2), inset 0 1px 2px rgba(0,0,0,0.15)"
            : "inset 0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {/* Knob */}
        <span
          className={`absolute top-0.5 left-0.5 bg-white rounded-full transition-transform duration-300 ease-in-out ${s.knob} ${s.shadow} ${checked ? s.translate : "translate-x-0"}`}
          style={{
            boxShadow: "0 1px 4px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.04)",
          }}
        />
      </button>
    </label>
  );
}
