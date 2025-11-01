import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllStoreRating = async ({ storeId, sort, limit, page }) => {
  return handleApiResponse(
    instance.get(`/rating/${storeId}`, {
      ...config(),
      params: { sort, limit, page },
    }),
    { showToast: false } // no toast
  );
};

const getDetailRating = async (ratingId) => {
  return handleApiResponse(
    instance.get(`/rating/detail/${ratingId}`, config()),
    { showToast: false } // no toast
  );
};

const addStoreRating = async (data) => {
  return handleApiResponse(
    instance.post(`/rating/add-rating`, data, config()) , {successMessage:'Thêm đánh giá thành công'}
  ); // show toast
};

const editStoreRating = async ({ ratingId, data }) => {
  return handleApiResponse(
    instance.put(`/rating/edit-rating/${ratingId}`, data, config()), {successMessage:'Chỉnh sửa đánh giá thành công'}
  ); // show toast
};

const deleteStoreRating = async (ratingId) => {
  return handleApiResponse(
    instance.delete(`/rating/delete-rating/${ratingId}`, config()), {successMessage:'Xóa đánh giá thành công'}
  ); // show toast
};

export const ratingService = {
  getAllStoreRating,
  getDetailRating,
  addStoreRating,
  editStoreRating,
  deleteStoreRating,
};
