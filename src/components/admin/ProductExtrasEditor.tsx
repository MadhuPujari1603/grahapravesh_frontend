"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { KeyFeature, Specification } from "@/types";

/* ──────────────────────────────────────────────────────────
   Preset icon library the admin can pick from
────────────────────────────────────────────────────────── */
const PRESET_ICONS = [
  { emoji: "🌿", label: "Natural" },
  { emoji: "🏅", label: "Premium" },
  { emoji: "♻️", label: "Eco" },
  { emoji: "✅", label: "Certified" },
  { emoji: "🔒", label: "Secure" },
  { emoji: "⚡", label: "Fast" },
  { emoji: "🌱", label: "Organic" },
  { emoji: "💎", label: "Luxury" },
  { emoji: "🛡️", label: "Protected" },
  { emoji: "🎯", label: "Precise" },
  { emoji: "🔬", label: "Tested" },
  { emoji: "🌸", label: "Floral" },
  { emoji: "🍃", label: "Herbal" },
  { emoji: "💧", label: "Hydrating" },
  { emoji: "☀️", label: "Sun Care" },
  { emoji: "🧪", label: "Formula" },
  { emoji: "🤝", label: "Trusted" },
  { emoji: "🎁", label: "Gift" },
  { emoji: "🏠", label: "Home" },
  { emoji: "🔑", label: "Key" },
];

/* ──────────────────────────────────────────────────────────
   KEY FEATURES EDITOR
────────────────────────────────────────────────────────── */
interface KeyFeaturesEditorProps {
  value: KeyFeature[];
  onChange: (features: KeyFeature[]) => void;
}

export function KeyFeaturesEditor({ value, onChange }: KeyFeaturesEditorProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState<number | null>(null);

  const addFeature = () => {
    onChange([
      ...value,
      { icon: "🌿", title: "", description: "" },
    ]);
  };

  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: keyof KeyFeature, val: string) => {
    onChange(value.map((f, i) => (i === index ? { ...f, [field]: val } : f)));
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-brand-charcoal-light mb-3">
            No key features added yet. Add features to highlight what makes your product special.
          </p>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-emerald border border-brand-emerald rounded-lg hover:bg-brand-emerald hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            Add First Feature
          </button>
        </div>
      )}

      {value.map((feature, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Feature {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium text-brand-charcoal mb-1.5">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIconPickerOpen(iconPickerOpen === index ? null : index)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:border-brand-emerald transition-colors text-sm w-full"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="flex-1 text-left text-brand-charcoal-medium">Select icon</span>
                {iconPickerOpen === index ? (
                  <ChevronUp className="w-4 h-4 text-brand-charcoal-light" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-charcoal-light" />
                )}
              </button>

              {iconPickerOpen === index && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-full">
                  <p className="text-xs font-medium text-brand-charcoal-light mb-2 uppercase tracking-wider">
                    Choose an icon
                  </p>
                  <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto">
                    {PRESET_ICONS.map((preset) => (
                      <button
                        key={preset.emoji}
                        type="button"
                        onClick={() => {
                          updateFeature(index, "icon", preset.emoji);
                          setIconPickerOpen(null);
                        }}
                        title={preset.label}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-center hover:bg-brand-emerald/10 transition-colors ${
                          feature.icon === preset.emoji
                            ? "bg-brand-emerald/15 ring-1 ring-brand-emerald"
                            : ""
                        }`}
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-[10px] text-brand-charcoal-light leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* Custom emoji input */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-brand-charcoal-light mb-1.5">
                      Or type a custom emoji:
                    </p>
                    <input
                      type="text"
                      value={feature.icon || ""}
                      onChange={(e) => updateFeature(index, "icon", e.target.value)}
                      placeholder="Paste emoji..."
                      className="input-premium text-base"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-brand-charcoal mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={feature.title || ""}
              onChange={(e) => updateFeature(index, "title", e.target.value)}
              placeholder="e.g. Natural Ingredients"
              className="input-premium"
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-brand-charcoal mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={feature.description || ""}
              onChange={(e) => updateFeature(index, "description", e.target.value)}
              placeholder="e.g. Carefully sourced from nature for purity"
              className="input-premium"
              maxLength={120}
            />
          </div>
        </div>
      ))}

      {value.length > 0 && value.length < 6 && (
        <button
          type="button"
          onClick={addFeature}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </button>
      )}

      {value.length >= 6 && (
        <p className="text-xs text-brand-charcoal-light text-center">
          Maximum 6 features allowed.
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPECIFICATIONS EDITOR
────────────────────────────────────────────────────────── */
interface SpecificationsEditorProps {
  value: Specification[];
  onChange: (specs: Specification[]) => void;
}

const PRESET_SPEC_LABELS = [
  "Material", "Weight", "Dimensions", "Color", "Size",
  "Capacity", "Warranty", "Country of Origin", "Brand",
  "Net Weight", "Shelf Life", "Usage", "Skin Type",
  "Hair Type", "Fragrance", "SPF", "Volume", "Quantity",
];

export function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  const addSpec = () => {
    onChange([...value, { label: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: keyof Specification, val: string) => {
    onChange(value.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  };

  const addPreset = (label: string) => {
    if (!value.find((s) => s.label === label)) {
      onChange([...value, { label, value: "" }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset label chips */}
      <div>
        <p className="text-xs font-medium text-brand-charcoal-light mb-2 uppercase tracking-wider">
          Quick add common specs:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_SPEC_LABELS.map((label) => {
            const already = value.some((s) => s.label === label);
            return (
              <button
                key={label}
                type="button"
                disabled={already}
                onClick={() => addPreset(label)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                  already
                    ? "border-brand-emerald/40 bg-brand-emerald/10 text-brand-emerald cursor-default"
                    : "border-gray-200 bg-white text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald"
                }`}
              >
                {already ? "✓ " : "+ "}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specs table */}
      {value.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_auto] bg-gray-50 border-b border-gray-200 px-4 py-2.5">
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Specification
            </span>
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Value
            </span>
            <span className="w-8" />
          </div>

          {/* Rows */}
          {value.map((spec, index) => (
            <div
              key={index}
              className={`grid grid-cols-[1fr_1fr_auto] gap-2 px-4 py-2.5 items-center ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } ${index !== value.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <input
                type="text"
                value={spec.label || ""}
                onChange={(e) => updateSpec(index, "label", e.target.value)}
                placeholder="e.g. Weight"
                className="input-premium py-1.5 text-sm"
                list={`spec-labels-${index}`}
                maxLength={50}
              />
              <datalist id={`spec-labels-${index}`}>
                {PRESET_SPEC_LABELS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>

              <input
                type="text"
                value={spec.value || ""}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
                placeholder="e.g. 250g"
                className="input-premium py-1.5 text-sm"
                maxLength={100}
              />

              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-brand-charcoal-light mb-3">
            No specifications added. Use the chips above or add a custom one.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={addSpec}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Custom Specification
      </button>
    </div>
  );
}
