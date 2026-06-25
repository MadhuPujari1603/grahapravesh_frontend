"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Category } from "@/types";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const addToCart = useCart((s) => s.addToCart);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-charcoal">My Wishlist</h1>
            <p className="text-sm text-brand-charcoal-light mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <Link
              href="/products"
              className="text-sm font-semibold text-brand-emerald hover:underline flex items-center gap-1"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <Heart className="w-9 h-9 text-red-300" />
            </div>
            <h2 className="text-lg font-bold text-brand-charcoal mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-brand-charcoal-light mb-6 max-w-xs">
              Save your favourite products here and come back to them anytime.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 bg-brand-emerald text-white font-semibold text-sm rounded-xl hover:bg-brand-emerald-dark transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => {
              const discount = product.compareAtPrice
                ? getDiscountPercentage(product.price, product.compareAtPrice)
                : 0;
              const imageUrl = product.images?.[0] || "/images/placeholder-product.svg";
              const categoryName =
                typeof product.categoryId === "object"
                  ? (product.categoryId as Category).name
                  : "";

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden flex flex-col"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
                    <Link href={`/products/${product._id}`} className="block w-full h-full">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {discount > 0 && (
                      <span
                        className="absolute top-2 left-2 text-[11px] font-black px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(10,61,46,0.92)", color: "#c9a84c" }}
                      >
                        {discount}% OFF
                      </span>
                    )}

                    {/* Remove from wishlist */}
                    <button
                      onClick={() => remove(product._id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-3 sm:p-4">
                    {categoryName && (
                      <span className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-widest mb-1">
                        {categoryName}
                      </span>
                    )}
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-sm font-semibold text-brand-charcoal line-clamp-2 mb-2 hover:text-brand-emerald transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-2 border-t border-gray-100">
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through block">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-base font-black text-brand-emerald">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={product.stock === 0}
                        className="mt-2.5 w-full py-2.5 bg-brand-emerald text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-emerald-dark transition-colors disabled:opacity-40"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
