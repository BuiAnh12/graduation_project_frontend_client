import { config, instance } from "@/utils/axiosConfig";

const getUserFavorite = async () => {
  const response = await instance.get(`/favorite`, config());
  if (response.data) {
    return response.data;
  }
};

const addFavorite = async (storeId) => {
  const response = await instance.post(`/favorite/add/${storeId}`, null, config());
  if (response.data) {
    return response.data;
  }
};

const removeFavorite = async (storeId) => {
  const response = await instance.delete(`/favorite/remove/${storeId}`, config());
  if (response.data) {
    return response.data;
  }
};

const removeAllFavorite = async () => {
  const response = await instance.delete(`/favorite/remove-all`, config());
  if (response.data) {
    return response.data;
  }
};

export const favoriteService = {
  getUserFavorite,
  addFavorite,
  removeFavorite,
  removeAllFavorite,
};
