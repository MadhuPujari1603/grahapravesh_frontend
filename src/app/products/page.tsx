"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  SlidersHorizontal, 
  X, 
  Star, 
  Tag, 
  TrendingUp, 
  Sparkles,
  ChevronDown,
  Filter
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import PriceRangeSlider from "@/components/ui/PriceRangeSlider";
import useProducts from "@/hooks/useProducts";
import api from "@/lib/axios";
import { API_ENDPOINTS, SORT_OPTIONS, ITEMS_PER_PAGE } from "@/lib/constants";
import { Category, ProductFilters } from "@/types";
import { cn } from "@/lib/utils";

const PRICE_MIN = 0;
const PRICE_MAX = 10000;
const PRICE_STEP = 100;

const QUICK_FILTERS = [
  { label: "On Sale", icon: Tag, key: "onSale" },
  { label: "Featured", icon: Sparkles, key: "featured" },
  { label: "New Arrivals", icon: TrendingUp, key: "newArrivals" },
  { label: "In Stock", icon: Star, key: "inStock" },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, isLoading, pagination, fetchProducts } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentFeatured = searchParams.get("featured") === "true";

  useEffect(() => {
    api
      .get(API_ENDPOINTS.CATEGORIES)
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const filters: ProductFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: currentSort,
    };
    if (currentCategory) filters.category = currentCategory;
    if (currentSearch) filters.search = currentSearch;
    if (currentMinPrice) filters.minPrice = Number(currentMinPrice);
    if (currentMaxPrice) filters.maxPrice = Number(currentMaxPrice);
    if (currentInStock) filters.inStock = true;
    if (currentFeatured) filters.isFeatured = true;

    fetchProducts(filters);
  }, [currentCategory, currentSearch, currentSort, currentPage, currentMinPrice, currentMaxPrice, currentInStock, currentFeatured, fetchProducts]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      if (!updates.page) params.set("page", "1");
      router.push(`/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearch = useCallback(
    (query: string) => {
      updateParams({ search: query, page: "" });
    },
    [updateParams]
  );

  const handleQuickFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === "inStock") {
      if (currentInStock) {
        params.delete("inStock");
      } else {
        params.set("inStock", "true");
      }
    } else if (key === "featured") {
      if (currentFeatured) {
        params.delete("featured");
      } else {
        params.set("featured", "true");
      }
    } else if (key === "onSale") {
      // Toggle sort to show discounted items
      if (currentSort === "price_desc") {
        params.delete("sort");
      } else {
        params.set("sort", "price_desc");
      }
    } else if (key === "newArrivals") {
      if (currentSort === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", "newest");
      }
    }
    
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceChange = (min: number, max: number) => {
    updateParams({ 
      minPrice: min === PRICE_MIN ? "" : String(min),
      maxPrice: max === PRICE_MAX ? "" : String(max),
      page: "" 
    });
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters =
    currentCategory || currentMinPrice || currentMaxPrice || currentInStock || currentFeatured;

  const activeFilterCount = [
    currentCategory,
    currentMinPrice || currentMaxPrice,
    currentInStock,
    currentFeatured,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Discover Premium Products
            </h1>
            <p className="text-emerald-100 text-sm">
              {pagination?.totalItems || 0} products • Curated with excellence
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Sort Toolbar */}
          <div className="rounded-xl border p-4 mb-6 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Search Bar */}
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  defaultValue={currentSearch}
                  placeholder="Search by product name, description..."
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="input-premium text-sm py-2.5 pr-8 flex-1 lg:flex-none lg:w-48"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-brand-charcoal-medium hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-emerald text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {QUICK_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isActive = 
                  (filter.key === "inStock" && currentInStock) ||
                  (filter.key === "featured" && currentFeatured) ||
                  (filter.key === "onSale" && currentSort === "price_desc") ||
                  (filter.key === "newArrivals" && currentSort === "newest");

                return (
                  <button
                    key={filter.key}
                    onClick={() => handleQuickFilter(filter.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[40px]",
                      isActive
                        ? "bg-brand-emerald text-white shadow-sm"
                        : "bg-gray-100 text-brand-charcoal-medium hover:bg-gray-200"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside
              className={cn(
                "w-72 shrink-0 transition-all",
                filtersOpen
                  ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0"
                  : "hidden lg:block"
              )}
            >
              {/* Mobile Header */}
              {filtersOpen && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-charcoal">Filters</h3>
                    {activeFilterCount > 0 && (
                      <p className="text-xs text-brand-charcoal-light mt-0.5">
                        {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => setFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {/* Categories */}
                <div className="bg-white lg:bg-transparent rounded-xl lg:rounded-none border lg:border-0 border-gray-100 p-4 lg:p-0">
                  <h4 className="text-sm font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-emerald" />
                    Categories
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        updateParams({ category: "" });
                        setFiltersOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        !currentCategory
                          ? "bg-brand-emerald/10 text-brand-emerald font-medium"
                          : "text-brand-charcoal-medium hover:bg-gray-50"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          updateParams({ category: cat._id });
                          setFiltersOpen(false);
                        }}
                        className={cn(
                          "block w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                          currentCategory === cat._id
                            ? "bg-brand-emerald/10 text-brand-emerald font-medium"
                            : "text-brand-charcoal-medium hover:bg-gray-50"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="bg-white lg:bg-transparent rounded-xl lg:rounded-none border lg:border-0 border-gray-100 p-4 lg:p-0">
                  <h4 className="text-sm font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-emerald" />
                    Price Range
                  </h4>
                  <PriceRangeSlider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    currentMin={parseInt(currentMinPrice) || PRICE_MIN}
                    currentMax={parseInt(currentMaxPrice) || PRICE_MAX}
                    onChange={handlePriceChange}
                    step={PRICE_STEP}
                  />
                </div>

                {/* Availability */}
                <div className="bg-white lg:bg-transparent rounded-xl lg:rounded-none border lg:border-0 border-gray-100 p-4 lg:p-0">
                  <h4 className="text-sm font-semibold text-brand-charcoal mb-3">
                    Availability
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentInStock}
                      onChange={(e) => updateParams({ inStock: e.target.checked ? "true" : "" })}
                      className="w-4 h-4 rounded border-gray-300 text-brand-emerald focus:ring-brand-emerald"
                    />
                    <span className="text-sm text-brand-charcoal-medium">In Stock Only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearFilters();
                      setFiltersOpen(false);
                    }}
                    fullWidth
                    className="border border-gray-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All Filters
                  </Button>
                )}

                {/* Mobile Apply Button */}
                <div className="lg:hidden pt-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setFiltersOpen(false)}
                    fullWidth
                  >
                    View {pagination?.totalItems || 0} Products
                  </Button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Active Filters Bar */}
              {hasActiveFilters && (
                <div className="bg-white rounded-lg border border-gray-100 p-3 mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-brand-charcoal-light">Active Filters:</span>
                  {currentCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-emerald/10 text-brand-emerald text-xs rounded-md">
                      {categories.find(c => c._id === currentCategory)?.name}
                      <button 
                        onClick={() => updateParams({ category: "" })}
                        className="hover:bg-brand-emerald/20 rounded-full p-1.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(currentMinPrice || currentMaxPrice) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-emerald/10 text-brand-emerald text-xs rounded-md">
                      ₹{currentMinPrice || "0"} - ₹{currentMaxPrice || "∞"}
                      <button 
                        onClick={() => updateParams({ minPrice: "", maxPrice: "" })}
                        className="hover:bg-brand-emerald/20 rounded-full p-1.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {currentInStock && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-emerald/10 text-brand-emerald text-xs rounded-md">
                      In Stock
                      <button 
                        onClick={() => updateParams({ inStock: "" })}
                        className="hover:bg-brand-emerald/20 rounded-full p-1.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {currentFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-emerald/10 text-brand-emerald text-xs rounded-md">
                      Featured
                      <button 
                        onClick={() => updateParams({ featured: "" })}
                        className="hover:bg-brand-emerald/20 rounded-full p-1.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
                    >
                      <div className="h-72 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="flex justify-between pt-2">
                          <div className="h-6 bg-gray-200 rounded w-1/4" />
                          <div className="h-9 w-9 bg-gray-200 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-10">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) =>
                          updateParams({ page: String(page) })
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your filters or search query to discover our premium collection."
                  actionLabel="Clear All Filters"
                  onAction={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
