import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getCurrentUser = async (id) => {
  return handleApiResponse(instance.get(`/user/${id}`, config()));
};

const updateUser = async (data) => {
  return handleApiResponse(instance.put(`/user/`, data, config()));
};

export const userService = {
  getCurrentUser,
  updateUser,
};
