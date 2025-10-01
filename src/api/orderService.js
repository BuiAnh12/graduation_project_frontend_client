import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserOrder = async () => {
  return handleApiResponse(instance.get(`/order/`, config()));
};

const getOrderDetail = async (orderId) => {
  return handleApiResponse(instance.get(`/order/${orderId}`, config()));
};

const cancelOrder = async (orderId) => {
  return handleApiResponse(instance.put(`/order/${orderId}/cancel-order`, null, config()));
};

const updateOrderStatus = async ({ orderId, data }) => {
  return handleApiResponse(instance.put(`/order/${orderId}/update-status`, data, config()));
};

const reOrder = async (orderId) => {
  return handleApiResponse(instance.post(`/order/re-order/${orderId}`, null, config()));
};

export const orderService = {
  getUserOrder,
  getOrderDetail,
  cancelOrder,
  updateOrderStatus,
  reOrder,
};
