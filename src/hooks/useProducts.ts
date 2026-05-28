"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Product, ProductFilters, PaginatedResponse } from "@/types";

interface UseProductsReturn {
  products: Product[];
  product: Product | null;
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchByCategory: (categoryId: string, page?: number) => Promise<void>;
}

export default function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
      if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
      if (filters?.sort) params.append("sort", filters.sort);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.limit) params.append("limit", String(filters.limit));
      if (filters?.isFeatured) params.append("isFeatured", "true");

      const response = await api.get<PaginatedResponse<Product>>(
        `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`
      );
      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      setProduct(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS_FEATURED);
      setFeaturedProducts(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch featured products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(
    async (categoryId: string, page: number = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId)}&page=${page}`
        );
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    products,
    product,
    featuredProducts,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchProduct,
    fetchFeatured,
    fetchByCategory,
  };
}
