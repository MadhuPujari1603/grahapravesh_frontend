"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = "No data available",
  loading = false,
}: DataTableProps<T>) {
  const getItemId = (item: T, index: number) => {
    return item._id || item.id || index.toString();
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.50)", boxShadow: "0 2px 16px 0 rgba(10,61,46,0.06)" }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3.5 text-left text-xs font-semibold text-brand-charcoal uppercase tracking-wider relative",
                    column.sortable && onSort && "cursor-pointer select-none hover:bg-brand-emerald/5 transition-all duration-300 group/header",
                    column.className
                  )}
                  onClick={() => column.sortable && onSort && onSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.label}
                    {column.sortable && (
                      <span className={cn(
                        "transition-all duration-300",
                        sortKey === column.key ? "text-brand-emerald scale-110" : "text-gray-400 group-hover/header:text-brand-emerald-light"
                      )}>
                        {sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={getItemId(item, index)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    "hover:bg-gradient-to-r hover:from-brand-emerald/5 hover:via-transparent hover:to-transparent transition-all duration-300 group/row border-l-2 border-transparent hover:border-brand-emerald",
                    onRowClick && "cursor-pointer"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-4 text-sm text-brand-charcoal-medium group-hover/row:text-brand-charcoal transition-colors duration-300", column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm text-brand-charcoal-light">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
