import { config, instance } from "../utils/axiosConfig";
import { handleApiResponse } from "../utils/apiHelper";

const getAllDish = async (storeId) => {
  return handleApiResponse(instance.get(`/store/${storeId}/dish`, config()));
};

const getDish = async (dishId) => {
  return handleApiResponse(instance.get(`/store/dish/${dishId}`, config()));
};

export const dishService = {
  getAllDish,
  getDish,
};
