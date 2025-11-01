import { config, instance } from "../utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllNotifications = async () => {
  return handleApiResponse(
    instance.get(`/notification/get-all-notifications`, config()),
    { showToast: false }
  );
};

const updateNotificationStatus = async (id) => {
  return handleApiResponse(
    instance.put(`/notification/update-notification/${id}`, null, config()),
    { showToast: false}
  );
};

export const notificationService = {
  getAllNotifications,
  updateNotificationStatus,
};
