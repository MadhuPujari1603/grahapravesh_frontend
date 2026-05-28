"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.imageUrl || "/images/placeholder-category.svg";

  return (
    <Link
      href={`/products?category=${category._id}`}
      className="group block relative rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg border"
      style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.50)", boxShadow: "0 2px 16px 0 rgba(10,61,46,0.07), 0 1px 0 0 rgba(255,255,255,0.8) inset" }}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-900 to-brand-charcoal">
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-emerald-deeper/90 via-brand-emerald-dark/70 to-brand-charcoal/60 group-hover:from-brand-emerald-deeper/80 group-hover:via-brand-emerald-dark/60 group-hover:to-transparent transition-all duration-500" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 via-brand-gold/0 to-brand-gold/0 group-hover:from-brand-gold/10 group-hover:via-transparent group-hover:to-brand-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center px-6 z-10">
          <div className="transform group-hover:translate-x-1 transition-transform duration-500">
            <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-brand-gold-light transition-colors duration-300 drop-shadow-lg">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-white/80 line-clamp-1 max-w-[200px] mb-3 group-hover:text-white transition-colors duration-300">
                {category.description}
              </p>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-gold-light uppercase tracking-wider group-hover:gap-3 group-hover:text-brand-gold transition-all duration-300 drop-shadow-md">
              Explore Collection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-gold via-brand-gold-light to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 shadow-lg shadow-brand-gold/50" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}
