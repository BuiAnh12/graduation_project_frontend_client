import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getVouchersByStore = async (storeId) => {
  return handleApiResponse(instance.get(`/voucher/customer/${storeId}`, config()), { showToast: false });
};

const getVoucherById = async ({ storeId, id }) => {
  return handleApiResponse(instance.get(`/voucher/detail/${id}`, config()), { showToast: false });
};

export const voucherService = {
  getVouchersByStore,
  getVoucherById,
};
