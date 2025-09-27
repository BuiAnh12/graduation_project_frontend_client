import { config, instance } from "@/utils/axiosConfig";

const getCurrentUser = async (id) => {
  const response = await instance.get(`/user/${id}`, config());

  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
  const response = await instance.put(`/user/`, data, config());
  if (response.data) {
    return response.data;
  }
};

export const userService = {
  getCurrentUser,
  updateUser,
};
