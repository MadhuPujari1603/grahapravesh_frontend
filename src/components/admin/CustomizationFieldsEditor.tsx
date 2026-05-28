"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { CustomizationField } from "@/types";

interface CustomizationFieldsEditorProps {
  value: CustomizationField[];
  onChange: (fields: CustomizationField[]) => void;
}

function toFieldName(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function CustomizationFieldsEditor({
  value,
  onChange,
}: CustomizationFieldsEditorProps) {
  const addField = () => {
    onChange([
      ...value,
      { fieldName: "", label: "", placeholder: "", maxLength: 30, required: true },
    ]);
  };

  const removeField = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateField = (
    index: number,
    field: keyof CustomizationField,
    val: string | number | boolean
  ) => {
    const updated = value.map((f, i) => {
      if (i !== index) return f;
      const next = { ...f, [field]: val };
      // Auto-generate fieldName from label unless user has manually edited it
      if (field === "label" && typeof val === "string") {
        const currentAuto = toFieldName(f.label);
        if (f.fieldName === "" || f.fieldName === currentAuto) {
          next.fieldName = toFieldName(val);
        }
      }
      return next;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-brand-charcoal-light mb-3">
            No customization fields yet. Add fields to let customers personalize this product.
          </p>
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-emerald border border-brand-emerald rounded-lg hover:bg-brand-emerald hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            Add First Field
          </button>
        </div>
      )}

      {value.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_80px_72px_40px] bg-gray-50 border-b border-gray-200 px-4 py-2.5 gap-2">
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Label <span className="text-red-400">*</span>
            </span>
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Placeholder
            </span>
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Field ID
            </span>
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider">
              Max Chars
            </span>
            <span className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider text-center">
              Required
            </span>
            <span className="w-8" />
          </div>

          {value.map((field, index) => (
            <div
              key={index}
              className={`grid grid-cols-[1fr_1fr_1fr_80px_72px_40px] gap-2 px-4 py-2.5 items-center ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
              } ${index !== value.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {/* Label */}
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, "label", e.target.value)}
                placeholder="e.g. Family Name"
                className="input-premium py-1.5 text-sm"
                maxLength={50}
              />

              {/* Placeholder */}
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => updateField(index, "placeholder", e.target.value)}
                placeholder="e.g. Sharma"
                className="input-premium py-1.5 text-sm"
                maxLength={80}
              />

              {/* Field Name (auto + editable) */}
              <input
                type="text"
                value={field.fieldName}
                onChange={(e) =>
                  updateField(
                    index,
                    "fieldName",
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")
                  )
                }
                placeholder="auto_generated"
                className="input-premium py-1.5 text-sm font-mono text-xs text-brand-charcoal-medium"
                maxLength={40}
              />

              {/* Max Length */}
              <input
                type="number"
                value={field.maxLength ?? 30}
                onChange={(e) =>
                  updateField(index, "maxLength", Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))
                }
                min={1}
                max={200}
                className="input-premium py-1.5 text-sm text-center"
              />

              {/* Required toggle */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => updateField(index, "required", !field.required)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${
                    field.required ? "bg-brand-emerald" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      field.required ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeField(index)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <button
          type="button"
          onClick={addField}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-brand-charcoal-medium hover:border-brand-emerald hover:text-brand-emerald transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      )}

      {value.length > 0 && (
        <p className="text-xs text-brand-charcoal-light">
          Field ID is used internally to store the value. It auto-generates from the label but can be edited.
        </p>
      )}
    </div>
  );
}
