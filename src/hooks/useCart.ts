"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface CartItem {
  productId: Product;
  quantity: number;
  customization?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;

  addToCart: (product: Product, quantity?: number, customization?: Record<string, string>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  cartTotal: () => number;
  cartCount: () => number;
}

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem("auth-token");
}

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToCart: async (product: Product, quantity: number = 1, customization?: Record<string, string>) => {
        if (isAuthenticated()) {
          try {
            set({ isLoading: true });
            await api.post(API_ENDPOINTS.CART, {
              productId: product._id,
              quantity,
              ...(customization && Object.keys(customization).length > 0 ? { customization } : {}),
            });
            await get().getCart();
            toast.success("Added to cart");
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || "Failed to add to cart"
            );
          } finally {
            set({ isLoading: false });
          }
        } else {
          const items = [...get().items];
          const existing = items.find(
            (item) => item.productId._id === product._id
          );
          if (existing) {
            existing.quantity += quantity;
            if (customization) existing.customization = customization;
          } else {
            items.push({ productId: product, quantity, customization });
          }
          set({ items });
          toast.success("Added to cart");
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity < 1) return;

        if (isAuthenticated()) {
          try {
            await api.put(API_ENDPOINTS.CART_ITEM(productId), { quantity });
            await get().getCart();
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || "Failed to update quantity"
            );
          }
        } else {
          const items = get().items.map((item: CartItem) =>
            item.productId._id === productId ? { ...item, quantity } : item
          );
          set({ items });
        }
      },

      removeItem: async (productId: string) => {
        if (isAuthenticated()) {
          try {
            await api.delete(API_ENDPOINTS.CART_ITEM(productId));
            await get().getCart();
            toast.success("Item removed from cart");
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || "Failed to remove item"
            );
          }
        } else {
          set({
            items: get().items.filter(
              (item: CartItem) => item.productId._id !== productId
            ),
          });
          toast.success("Item removed from cart");
        }
      },

      clearCart: async () => {
        if (isAuthenticated()) {
          try {
            await api.delete(API_ENDPOINTS.CART);
            set({ items: [] });
          } catch {
            // silently fail
          }
        } else {
          set({ items: [] });
        }
      },

      getCart: async () => {
        if (!isAuthenticated()) return;

        try {
          set({ isLoading: true });
          const response = await api.get(API_ENDPOINTS.CART);
          set({ items: response.data.data?.items || [] });
        } catch {
          // Cart might not exist yet
        } finally {
          set({ isLoading: false });
        }
      },

      cartTotal: () => {
        return get().items.reduce(
          (total: number, item: CartItem) =>
            total + (item.productId?.price || 0) * item.quantity,
          0
        );
      },

      cartCount: () => {
        return get().items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(name);
          }
        },
      },
      partialize: (state: any) => ({ items: state.items }),
    }
  )
);

export default useCart;
