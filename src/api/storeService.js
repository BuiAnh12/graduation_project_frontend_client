import { instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllStore = async ({ keyword, category, sort, limit, page, lat, lon }) => {
  return handleApiResponse(
    instance.get(`/store/all`, {
      params: { keyword, category, sort, limit, page, lat, lon },
    })
  );
};

const getStoreInformation = async (id) => {
  return handleApiResponse(instance.get(`/store/${id}`));
};

export const storeService = {
  getAllStore,
  getStoreInformation,
};
