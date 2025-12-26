import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getAllReasons = async () => {
    return handleApiResponse(instance.get(`/report/reason`, config()), { showToast: false }); // no toast
};
const createReport = async (payload) => {
    return handleApiResponse(instance.post(`/report`, payload, config()), { successMessage: 'Gửi báo cáo thành công' }); // no toast
};
export const reportService = {
    getAllReasons,
    createReport
};