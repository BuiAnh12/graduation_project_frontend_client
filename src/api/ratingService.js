import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllStoreRating = async ({ storeId, sort, limit, page }) => {
  return handleApiResponse(
    instance.get(`/rating/${storeId}`, {
      ...config(),
      params: { sort, limit, page },
    })
  );
};

const getDetailRating = async (ratingId) => {
  return handleApiResponse(instance.get(`/rating/detail/${ratingId}`, config()));
};

const addStoreRating = async (data) => {
  return handleApiResponse(instance.post(`/rating/add-rating`, data, config()));
};

const editStoreRating = async ({ ratingId, data }) => {
  return handleApiResponse(instance.put(`/rating/edit-rating/${ratingId}`, data, config()));
};

const deleteStoreRating = async (ratingId) => {
  return handleApiResponse(instance.delete(`/rating/delete-rating/${ratingId}`, config()));
};

export const ratingService = {
  getAllStoreRating,
  getDetailRating,
  addStoreRating,
  editStoreRating,
  deleteStoreRating,
};
