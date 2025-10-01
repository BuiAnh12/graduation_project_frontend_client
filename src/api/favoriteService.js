import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserFavorite = async () => {
  return handleApiResponse(instance.get(`/favorite`, config()));
};

const addFavorite = async (storeId) => {
  return handleApiResponse(instance.post(`/favorite/add/${storeId}`, null, config()));
};

const removeFavorite = async (storeId) => {
  return handleApiResponse(instance.delete(`/favorite/remove/${storeId}`, config()));
};

const removeAllFavorite = async () => {
  return handleApiResponse(instance.delete(`/favorite/remove-all`, config()));
};

export const favoriteService = {
  getUserFavorite,
  addFavorite,
  removeFavorite,
  removeAllFavorite,
};
