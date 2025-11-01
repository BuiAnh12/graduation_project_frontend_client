import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserFavorite = async () => {
  return handleApiResponse(instance.get(`/favorite`, config()), { showToast: false });
};

const addFavorite = async (storeId) => {
  return handleApiResponse(instance.post(`/favorite/add/${storeId}`, null, config()), {successMessage:'Thêm cửa hàng vào danh sách yêu thích thành công'}); // show toast
};

const removeFavorite = async (storeId) => {
  return handleApiResponse(instance.delete(`/favorite/remove/${storeId}`, config()), {successMessage:'Xóa cửa hàng khỏi danh sách yêu thích'}); // show toast
};

const removeAllFavorite = async () => {
  return handleApiResponse(instance.delete(`/favorite/remove-all`, config()), {successMessage:'Xóa tất cả cửa hàng yêu thích thành công'}); // show toast
};

export const favoriteService = {
  getUserFavorite,
  addFavorite,
  removeFavorite,
  removeAllFavorite,
};
