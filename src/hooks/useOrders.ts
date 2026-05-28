"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Order, Address } from "@/types";
import toast from "react-hot-toast";

interface UseOrdersReturn {
  orders: Order[];
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  fetchMyOrders: (page?: number) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (data: {
    shippingAddress: Address;
    paymentMethod: string;
  }) => Promise<Order | null>;
}

export default function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null>(null);

  const fetchMyOrders = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `${API_ENDPOINTS.ORDERS}?page=${page}`
      );
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.ORDER_BY_ID(id));
      setOrder(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(
    async (data: {
      shippingAddress: Address;
      paymentMethod: string;
    }): Promise<Order | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post(API_ENDPOINTS.ORDERS, data);
        toast.success("Order placed successfully!");
        return response.data.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to create order";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    orders,
    order,
    isLoading,
    error,
    pagination,
    fetchMyOrders,
    fetchOrderById,
    createOrder,
  };
}
