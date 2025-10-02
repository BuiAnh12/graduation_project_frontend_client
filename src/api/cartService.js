import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserCart = async () => {
  return handleApiResponse(instance.get(`/cart`, config()));
};

const getDetailCart = async (cartId) => {
  return handleApiResponse(instance.get(`/cart/${cartId}`, config()));
};

const updateCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/update`, data, config()));
};

const completeCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/complete`, data, config()));
};

const clearCartItem = async (storeId) => {
  return handleApiResponse(instance.delete(`/cart/clear/item/${storeId}`, config()));
};

const clearCart = async () => {
  return handleApiResponse(instance.delete(`/cart/clear`, config()));
};

export const cartService = {
  getUserCart,
  getDetailCart,
  updateCart,
  completeCart,
  clearCartItem,
  clearCart,
};
