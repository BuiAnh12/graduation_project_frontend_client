import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const calculateShippingFee = async (storeId, { distanceKm }) => {
  return handleApiResponse(
    instance.get(`/shipping-fee/stores/${storeId}/calculate`, {
      ...config(),
      params: { distanceKm },
    })
  );
};

export const shippingFeeService = {
  calculateShippingFee,
};
