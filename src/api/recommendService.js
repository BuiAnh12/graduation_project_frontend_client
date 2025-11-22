import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getRecommendDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish`, data, config()), { showToast: false }); // no toast
};

const getSimilarDish = async (data) => {
  return handleApiResponse(instance.post(`/recommend/dish/similar`, data, config()), { showToast: false }); // no toast
};

const getRecommendTagsForOrder = async (dishIds) => {
  return handleApiResponse(
    instance.post(`/recommend/tags/recommend-order`, { dish_ids: dishIds, top_k: 10 }, config()), 
    { showToast: false }
  );
};

export const recommendService = {
  getRecommendDish,
  getSimilarDish,
  getRecommendTagsForOrder,
};
