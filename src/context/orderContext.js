"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { orderService } from "@/api/orderService";
import { useAuth } from "./authContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const refreshOrder = async () => {
    try {
      if (user) {
        setLoading(true);
        const response = await orderService.getUserOrder();
        setOrder(response.data);
      }
    } catch (error) {
      setOrder(null);
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrder();
  }, [user]);

  return <OrderContext.Provider value={{ order, loading, refreshOrder }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder phải dùng trong <OrderProvider>");
  return context;
};
