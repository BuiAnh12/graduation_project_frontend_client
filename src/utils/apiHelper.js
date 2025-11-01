import ErrorMessages from "@/constants/ErrorMessages";
import ErrorCode from "@/constants/ErrorCode";
import { toast } from "react-toastify";

export const handleApiResponse = async (promise, options = {}) => {
  const { showToast = true, successMessage } = options;

  try {
    const response = await promise;
    const data = response.data || {};
    console.log("data", data)
    
    if (data.success) {
      const message =
        successMessage ||
        data.message ||
        "Thao tác thành công";

      if (showToast) toast.success(message);
      return data;
    }

   
    const errorCode = data.errorCode || ErrorCode.INVALID_REQUEST.code;
    const localizedMessage =
      ErrorMessages[errorCode] || data.message || ErrorCode.INVALID_REQUEST.message;

    const errorResponse = {
      success: false,
      errorCode,
      errorMessage: localizedMessage,
      message: localizedMessage,
      meta: {
        status: response.status || ErrorCode.INVALID_REQUEST.status,
      },
      ...data,
    };

    if (showToast) toast.error(localizedMessage);
    return errorResponse;
  } catch (error) {
    console.log("error", error)
    // ❌ Network or server error
    const resData = error.response?.data || {};
    const errorCode = resData.errorCode || ErrorCode.INTERNAL_SERVER_ERROR.code;
    const localizedMessage =
      ErrorMessages[errorCode] ||
      resData.message ||
      error.message ||
      ErrorCode.INTERNAL_SERVER_ERROR.message;

    const errorResponse = {
      success: false,
      errorCode,
      errorMessage: localizedMessage,
      message: localizedMessage,
      meta: {
        status: error.response?.status || ErrorCode.INTERNAL_SERVER_ERROR.status,
      },
      ...resData,
    };

    if (showToast) toast.error(localizedMessage);
    return errorResponse;
  }
};
