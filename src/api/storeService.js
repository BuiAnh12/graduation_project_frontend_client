import { instance } from "@/utils/axiosConfig";

const getAllStore = async ({ keyword, category, sort, limit, page, lat, lon }) => {
  const response = await instance.get(`/store/all`, {
    params: { keyword, category, sort, limit, page, lat, lon },
  });

  if (response.data) {
    return response.data;
  }
};

const getStoreInformation = async (id) => {
  const response = await instance.get(`/store/${id}`);
  if (response.data) {
    return response.data;
  }
};

export const storeService = {
  getAllStore,
  getStoreInformation,
};
