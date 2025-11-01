import { config, instance } from "../utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const uploadImages = async (data) => {
  return handleApiResponse(instance.post(`/upload/images`, data, config()), {showToast: false}); // not show toast
};

const uploadAvatar = async (data) => {
  return handleApiResponse(instance.post(`/upload/avatar`, data, config()), {showToast: false}); // not show toast
};

const deleteFile = async (data) => {
  return handleApiResponse(instance.delete(`/upload/delete-file`, data, config()), {showToast: false}); // not show toast
};

export const uploadService = {
  uploadImages,
  uploadAvatar,
  deleteFile,
};
