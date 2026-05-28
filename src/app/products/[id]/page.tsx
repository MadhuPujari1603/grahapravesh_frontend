"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  Package,
  MessageSquarePlus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Truck,
  RefreshCw,
  Lock,
  Shield,
  MapPin,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReviewForm from "@/components/shared/ReviewForm";
import StarRating from "@/components/shared/StarRating";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import { Category, Product, Review, User } from "@/types";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatPrice, getDiscountPercentage, getInitials, formatDate } from "@/lib/utils";

/* ──────────────────────────��──────────────────
   Minimal Related Product Card (editorial style)
───────────────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const category =
    typeof product.categoryId === "object"
      ? (product.categoryId as Category).name
      : "";
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/placeholder-product.svg";

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="overflow-hidden mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      {category && (
        <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">
          {category}
        </p>
      )}
      <p className="text-sm font-bold text-brand-charcoal uppercase tracking-wider group-hover:text-brand-emerald transition-colors leading-snug mb-2">
        {product.name}
      </p>
      <p className="text-base font-bold text-brand-charcoal">
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Review Card
───────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const user =
    typeof review.userId === "object"
      ? (review.userId as User)
      : { name: "Anonymous" };
  const userName = user.name || "Anonymous";
  const initials = getInitials(userName);
  return (
    <div className="border-b border-[#e8e0d0] pb-6 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-emerald text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-brand-charcoal leading-none">
              {userName}
            </p>
            <p className="text-[11px] text-brand-charcoal-light mt-0.5">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        {review.isVerifiedPurchase && (
          <span className="inline-flex items-center gap-1 text-[11px] text-brand-emerald font-bold bg-brand-emerald/8 px-2.5 py-1 rounded-full shrink-0">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
      <StarRating rating={review.rating} size="sm" />
      {review.title && (
        <p className="text-sm font-bold text-brand-charcoal mt-2">
          {review.title}
        </p>
      )}
      <p className="text-sm text-brand-charcoal-medium leading-relaxed mt-1">
        {review.comment}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Rating Bar
───────────────────────────────────────────── */
function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-brand-charcoal-light w-3 shrink-0">
        {star}
      </span>
      <div className="flex-1 h-1 bg-[#e8e0d0] rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-gold rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-brand-charcoal-light w-4 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { product, isLoading, fetchProduct } = useProducts();
  const addToCart = useCart((s) => s.addToCart);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [customizationErrors, setCustomizationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<Record<number, number>>({});


  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  useEffect(() => {
    if (product && typeof product.categoryId === "object") {
      api
        .get(
          `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY(
            (product.categoryId as Category)._id
          )}&limit=5`
        )
        .then((res) => {
          const related = (res.data.data || []).filter(
            (p: Product) => p._id !== product._id
          );
          setRelatedProducts(related.slice(0, 4));
        })
        .catch(() => {});
    }
  }, [product]);

  const fetchReviews = useCallback(
    async (page: number = 1) => {
      if (!id) return;
      try {
        setReviewsLoading(true);
        const res = await api.get(
          `${API_ENDPOINTS.REVIEWS_PRODUCT(id)}?page=${page}&limit=6`
        );
        const d = res.data.data || {};
        const reviewList: Review[] = d.reviews || [];
        setReviews(reviewList);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalReviews(res.data.pagination?.total || 0);
        setAverageRating(d.averageRating || 0);
        const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewList.forEach((r) => {
          if (r.rating >= 1 && r.rating <= 5) breakdown[r.rating]++;
        });
        setRatingBreakdown(breakdown);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (id) fetchReviews(currentPage);
  }, [id, currentPage, fetchReviews]);

  const validateCustomization = (): boolean => {
    if (!product?.isCustomizable || !product.customizationFields?.length)
      return true;
    const errors: Record<string, string> = {};
    for (const field of product.customizationFields) {
      if (
        field.required &&
        (!customization[field.fieldName] ||
          customization[field.fieldName].trim() === "")
      ) {
        errors[field.fieldName] = `${field.label} is required`;
      }
    }
    setCustomizationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!validateCustomization()) return;
    addToCart(
      product,
      quantity,
      product.isCustomizable ? customization : undefined
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };



  if (isLoading) return <FullPageSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-cream">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#e8e0d0] flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-brand-charcoal-light" />
            </div>
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">
              Product Not Found
            </h2>
            <p className="text-sm text-brand-charcoal-medium mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-white text-sm font-bold hover:bg-brand-emerald-light transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : ["/images/placeholder-product.svg"];
  const category =
    typeof product.categoryId === "object"
      ? (product.categoryId as Category)
      : null;
  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;
  const DESC_LIMIT = 400;
  const isLongDesc = product.description.length > DESC_LIMIT;
  const displayedDesc =
    isLongDesc && !descExpanded
      ? product.description.slice(0, DESC_LIMIT) + "…"
      : product.description;
  const keyFeatures = product.keyFeatures || [];
  const specifications = product.specifications || [];

  // Split product name into two parts for two-tone display
  const nameParts = product.name.trim().split(" ");
  const nameFirst = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(" ");
  const nameSecond = nameParts.slice(Math.ceil(nameParts.length / 2)).join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Header />

      <main className="flex-1">
        {/* ── Breadcrumb ── */}
        <div className="border-b border-[#e0d8cc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-[11px] text-brand-charcoal-light uppercase tracking-widest flex-wrap">
              <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
              <span className="text-[#c5b99a]">›</span>
              <Link href="/products" className="hover:text-brand-emerald transition-colors">Products</Link>
              {category && (
                <>
                  <span className="text-[#c5b99a]">›</span>
                  <Link href={`/products?category=${category._id}`} className="hover:text-brand-emerald transition-colors">
                    {category.name}
                  </Link>
                </>
              )}
              <span className="text-[#c5b99a]">›</span>
              <span className="text-brand-charcoal font-bold normal-case tracking-normal line-clamp-1 max-w-[160px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

          {/* ══════════════════════════════════════
              HERO — Gallery + Info
          ══════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-16 w-full min-w-0">

            {/* ── LEFT: Gallery ── */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div className="relative overflow-hidden bg-[#e8e0d0] group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-[4/3] sm:aspect-[5/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  {discount > 0 && (
                    <span className="bg-brand-gold text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                      {discount}% Off
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="bg-brand-charcoal text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`absolute top-5 right-5 w-10 h-10 flex items-center justify-center transition-all duration-200 border ${
                    isWishlisted
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-white/80 border-white/60 text-brand-charcoal-medium hover:bg-white hover:text-red-400 backdrop-blur-sm"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all border border-white/40"
                    >
                      <ChevronLeft className="w-4 h-4 text-brand-charcoal" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all border border-white/40"
                    >
                      <ChevronRight className="w-4 h-4 text-brand-charcoal" />
                    </button>
                  </>
                )}

                {/* Floating inset thumbnails — bottom right */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {images.slice(1, 3).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i + 1)}
                        className={`w-[72px] h-[60px] overflow-hidden border-2 transition-all ${
                          selectedImage === i + 1
                            ? "border-brand-gold"
                            : "border-white/70 hover:border-brand-gold/60"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto scrollbar-none">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-[70px] h-[60px] shrink-0 overflow-hidden border-2 transition-all ${
                        i === selectedImage
                          ? "border-brand-emerald"
                          : "border-transparent hover:border-brand-gold/50 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div className="flex flex-col">

              {/* Category */}
              {category && (
                <Link
                  href={`/products?category=${category._id}`}
                  className="text-[11px] font-bold text-brand-gold uppercase tracking-[0.25em] hover:text-brand-gold-dark transition-colors mb-3 block"
                >
                  {category.name}
                </Link>
              )}

              {/* Two-tone product name */}
              <div className="leading-none mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-brand-charcoal uppercase leading-[1.05] tracking-tight break-words">
                  {nameFirst}
                </h1>
                {nameSecond && (
                  <span className="text-2xl sm:text-3xl lg:text-5xl font-black text-brand-gold uppercase leading-[1.05] tracking-tight block break-words">
                    {nameSecond}
                  </span>
                )}
              </div>

              {/* Rating row */}
              {(averageRating > 0 || (product.ratings || 0) > 0) && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={averageRating || product.ratings || 0} size="sm" />
                  <span className="text-xs font-bold text-brand-charcoal">
                    {(averageRating || product.ratings || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-brand-charcoal-light">
                    ({totalReviews || product.numReviews || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price row */}
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <span className="text-2xl font-black text-brand-charcoal tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-base text-brand-charcoal-light line-through font-medium">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span
                  className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 ${
                    product.stock > 0
                      ? "text-brand-emerald bg-brand-emerald/10"
                      : "text-red-500 bg-red-50"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="h-px bg-[#e0d8cc] mb-5" />

              {/* ────────────────────────────────────────
                  PERSONALISE PANEL (dark green box)
              ──────────────────────────────────────── */}
              {product.isCustomizable && product.customizationFields && product.customizationFields.length > 0 ? (
                <div className="bg-brand-emerald rounded-xl overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <span className="text-xs font-black text-brand-gold uppercase tracking-[0.25em]">
                      Personalise
                    </span>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      Step 01 / 0{product.customizationFields.length}
                    </span>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Fields */}
                    {product.customizationFields.map((field) => {
                      const val = customization[field.fieldName] || "";
                      const hasError = !!customizationErrors[field.fieldName];
                      const maxLen = field.maxLength || 30;
                      return (
                        <div key={field.fieldName}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                              {field.label}
                              {field.required && (
                                <span className="text-brand-gold ml-1">*</span>
                              )}
                            </label>
                            <span className={`text-[10px] font-bold tabular-nums ${
                              val.length >= maxLen ? "text-red-400" : "text-white/30"
                            }`}>
                              {val.length}/{maxLen}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const v = e.target.value;
                              setCustomization((prev) => ({ ...prev, [field.fieldName]: v }));
                              if (customizationErrors[field.fieldName]) {
                                setCustomizationErrors((prev) => {
                                  const next = { ...prev };
                                  delete next[field.fieldName];
                                  return next;
                                });
                              }
                            }}
                            placeholder={field.placeholder || field.label}
                            maxLength={maxLen}
                            className={`w-full bg-transparent border-b-2 py-2.5 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition-colors ${
                              hasError
                                ? "border-red-400 focus:border-red-300"
                                : val
                                ? "border-brand-gold focus:border-brand-gold"
                                : "border-white/20 focus:border-white/50"
                            }`}
                          />
                          {hasError && (
                            <p className="mt-1.5 text-[11px] text-red-400 font-semibold flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {customizationErrors[field.fieldName]}
                            </p>
                          )}
                        </div>
                      );
                    })}



                    {/* Progress pills */}
                    {product.customizationFields.length > 1 && (
                      <div className="flex gap-1.5">
                        {product.customizationFields.map((f) => (
                          <div
                            key={f.fieldName}
                            className={`h-0.5 flex-1 transition-all duration-300 ${
                              customization[f.fieldName]?.trim()
                                ? "bg-brand-gold"
                                : "bg-white/15"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* CTAs inside the panel */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={handleAddToCart}
                        className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 ${
                          addedToCart
                            ? "bg-brand-gold/80 text-brand-emerald"
                            : "bg-brand-gold text-brand-emerald hover:bg-brand-gold-light"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {addedToCart ? "Added to Collection ✓" : "Add to Collection"}
                      </button>
                      <button
                        onClick={() => {
                          if (!validateCustomization()) return;
                          addToCart(product, quantity, product.isCustomizable ? customization : undefined);
                          router.push("/checkout");
                        }}
                        className="w-full py-4 text-sm font-black uppercase tracking-widest border-2 border-white/30 text-white hover:border-white hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
                      >
                        Instant Purchase
                      </button>
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          isWishlisted ? "text-red-400" : "text-white/40 hover:text-white/70"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                        {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── No personalisation: standard CTAs ── */
                  <div className="space-y-3 mb-2">
                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-brand-charcoal-light uppercase tracking-widest">Qty</span>
                    <div className="inline-flex items-center border border-[#d0c8b8] bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-brand-charcoal-medium hover:bg-gray-50 disabled:opacity-30 transition-colors border-r border-[#d0c8b8] text-lg font-light"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center font-bold text-brand-charcoal text-sm select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-brand-charcoal-medium hover:bg-gray-50 disabled:opacity-30 transition-colors border-l border-[#d0c8b8] text-lg font-light"
                      >
                        +
                      </button>
                    </div>
                    {product.stock > 0 && (
                      <span className="text-xs text-brand-charcoal-light">{product.stock} available</span>
                    )}
                  </div>

                  {product.stock > 0 ? (
                    <>
                      <button
                        onClick={handleAddToCart}
                        className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] ${
                          addedToCart
                            ? "bg-brand-gold/80 text-brand-emerald"
                            : "bg-brand-gold text-brand-emerald hover:bg-brand-gold-light"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {addedToCart ? "Added to Collection ✓" : "Add to Collection"}
                      </button>
                      <button
                        onClick={() => {
                          addToCart(product, quantity);
                          router.push("/checkout");
                        }}
                        className="w-full py-4 text-sm font-black uppercase tracking-widest border-2 border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all duration-200 active:scale-[0.98]"
                      >
                        Instant Purchase
                      </button>
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          isWishlisted ? "text-red-500" : "text-brand-charcoal-light hover:text-brand-charcoal"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                        {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                      </button>
                    </>
                  ) : (
                    <button disabled className="w-full py-4 text-sm font-black uppercase tracking-widest bg-[#e0d8cc] text-brand-charcoal-light cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}
                </div>
              )}

              {/* Delivery check */}
              <div className="space-y-2 mt-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-brand-charcoal-light" />
                  <span className="text-[10px] font-black text-brand-charcoal-light uppercase tracking-widest">
                    Check Delivery
                  </span>
                </div>
                <div className="flex gap-0">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      setDeliveryMsg("");
                    }}
                    className="flex-1 px-4 py-2.5 text-sm border border-[#d0c8b8] border-r-0 bg-white outline-none focus:border-brand-emerald placeholder:text-gray-400 transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (pincode.length === 6) {
                        setDeliveryMsg(`Estimated delivery by ${getDeliveryDate()}`);
                      } else {
                        setDeliveryMsg("Enter a valid 6-digit pincode.");
                      }
                    }}
                    className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-brand-emerald text-white hover:bg-brand-emerald-light transition-colors"
                  >
                    Check
                  </button>
                </div>
                {deliveryMsg ? (
                  <p className={`text-xs font-semibold ${deliveryMsg.startsWith("Estimated") ? "text-brand-emerald" : "text-red-500"}`}>
                    {deliveryMsg}
                  </p>
                ) : (
                  <p className="text-xs text-brand-charcoal-light">
                    Free delivery by{" "}
                    <span className="font-bold text-brand-charcoal">{getDeliveryDate()}</span>
                    {" · "}Free on orders ₹999+
                  </p>
                )}
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-2 gap-px bg-[#e0d8cc] border border-[#e0d8cc] mt-4">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "Orders over ₹999" },
                  { icon: RefreshCw, label: "Easy Returns", sub: "10-day guarantee" },
                  { icon: Lock, label: "Secure Payment", sub: "SSL encrypted" },
                  { icon: Shield, label: "Quality Assured", sub: "Premium materials" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 bg-brand-cream px-3 py-3">
                    <Icon className="w-4 h-4 text-brand-gold shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-brand-charcoal leading-none">{label}</p>
                      <p className="text-[10px] text-brand-charcoal-light mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════
              TAB SECTION
          ══════════════════════════════════════ */}
          <div className="mt-16 border-t border-[#e0d8cc]">

            {/* Tab nav */}
            <div className="flex items-center gap-0 border-b border-[#e0d8cc] mt-0">
              {(["description", "specs", "reviews"] as const).map((tab) => {
                const labels: Record<string, string> = {
                  description: "Description",
                  specs: "Specifications",
                  reviews: `Reviews${totalReviews > 0 ? ` (${totalReviews})` : ""}`,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 sm:px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px ${
                      activeTab === tab
                        ? "text-brand-emerald border-brand-gold"
                        : "text-brand-charcoal-light border-transparent hover:text-brand-charcoal"
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* ── Description tab ── */}
            {activeTab === "description" && (
              <div className="py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    {/* Italic tagline */}
                    <p className="text-2xl font-bold italic text-brand-charcoal mb-6 leading-snug">
                      Craftsmanship you can feel.
                    </p>
                    <p className="text-sm text-brand-charcoal-medium leading-[2] whitespace-pre-line">
                      {displayedDesc}
                    </p>
                    {isLongDesc && (
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand-emerald hover:text-brand-gold transition-colors"
                      >
                        {descExpanded ? (
                          <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                        ) : (
                          <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Key features */}
                  {keyFeatures.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.25em] mb-6">
                        Key Features
                      </p>
                      <div className="space-y-5">
                        {keyFeatures.map((f, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <span className="text-2xl shrink-0 leading-none mt-0.5">{f.icon}</span>
                            <div>
                              <p className="text-xs font-black text-brand-charcoal uppercase tracking-wider">{f.title}</p>
                              {f.description && (
                                <p className="text-xs text-brand-charcoal-light mt-1 leading-relaxed">{f.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Specs tab ── */}
            {activeTab === "specs" && (
              <div className="py-10">
                <div className="max-w-2xl">
                  <div className="divide-y divide-[#e8e0d0]">
                    {specifications.map((spec, i) => (
                      <div key={i} className="flex items-start gap-8 py-4">
                        <span className="text-xs text-brand-charcoal-light font-bold uppercase tracking-wider w-2/5 shrink-0 pt-0.5">
                          {spec.label}
                        </span>
                        <span className="text-sm text-brand-charcoal font-semibold flex-1">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                    {category && (
                      <div className="flex items-start gap-8 py-4">
                        <span className="text-xs text-brand-charcoal-light font-bold uppercase tracking-wider w-2/5 shrink-0">Category</span>
                        <span className="text-sm text-brand-charcoal font-semibold flex-1">{category.name}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-8 py-4">
                      <span className="text-xs text-brand-charcoal-light font-bold uppercase tracking-wider w-2/5 shrink-0">Availability</span>
                      <span className={`text-sm font-bold flex-1 ${product.stock > 0 ? "text-brand-emerald" : "text-red-500"}`}>
                        {product.stock > 0 ? `In Stock · ${product.stock} units` : "Out of Stock"}
                      </span>
                    </div>
                    {product.isCustomizable && (
                      <div className="flex items-start gap-8 py-4">
                        <span className="text-xs text-brand-charcoal-light font-bold uppercase tracking-wider w-2/5 shrink-0">Personalisation</span>
                        <span className="text-sm font-bold text-brand-gold flex-1">Available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Reviews tab ── */}
            {activeTab === "reviews" && (
              <div className="py-10 space-y-8">

                {/* Rating summary */}
                {totalReviews > 0 && (
                  <div className="flex flex-col sm:flex-row items-start gap-10 pb-8 border-b border-[#e0d8cc]">
                    <div className="text-center shrink-0">
                      <div className="text-6xl font-black text-brand-charcoal tracking-tight leading-none">
                        {averageRating.toFixed(1)}
                      </div>
                      <StarRating rating={averageRating} size="sm" />
                      <p className="text-[11px] text-brand-charcoal-light mt-1.5">
                        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                    <div className="flex-1 w-full space-y-2.5">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar key={star} star={star} count={ratingBreakdown[star] || 0} total={reviews.length} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Header + write button */}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-brand-charcoal-light uppercase tracking-[0.25em]">
                    {totalReviews > 0 ? `All Reviews (${totalReviews})` : "Customer Reviews"}
                  </p>
                  {!showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-emerald text-white text-xs font-black uppercase tracking-widest hover:bg-brand-emerald-light transition-colors"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      Write a Review
                    </button>
                  )}
                </div>

                {/* Review form */}
                {showReviewForm && (
                  <div className="border-2 border-brand-emerald/20 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-sm font-black uppercase tracking-wider text-brand-charcoal">Your Review</p>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="w-8 h-8 bg-[#e8e0d0] hover:bg-[#d8d0c0] flex items-center justify-center text-brand-charcoal-medium transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <ReviewForm
                      productId={product._id}
                      onSuccess={() => {
                        setShowReviewForm(false);
                        setCurrentPage(1);
                        fetchReviews(1);
                      }}
                    />
                  </div>
                )}

                {/* Reviews list */}
                {reviewsLoading ? (
                  <div className="flex justify-center py-16">
                    <Spinner size="lg" />
                  </div>
                ) : reviews.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                  </>
                ) : (
                  <div className="py-14 text-center border border-[#e0d8cc]">
                    <Star className="w-8 h-8 text-[#d0c8b8] mx-auto mb-3" />
                    <p className="text-sm font-bold text-brand-charcoal mb-1">No reviews yet</p>
                    <p className="text-xs text-brand-charcoal-light">Be the first to share your experience</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            RELATED PRODUCTS — full-width cream section
        ══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="bg-brand-cream border-t border-[#e0d8cc] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header */}
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-2">
                    The Collection
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-emerald leading-none tracking-tight">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href={`/products${category ? `?category=${(category as Category)._id}` : ""}`}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-brand-charcoal hover:text-brand-emerald transition-colors shrink-0"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Product grid — editorial no-border cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <RelatedCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
