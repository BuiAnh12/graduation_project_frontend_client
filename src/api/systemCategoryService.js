import { instance } from "../utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllSystemCategory = async () => {
  return handleApiResponse(instance.get(`/system-category/`));
};

export const systemCategoryService = {
  getAllSystemCategory,
};
