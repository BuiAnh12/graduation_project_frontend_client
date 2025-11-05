"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/api/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Bắt đầu ở trạng thái loading

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const res = await userService.getCurrentUser(id);
      setUser(res.data);
      setUserId(id); 
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      setUser(null);
      setUserId(null); 
      localStorage.removeItem("userId"); 
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) {
      try {
        const parsedId = JSON.parse(savedId);
        fetchUser(parsedId); // Chỉ cần gọi fetchUser
      } catch (e) {
        // Xử lý nếu localStorage bị hỏng
        console.error("Lỗi parse userId từ localStorage:", e);
        localStorage.removeItem("userId");
        setUser(null);
        setUserId(null);
        setLoading(false);
      }
    } else {
      // Không có ai đăng nhập
      setUser(null);
      setUserId(null);
      setLoading(false);
    }
  }, []);

  // --- NEW: Tính toán isAuthenticated dựa trên state ---
  const isAuthenticated = !loading && !!user && !!userId;

  return (
    <AuthContext.Provider 
      value={{ 
        userId, 
        setUserId, 
        user, 
        setUser, 
        loading, 
        isAuthenticated,
        fetchUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);