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

const refreshUserEmbedding = async (user) => {
  // Construct the payload structure expected by the backend
  const payload = {
    user_id: user._id,
    user_data: {
      age: user.age,
      gender: user.gender,
      // Add location if your model uses it
      location: user.location 
      // Note: 'preferences' are usually fetched by the backend from the DB directly 
      // during the refresh call if your backend logic supports it. 
      // If your backend expects preferences in the payload, you'd add them here.
      // Based on previous steps, we designed the backend to take raw data override.
    }
  };

  return handleApiResponse(
    instance.post(`/recommend/refresh/user`, payload, config()), 
    { showToast: true, successMessage: "Đã cập nhật gợi ý cho bạn!" }
  );
};

export const recommendService = {
  getRecommendDish,
  getSimilarDish,
  getRecommendTagsForOrder,
  refreshUserEmbedding
};
