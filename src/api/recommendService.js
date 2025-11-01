import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getRecommendDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish`, data, config()), { showToast: false }); // no toast
};

const getSimilarDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish/similar`, data, config()), { showToast: false }); // no toast
};

export const recommendService = {
  getRecommendDish,
  getSimilarDish,
};
