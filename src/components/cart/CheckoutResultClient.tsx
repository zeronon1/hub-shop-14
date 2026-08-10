"use client";

import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutResultClient({ clearOnMount = false }: { clearOnMount?: boolean }) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (clearOnMount) {
      clearCart();
    }
  }, [clearOnMount, clearCart]);

  return null;
}
