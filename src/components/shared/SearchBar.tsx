"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
  className,
  defaultValue = "",
  debounceMs = 400,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-light" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-premium pl-10 pr-9"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal-light hover:text-brand-charcoal transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
