"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const VoucherContext = createContext();

export const VoucherProvider = ({ children }) => {
  const [storeVouchers, setStoreVouchers] = useState({});
  const pathname = usePathname();

  const toggleVoucher = (storeId, voucher) => {
    setStoreVouchers((prev) => {
      const current = prev[storeId] || [];
      if (current.some((v) => v._id === voucher._id)) {
        return {
          ...prev,
          [storeId]: current.filter((v) => v._id !== voucher._id),
        };
      }
      return {
        ...prev,
        [storeId]: [...current, voucher],
      };
    });
  };

  const clearVouchers = (storeId) => {
    setStoreVouchers((prev) => {
      const copy = { ...prev };
      if (storeId) {
        delete copy[storeId];
      } else {
        return {};
      }
      return copy;
    });
  };

  useEffect(() => {
    if (!pathname.startsWith("/store")) {
      setStoreVouchers({});
    }
  }, [pathname]);

  return (
    <VoucherContext.Provider value={{ storeVouchers, toggleVoucher, clearVouchers }}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);
