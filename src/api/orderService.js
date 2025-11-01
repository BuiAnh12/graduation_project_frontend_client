import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserOrder = async () => {
  return handleApiResponse(instance.get(`/order/`, config()), { showToast: false });
};

const getOrderDetail = async (orderId) => {
  return handleApiResponse(instance.get(`/order/${orderId}`, config()), { showToast: false });
};

const cancelOrder = async (orderId) => {
  return handleApiResponse(instance.put(`/order/${orderId}/cancel-order`, null, config()), {successMessage:'Hủy đơn hàng thành công'}); // show toast
};

const updateOrderStatus = async ({ orderId, data }) => {
  return handleApiResponse(instance.put(`/order/${orderId}/update-status`, data, config()), {successMessage:'Cập nhật đơn hàng thành công'}); // show toast
};

const reOrder = async (orderId) => {
  return handleApiResponse(instance.post(`/order/re-order/${orderId}`, null, config()), {successMessage:'Tạo lại đơn hàng đã đặt thành công'}); // show toast
};

export const orderService = {
  getUserOrder,
  getOrderDetail,
  cancelOrder,
  updateOrderStatus,
  reOrder,
};
