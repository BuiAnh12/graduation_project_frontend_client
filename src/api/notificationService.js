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

const markAllAsRead = async () => {
  return handleApiResponse(
    instance.put(`/notification/mark-all-read`, null, config()),
    { showToast: true, successMessage: "Đã đánh dấu tất cả là đã đọc" }
  );
};

export const notificationService = {
  getAllNotifications,
  updateNotificationStatus,
  markAllAsRead
};
