import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getCurrentUser = async (id) => {
  return handleApiResponse(instance.get(`/user/${id}`, config()));
};

const updateUser = async (data) => {
  return handleApiResponse(instance.put(`/user/`, data, config()));
};



const getAllTags = async () => {
  return handleApiResponse(instance.get(`/reference/all`, config()));
};


const getUserReference = async () => {
  return handleApiResponse(instance.get(`/reference`, config()));
};

const updateUserReference = async (data) => {
  return handleApiResponse(instance.put(`/reference`, data, config()));
};

const deleteUserReference = async (data) => {
  return handleApiResponse(instance.delete(`/reference`, { data, ...config() }));
};

export const userService = {
  getCurrentUser,
  updateUser,
  getAllTags,
  getUserReference,
  updateUserReference,
  deleteUserReference
};
