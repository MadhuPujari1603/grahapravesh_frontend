"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  count: () => number;
}

const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) =>
        set((s) => {
          if (s.items.some((p) => p._id === product._id)) return s;
          return { items: [...s.items, product] };
        }),

      remove: (productId) =>
        set((s) => ({ items: s.items.filter((p) => p._id !== productId) })),

      toggle: (product) => {
        const { items } = get();
        if (items.some((p) => p._id === product._id)) {
          set({ items: items.filter((p) => p._id !== product._id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isWishlisted: (productId) =>
        get().items.some((p) => p._id === productId),

      count: () => get().items.length,
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlist;
