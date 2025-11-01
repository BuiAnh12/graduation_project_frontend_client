import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const createVNPayOrder = async (orderId, data) => {
  return handleApiResponse(
    instance.post(`/payment/vnpay/qrcode/${orderId}`, data, config()), {successMessage:'Thanh toán bằng VNPay thành công'}
  ); // show toast
};

export const paymentService = {
  createVNPayOrder,
};
