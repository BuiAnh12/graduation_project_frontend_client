import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getCurrentUser = async (id) => {
  return handleApiResponse(instance.get(`/user/${id}`, config()), { showToast: false });
};

const updateUser = async (data) => {
  return handleApiResponse(instance.put(`/user/`, data, config()), {successMessage:'Cập nhật thông tin thành công'}); // show toast
};

const getAllTags = async () => {
  return handleApiResponse(instance.get(`/reference/all`, config()), { showToast: false });
};

const getUserReference = async () => {
  return handleApiResponse(instance.get(`/reference`, config()), { showToast: false });
};

const updateUserReference = async (data) => {
  return handleApiResponse(instance.put(`/reference`, data, config()), {successMessage:'Cập nhật sở thích thành công'}); // show toast
};

const deleteUserReference = async (data) => {
  return handleApiResponse(instance.delete(`/reference`, { data, ...config() }, {successMessage:'Xóa sở thích thành công'})); // show toast
};

export const userService = {
  getCurrentUser,
  updateUser,
  getAllTags,
  getUserReference,
  updateUserReference,
  deleteUserReference,
};
