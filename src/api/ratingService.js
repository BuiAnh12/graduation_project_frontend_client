import { config, instance } from "@/utils/axiosConfig";

const getAllStoreRating = async ({ storeId, sort, limit, page }) => {
  const response = await instance.get(`/rating/${storeId}`, { sort, limit, page });
  if (response.data) {
    return response.data;
  }
};

const getDetailRating = async (ratingId) => {
  const response = await instance.get(`/rating/detail/${ratingId}`);
  if (response.data) {
    return response.data;
  }
};

const addStoreRating = async (data) => {
  const response = await instance.post(`/rating/add-rating`, data, config());
  if (response.data) {
    return response.data;
  }
};

const editStoreRating = async ({ ratingId, data }) => {
  const response = await instance.put(`/rating/edit-rating/${ratingId}`, data, config());
  if (response.data) {
    return response.data;
  }
};

const deleteStoreRating = async (ratingId) => {
  const response = await instance.delete(`/rating/delete-rating/${ratingId}`, config);
  if (response.data) {
    return response.data;
  }
};

export const ratingService = {
  getAllStoreRating,
  getDetailRating,
  addStoreRating,
  editStoreRating,
  deleteStoreRating,
};
