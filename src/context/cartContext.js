"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "@/api/cartService";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const refreshCart = async () => {
    try {
      if (user) {
        setLoading(true);
        const response = await cartService.getUserCart();
        setCart(response.data);
      }
    } catch (error) {
      setCart(null);
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  return <CartContext.Provider value={{ cart, loading, refreshCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải dùng trong <CartProvider>");
  return context;
};
