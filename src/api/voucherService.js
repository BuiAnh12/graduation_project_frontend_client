import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getVouchersByStore = async (storeId) => {
  return handleApiResponse(instance.get(`/voucher/stores/${storeId}/vouchers`, config()));
};

const getVoucherById = async ({ storeId, id }) => {
  return handleApiResponse(instance.get(`/voucher/stores/${storeId}/vouchers/${id}`, config()));
};

export const voucherService = {
  getVouchersByStore,
  getVoucherById,
};
