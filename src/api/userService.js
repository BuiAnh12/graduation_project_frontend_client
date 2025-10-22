import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getCurrentUser = async (id) => {
  return handleApiResponse(instance.get(`/user/${id}`, config()));
};

const updateUser = async (data) => {
  return handleApiResponse(instance.put(`/user/`, data, config()));
};


const getAllTags = async (data) => {
  return handleApiResponse(instance.put(`/reference/all`, data, config()));
};

const getUserReference = async (data) => {
  return handleApiResponse(instance.put(`/reference/`, data, config()));
};

const updateUserReference = async (data) => {
  return handleApiResponse(instance.put(`/reference/`, data, config()));
};

const deleteUserReference = async (data) => {
  return handleApiResponse(instance.put(`/reference/`, data, config()));
};
export const userService = {
  getCurrentUser,
  updateUser,
};
