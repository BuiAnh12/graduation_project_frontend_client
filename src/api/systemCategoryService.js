import { instance } from "../utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllSystemCategory = async () => {
  return handleApiResponse(instance.get(`/system-categories/`), { showToast: false }); // no toast
};

export const systemCategoryService = {
  getAllSystemCategory,
};
