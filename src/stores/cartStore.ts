/**
 * Shopping Cart Store
 * Manages cart items with localStorage persistence via Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/payment';

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;

  // Getters
  isInCart: (id: number) => boolean;
  itemCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // Prevent duplicates
          if (state.items.some((i) => i.id === item.id)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      isInCart: (id) => get().items.some((i) => i.id === id),

      itemCount: () => get().items.length,

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
