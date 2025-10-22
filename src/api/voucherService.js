import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getVouchersByStore = async (storeId) => {
  return handleApiResponse(instance.get(`/voucher/customer/${storeId}`, config()));
};

const getVoucherById = async ({ storeId, id }) => {
  return handleApiResponse(instance.get(`/voucher/detail/${id}`, config()));
};

export const voucherService = {
  getVouchersByStore,
  getVoucherById,
};
