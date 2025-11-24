import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const createVNPayOrder = async (orderId, data) => {
  return handleApiResponse(
    instance.post(`/payment/vnpay/qrcode/${orderId}`, data, config()), {showToast: false}
  ); // not show toast
};

export const paymentService = {
  createVNPayOrder,
};
