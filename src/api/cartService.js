import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserCart = async () => {
  return handleApiResponse(instance.get(`/cart`, config()), { showToast: false });
};

const getDetailCart = async (cartId) => {
  return handleApiResponse(instance.get(`/cart/${cartId}`, config()), { showToast: false });
};

const updateCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/update`, data, config()), {successMessage:'Cập nhật giỏ hàng thành công'}); // show toast
};

const completeCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/complete`, data, config()), {successMessage:'Chuyển đơn hàng thành công'}); // show toast
};

const clearCartItem = async (storeId) => {
  return handleApiResponse(instance.delete(`/cart/clear/item/${storeId}`, config()), {successMessage:'Xóa các món trong giỏ hàng thành công'}); // show toast
};

const clearCart = async () => {
  return handleApiResponse(instance.delete(`/cart/clear`, config()), {successMessage:'Xóa tất cả giỏ hàng thành công'}); // show toast
};

export const cartService = {
  getUserCart,
  getDetailCart,
  updateCart,
  completeCart,
  clearCartItem,
  clearCart,
};
