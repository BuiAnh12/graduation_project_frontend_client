import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const calculateShippingFee = async ({ distanceKm }) => {
  return handleApiResponse(
    instance.get(`/shipping-fee/calculate`, {
      ...config(),
      params: { distanceKm },
    }),
    { showToast: false } // no toast
  );
};

export const shippingFeeService = {
  calculateShippingFee,
};
