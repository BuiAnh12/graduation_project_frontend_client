import { config, instance } from "@/utils/axiosConfig";

const createVNPayOrder = async (orderId, data) => {
  const response = await instance.post(
    `/payment/vnpay/qrcode/${orderId}`,
    data,
    config()
  );

  if (response.data) {
    return response.data;
  }

  throw new Error("VNPay QR generation failed");
};

export const paymentService = {
  createVNPayOrder,
  // ... other methods like createVNPayOrder
};
