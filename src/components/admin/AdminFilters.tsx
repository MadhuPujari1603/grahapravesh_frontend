"use client";

import React from "react";
import { Search, SlidersHorizontal, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface AdminFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: FilterOption[];
  
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
  
  onExport?: () => void;
  
  activeFilterCount?: number;
  onClearFilters?: () => void;
  
  extraFilters?: React.ReactNode;
}

export default function AdminFilters({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  
  sortValue = "",
  onSortChange,
  sortOptions = [],
  
  statusValue = "",
  onStatusChange,
  statusOptions = [],
  
  dateRange,
  onDateRangeChange,
  
  onExport,
  
  activeFilterCount = 0,
  onClearFilters,
  
  extraFilters,
}: AdminFiltersProps) {
  return (
    <div className="rounded-xl border p-4 mb-6 space-y-4" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.50)", boxShadow: "0 2px 16px 0 rgba(10,61,46,0.06)" }}>
      {/* Top Row: Search + Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        {onSearchChange && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-light" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
            />
          </div>
        )}

        {/* Sort Dropdown */}
        {sortOptions.length > 0 && onSortChange && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white w-full sm:w-auto"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Export Button */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-brand-charcoal-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>

      {/* Second Row: Status + Date Range + Extra Filters */}
      {(statusOptions.length > 0 || dateRange !== undefined || extraFilters) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center pt-3 border-t border-gray-100">
          {/* Status Filter */}
          {statusOptions.length > 0 && onStatusChange && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-brand-charcoal-light shrink-0" />
              <select
                value={statusValue}
                onChange={(e) => onStatusChange(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white"
              >
                <option value="">All Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filter */}
          {dateRange !== undefined && onDateRangeChange && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-brand-charcoal-light whitespace-nowrap">Date:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, from: e.target.value })
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald"
              />
              <span className="text-xs text-brand-charcoal-light">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, to: e.target.value })
                }
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald"
              />
            </div>
          )}

          {/* Extra Filters Slot */}
          {extraFilters}

          {/* Clear Filters */}
          {activeFilterCount > 0 && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
