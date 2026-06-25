"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Product, Category } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import useCart from "@/hooks/useCart";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addToCart = useCart((s) => s.addToCart);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.images?.length ? product.images : ["/images/placeholder-product.svg"];
  const categoryName = typeof product.categoryId === "object" ? (product.categoryId as Category).name : "";
  const discount = product.compareAtPrice ? getDiscountPercentage(product.price, product.compareAtPrice) : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return createPortal(
    /* Full viewport overlay — same as Zwende */
    <div className="fixed inset-0 z-[9999] overflow-y-auto" onClick={onClose}>
      {/* Semi-transparent bg */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered white card — wide, with generous padding around it */}
      <div className="relative min-h-full flex items-center justify-center p-6 lg:p-10">
        <div
          className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── X button — top right, large black circle exactly like Zwende ── */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── Three-column layout: thumbnails | main image | details ── */}
          <div className="flex h-full" style={{ minHeight: 520 }}>

            {/* Column 1 — Thumbnail strip (exactly like Zwende, left side) */}
            <div className="hidden md:flex flex-col gap-2 p-4 w-28 shrink-0 overflow-y-auto border-r border-gray-100">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    i === imgIdx
                      ? "border-brand-emerald shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Column 2 — Large main image */}
            <div className="relative bg-gray-50 flex-1 md:flex-none md:w-[45%] shrink-0">
              <div className="relative w-full h-full" style={{ minHeight: 400 }}>
                <Image
                  src={images[imgIdx]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 500px"
                  className="object-contain p-6"
                  priority
                />
              </div>

              {/* Discount badge */}
              {discount > 0 && (
                <span
                  className="absolute top-4 left-4 text-xs font-black px-3 py-1 rounded-lg"
                  style={{ background: "rgba(10,61,46,0.92)", color: "#c9a84c" }}
                >
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Column 3 — Product details (right side, scrollable) */}
            <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto">

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 leading-snug mb-1 pr-10">
                {product.name}
              </h2>

              {/* Category as subtle link/tag */}
              {categoryName && (
                <span className="text-sm text-brand-gold-dark font-medium mb-3 block">
                  {categoryName}
                </span>
              )}

              {/* Star rating */}
              {product.ratings && product.ratings > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(product.ratings!) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  {product.numReviews && (
                    <span className="text-sm text-gray-500">{product.numReviews} Reviews</span>
                  )}
                </div>
              )}

              {/* Key features list */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {product.keyFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-base leading-tight">{f.icon || "✦"}</span>
                      <span>{f.title}{f.description ? ` — ${f.description}` : ""}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Description if no key features */}
              {(!product.keyFeatures || product.keyFeatures.length === 0) && product.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-4">
                  {product.description}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Price</p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through block">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-2xl font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="space-y-2.5 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? "Added to Cart ✓" : "Add to cart"}
                </button>

                {/* Chat with Expert — WhatsApp */}
                <a
                  href={`https://wa.me/918762625888?text=${encodeURIComponent(
                    `Hi! I'm interested in this product:\n\n*${product.name}*\nhttps://www.grahapraveshnameplate.com/products/${product._id}\n\nPlease help me with customization details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L.057 23.999l6.305-1.54A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.371l-.359-.213-3.722.975.993-3.63-.234-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                  </svg>
                  Chat with a Style Expert
                </a>

                <Link
                  href={`/products/${product._id}`}
                  onClick={onClose}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg flex items-center justify-center gap-2 hover:border-gray-900 hover:text-gray-900 transition-colors"
                >
                  View Full Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
}
