import { config, instance } from "../utils/axiosConfig";

const uploadImages = async (data) => {
  const response = await instance.post(`/upload/images`, data, config());

  if (response.data) {
    return response.data;
  }
};

const uploadAvatar = async (data) => {
  const response = await instance.post(`/upload/avatar`, data, config());
  if (response.data) {
    return response.data;
  }
};

const deleteFile = async (data) => {
  const response = await instance.delete(`/upload/delete-file`, data, config());
  if (response.data) {
    return response.data;
  }
};

export const uploadService = {
  uploadImages,
  uploadAvatar,
  deleteFile,
};
