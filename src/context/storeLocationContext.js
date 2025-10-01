"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const StoreLocationContext = createContext();

export const StoreLocationProvider = ({ children }) => {
  const pathname = usePathname();

  // Khởi tạo state từ localStorage
  const [storeId, setStoreId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("storeId") || "";
    }
    return "";
  });

  const [storeLocation, setStoreLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLocation = localStorage.getItem("storeLocation");
      return savedLocation
        ? JSON.parse(savedLocation)
        : {
            address: "",
            contactName: "",
            contactPhonenumber: "",
            detailAddress: "",
            name: "",
            note: "",
            lat: 200,
            lon: 200,
          };
    }
    return {
      address: "",
      contactName: "",
      contactPhonenumber: "",
      detailAddress: "",
      name: "",
      note: "",
      lat: 200,
      lon: 200,
    };
  });

  // Lưu vào localStorage khi storeLocation thay đổi
  useEffect(() => {
    if (storeLocation) {
      localStorage.setItem("storeLocation", JSON.stringify(storeLocation));
    }
  }, [storeLocation]);

  // Lưu vào localStorage khi storeId thay đổi
  useEffect(() => {
    if (storeId) {
      localStorage.setItem("storeId", storeId);
    }
  }, [storeId]);

  // Kiểm tra đường dẫn và reset nếu cần
  useEffect(() => {
    if (
      !(
        pathname.startsWith("/account/location/add-location") ||
        pathname.startsWith("/account/location/edit-location") ||
        pathname.startsWith("/account/location/choose-location") ||
        pathname.startsWith("/account/location") ||
        pathname.startsWith("/store")
      )
    ) {
      setStoreLocation({
        address: "",
        contactName: "",
        contactPhonenumber: "",
        detailAddress: "",
        name: "",
        note: "",
        lat: 200,
        lon: 200,
      });
      setStoreId("");
      localStorage.removeItem("storeLocation"); // Xóa storeLocation khỏi localStorage
      localStorage.removeItem("storeId"); // Xóa storeId khỏi localStorage
    }
  }, [pathname]);

  return (
    <StoreLocationContext.Provider value={{ storeLocation, setStoreLocation, storeId, setStoreId }}>
      {children}
    </StoreLocationContext.Provider>
  );
};

export const useStoreLocation = () => useContext(StoreLocationContext);
