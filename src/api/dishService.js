import { config, instance } from "../utils/axiosConfig";
import { handleApiResponse } from "../utils/apiHelper";

const getAllDish = async (storeId) => {
  return handleApiResponse(instance.get(`/store/${storeId}/dish`, config()), { showToast: false });
};

const getDish = async (dishId) => {
  return handleApiResponse(instance.get(`/store/dish/${dishId}`, config()), { showToast: false });
};

export const dishService = {
  getAllDish,
  getDish,
};
