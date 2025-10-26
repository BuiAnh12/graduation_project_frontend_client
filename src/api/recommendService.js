import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getRecommendDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish`, data, config()));
};

const getSimilarDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish/similar`, data, config()));
};

export const recommendService = {
  getRecommendDish,
  getSimilarDish,
};
