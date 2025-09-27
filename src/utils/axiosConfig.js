import { authService } from "@/api/authService";
import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/v1",
});

// Hàm config header với token hiện tại
export const config = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
      Accept: "application/json",
    },
  };
};

// === Interceptor cho response ===
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh
        const refreshResponse = await axios.get("http://localhost:5000/api/v1/auth/refresh", {
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data?.accessToken;
        if (newAccessToken) {
          // Lưu token mới
          localStorage.setItem("token", newAccessToken);

          // Gắn token mới vào header của request gốc
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        try {
          await authService.logout();
        } catch (e) {
          console.error("Logout failed:", e);
        } finally {
          localStorage.clear();
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);
