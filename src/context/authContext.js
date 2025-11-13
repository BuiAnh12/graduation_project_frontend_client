"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/api/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Bắt đầu ở trạng thái loading

  const fetchUser = async (id) => {
    const idToFetch = id !== undefined ? id : userId;

    if (!idToFetch) {
        console.warn("fetchUser: Không có ID để fetch, hủy bỏ.");
        return; 
    }

    setLoading(true);
    try {
      // 3. Sử dụng 'idToFetch' đã được xác định
      const res = await userService.getCurrentUser(idToFetch); 
      console.log("login authContext", res)
      if (res.success) {
        setUser(res.data);
        setUserId(idToFetch);
        if (id !== undefined && id !== userId) {
             localStorage.setItem("userId", JSON.stringify(idToFetch));
        }

      }
      else {
        console.error("Lỗi lấy thông tin user (API success: false):", res.errorMessage);
        setUser(null);
        setUserId(null); 
        localStorage.removeItem("userId"); 
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user (catch):", error);
      setUser(null);
      setUserId(null); 
      localStorage.removeItem("userId"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log("AuthContex Debug")
    console.log(userId)
    console.log(user)
    console.log(loading)
  },[userId, user, loading])


  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) {
      try {
        const parsedId = JSON.parse(savedId);
        fetchUser(parsedId); 
      } catch (e) {
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
  }, []); // Chỉ chạy một lần khi khởi động

  // --- NEW: Tính toán isAuthenticated dựa trên state ---
  const isAuthenticated = !loading && !!user && !!userId;

  return (
    <AuthContext.Provider 
      value={{ 
        userId, 
        setUserId, // Dùng cho đăng xuất
        user, 
        setUser, // Dùng cho đăng xuất
        loading, 
        isAuthenticated,
        fetchUser // Dùng cho đăng nhập và refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);