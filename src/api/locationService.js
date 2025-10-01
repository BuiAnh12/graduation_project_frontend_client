import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getLocationDetail = async (id) => {
  return handleApiResponse(instance.get(`/location/get-location/${id}`, config()));
};

const getUserLocations = async () => {
  return handleApiResponse(instance.get(`/location/get-user-locations`, config()));
};

const addLocation = async (data) => {
  return handleApiResponse(instance.post(`/location/add-location`, data, config()));
};

const updateLocation = async ({ id, data }) => {
  return handleApiResponse(instance.put(`/location/update-location/${id}`, data, config()));
};

const deleteLocation = async (id) => {
  return handleApiResponse(instance.delete(`/location/delete-location/${id}`, config()));
};

export const locationService = {
  getLocationDetail,
  getUserLocations,
  addLocation,
  updateLocation,
  deleteLocation,
};
