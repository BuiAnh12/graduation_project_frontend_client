import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getLocationDetail = async (id) => {
  return handleApiResponse(instance.get(`/location/get-location/${id}`, config()), { showToast: false });
};

const getUserLocations = async () => {
  return handleApiResponse(instance.get(`/location/get-user-locations`, config()), { showToast: false });
};

const addLocation = async (data) => {
  return handleApiResponse(instance.post(`/location/add-location`, data, config()),{successMessage:'Thêm địa chỉ thành công'}); // show toast
};

const updateLocation = async ({ id, data }) => {
  return handleApiResponse(instance.put(`/location/update-location/${id}`, data, config()), {successMessage:'Cập nhật địa chỉ thành công'}); // show toast
};

const deleteLocation = async (id) => {
  return handleApiResponse(instance.delete(`/location/delete-location/${id}`, config()), {successMessage:'Xóa địa chỉ thành công'}); // show toast
};

export const locationService = {
  getLocationDetail,
  getUserLocations,
  addLocation,
  updateLocation,
  deleteLocation,
};
