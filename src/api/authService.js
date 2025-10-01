import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const register = async (userData) => {
  return handleApiResponse(instance.post(`/auth/register`, userData, config()));
};

const login = async (userData) => {
  const result = await handleApiResponse(instance.post(`/auth/login`, userData, config()));

  if (result.success && result.data) {
    const data = result.data;
    localStorage.setItem("userId", JSON.stringify(data._id));
    localStorage.setItem("token", JSON.stringify(data.token));
    return result;
  }

  return result;
};

const logout = async () => {
  // optional: call backend logout if needed
  // await handleApiResponse(instance.get(`/auth/logout`, config()));

  localStorage.removeItem("userId");
  localStorage.removeItem("token");

  return { success: true, message: "Logged out successfully" };
};

const refreshAccessToken = async () => {
  const result = await handleApiResponse(instance.get(`/auth/refresh`, config()));

  if (result.success && result.data) {
    return result;
  }

  return result;
};

export const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
};
