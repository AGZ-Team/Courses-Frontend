"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CartDrawer } from "./CartDrawer";

interface CartDrawerContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextValue>({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});

export function useCartDrawer() {
  return useContext(CartDrawerContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <CartDrawerContext.Provider value={{ isOpen, openCart, closeCart, toggleCart }}>
      {children}
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </CartDrawerContext.Provider>
  );
}
