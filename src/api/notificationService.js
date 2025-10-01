import { config, instance } from "../utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllNotifications = async () => {
  return handleApiResponse(
    instance.get(`/notification/get-all-notifications`, config())
  );
};

const updateNotificationStatus = async (id) => {
  return handleApiResponse(
    instance.put(`/notification/update-notification/${id}`, null, config())
  );
};

export const notificationService = {
  getAllNotifications,
  updateNotificationStatus,
};
