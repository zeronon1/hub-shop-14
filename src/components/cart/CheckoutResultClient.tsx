"use client";

import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutResultClient({ clearOnMount = false }: { clearOnMount?: boolean }) {
  const { clearCart, isHydrated } = useCart();

  // ต้องรอ hydrate จาก localStorage ก่อน ไม่งั้น clear จะถูกเขียนทับด้วยตะกร้าเก่า
  useEffect(() => {
    if (clearOnMount && isHydrated) {
      clearCart();
    }
  }, [clearOnMount, clearCart, isHydrated]);

  return null;
}
