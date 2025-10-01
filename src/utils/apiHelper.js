import ErrorCode from "@/constants/ErrorCode";

export const handleApiResponse = async (promise) => {
  try {
    const response = await promise;

    // Success response (backend should set success=true)
    if (response.data && response.data.success) {
      return response.data;
    }

    // Backend returned success=false but still 200
    return {
      success: false,
      errorCode: response.data?.errorCode || ErrorCode.INVALID_REQUEST.code,
      errorMessage: response.data?.errorMessage || ErrorCode.INVALID_REQUEST.message,
      message: response.data?.message || ErrorCode.INVALID_REQUEST.message,
      meta: {
        status: response.status || ErrorCode.INVALID_REQUEST.status,
      },
      ...response.data,
    };
  } catch (error) {
    if (error.response?.data) {
      const resData = error.response.data;
      return {
        success: false,
        errorCode: resData.errorCode || ErrorCode.INTERNAL_SERVER_ERROR.code,
        errorMessage: resData.errorMessage || ErrorCode.INTERNAL_SERVER_ERROR.message,
        message: resData.message || ErrorCode.INTERNAL_SERVER_ERROR.message,
        meta: {
          status: error.response.status || ErrorCode.INTERNAL_SERVER_ERROR.status,
        },
        ...resData,
      };
    }

    // Network or unexpected error
    return {
      success: false,
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR.code,
      errorMessage: error.message || ErrorCode.INTERNAL_SERVER_ERROR.message,
      message: ErrorCode.INTERNAL_SERVER_ERROR.message,
      meta: {
        status: 500,
      },
    };
  }
};
