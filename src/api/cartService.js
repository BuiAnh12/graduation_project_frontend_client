import { config, instance } from "@/utils/axiosConfig";

const getUserCart = async () => {
  const response = await instance.get(`/cart`, config());
  if (response.data) {
    return response.data;
  }
};

const getDetailCart = async (cartId) => {
  const response = await instance.get(`/cart/detail/${cartId}`, config());
  if (response.data) {
    return response.data;
  }
};

const updateCart = async (data) => {
  const response = await instance.post(`/cart/update`, data, config());
  if (response.data) {
    return response.data;
  }
};

const completeCart = async (data) => {
  const response = await instance.post(`/cart/complete`, data, config());
  if (response.data) {
    return response.data;
  }
};

const clearCartItem = async (storeId) => {
  const response = await instance.delete(`/cart/clear/item/${storeId}`, config());
  if (response.data) {
    return response.data;
  }
};

const clearCart = async () => {
  const response = await instance.delete(`/cart/clear`, config());
  if (response.data) {
    return response.data;
  }
};

export const cartService = {
  getUserCart,
  getDetailCart,
  updateCart,
  completeCart,
  clearCartItem,
  clearCart,
};
