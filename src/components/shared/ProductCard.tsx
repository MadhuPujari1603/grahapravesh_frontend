"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product, Category } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import useCart from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCart((s) => s.addToCart);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const categoryName =
    typeof product.categoryId === "object"
      ? (product.categoryId as Category).name
      : "";

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/placeholder-product.svg";

  return (
    <div className="group relative rounded-xl overflow-hidden flex flex-col border transition-all duration-200 hover:shadow-lg" style={{ background: "rgba(255,255,255,0.68)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.52)", boxShadow: "0 2px 16px 0 rgba(10,61,46,0.07), 0 1px 0 0 rgba(255,255,255,0.85) inset" }}>
      {/* Premium gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-emerald/0 via-brand-gold/0 to-brand-emerald/0 group-hover:from-brand-emerald/10 group-hover:via-brand-gold/5 group-hover:to-brand-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image Section */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="relative h-44 sm:h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/5 group-hover:via-black/0 group-hover:to-black/0 transition-all duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 animate-fadeIn">
            {discount > 0 && (
              <span className="text-brand-emerald-dark text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300" style={{ background: 'rgba(10,61,46,0.85)', color: '#c9a84c' }}>
                {discount}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm border border-brand-gold-light/30 transform group-hover:scale-105 transition-transform duration-300 animate-shimmer">
                ✦ FEATURED
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick Actions - appear on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                isWishlisted
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/30"
                  : "bg-white/95 text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-current scale-110" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/products/${product._id}`;
              }}
              className="w-10 h-10 rounded-full bg-white/95 text-gray-600 flex items-center justify-center shadow-lg backdrop-blur-sm hover:bg-gradient-to-br hover:from-brand-emerald hover:to-brand-emerald-dark hover:text-white hover:shadow-brand-emerald/30 transition-all duration-300 transform hover:scale-110"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart bar - slides up on hover */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product, 1);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-brand-emerald-dark via-brand-emerald to-brand-emerald-dark backdrop-blur-sm text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-brand-emerald hover:via-brand-emerald-dark hover:to-brand-emerald transition-all duration-300 shadow-lg shadow-brand-emerald/30 border-t-2 border-brand-emerald-light/20"
              >
                <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-5 relative z-10">
        {categoryName && (
          <span className="text-[11px] font-semibold text-brand-gold-dark uppercase tracking-[0.15em] mb-2 group-hover:text-brand-gold transition-colors duration-300">
            {categoryName}
          </span>
        )}

        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-semibold text-brand-charcoal line-clamp-2 hover:text-brand-emerald transition-colors leading-snug mb-3 group-hover:text-brand-emerald-dark min-h-[2.6rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-100 group-hover:border-brand-emerald/20 transition-colors duration-300">
          <div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-brand-charcoal-light line-through block mb-0.5">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-base font-bold bg-gradient-to-r from-brand-emerald to-brand-emerald-dark bg-clip-text text-transparent group-hover:from-brand-emerald-dark group-hover:to-brand-emerald transition-all duration-500">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Mobile cart button (hidden on hover-capable devices) */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="sm:hidden p-2.5 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-emerald-dark text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-emerald/20 transform active:scale-95 transition-transform duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
