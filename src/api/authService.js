import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const register = async (userData) => {
  return handleApiResponse(instance.post(`/auth/register`, userData, config()), {successMessage:'Đăng nhập ký thành công'});
};

const login = async (userData) => {
  const result = await handleApiResponse(instance.post(`/auth/login`, userData, config()), {successMessage:'Đăng nhập thành công'});
  if (result.success && result.data) {
    const data = result.data;
    localStorage.setItem("userId", JSON.stringify(data._id));
    localStorage.setItem("token", JSON.stringify(data.token));
  }

  return result;
};

// const loginWithGoogle = async (userData) => {
//   const result = await handleApiResponse(instance.post(`/auth/login/google`, userData, config()));
//
//   if (result.success && result.data) {
//     const data = result.data;
//     localStorage.setItem("userId", JSON.stringify(data._id));
//     localStorage.setItem("token", JSON.stringify(data.token));
//   }
//
//   return result;
// };

const logout = async () => {
  // Optionally call backend logout if needed
  // await handleApiResponse(instance.get(`/auth/logout`, config()));

  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken")
  return { success: true, message: "Đăng suất thành công" };
};

const refreshAccessToken = async () => {
  return handleApiResponse(instance.get(`/auth/refresh`, config()), { showToast: false});
};

const forgotPassword = async (data) => {
  return handleApiResponse(instance.post(`/auth/forgot-password`, data, config()), {successMessage:'Yêu cầu đổi mật khẩu thành công'});
};

const checkOTP = async (data) => {
  return handleApiResponse(instance.post(`/auth/check-otp`, data, config()),  {successMessage:'Yêu cầu mã OTP thành công'});
};

const resetPassword = async (data) => {
  return handleApiResponse(instance.put(`/auth/reset-password`, data, config()), {successMessage:'Đổi mật khẩu thành công'});
};

const changePassword = async (data) => {
  return handleApiResponse(instance.put(`/auth/change-password`, data, config()), {successMessage:'Đổi mật khẩu thành công'});
};

export const authService = {
  register,
  login,
  // loginWithGoogle,
  logout,
  refreshAccessToken,
  forgotPassword,
  checkOTP,
  resetPassword,
  changePassword,
};
