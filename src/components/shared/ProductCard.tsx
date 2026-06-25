"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { Product, Category } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const addToCart = useCart((s) => s.addToCart);
  const { toggle, isWishlisted } = useWishlist();
  const [quickView, setQuickView] = useState(false);

  const wishlisted = isWishlisted(product._id);

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
    <>
      <div
        className="group relative rounded-2xl overflow-hidden flex flex-col bg-white"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* ── Image block ── */}
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "1 / 1" }}>
          <Link href={`/products/${product._id}`} className="block w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              loading={priority ? undefined : "eager"}
            />
          </Link>

          {/* Discount badge — top left */}
          {discount > 0 && (
            <div className="absolute top-2.5 left-2.5">
              <span
                className="text-[11px] font-black px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(10,61,46,0.92)", color: "#c9a84c" }}
              >
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Heart + Magnifier — top right */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              onClick={(e) => { e.preventDefault(); toggle(product); }}
              className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 ${
                wishlisted ? "bg-red-500" : "bg-white"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-white text-white" : "text-gray-400"}`} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setQuickView(true); }}
              className="w-9 h-9 rounded-full bg-white shadow-md hidden sm:flex items-center justify-center transition-transform duration-150 active:scale-90"
              aria-label="Quick view"
            >
              <Search className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* ── Info block ── */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          {categoryName && (
            <span className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.14em] mb-1">
              {categoryName}
            </span>
          )}

          <Link href={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-brand-charcoal line-clamp-2 leading-snug mb-2 hover:text-brand-emerald transition-colors min-h-[2.4rem]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between">
            <div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through block leading-none mb-0.5">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="text-base font-black text-brand-emerald">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Mobile cart button */}
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock === 0}
              className="sm:hidden p-2.5 rounded-xl bg-brand-emerald text-white disabled:opacity-40 active:scale-95 transition-transform duration-150"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {quickView && (
        <QuickViewModal product={product} onClose={() => setQuickView(false)} />
      )}
    </>
  );
}
