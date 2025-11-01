const ErrorMessages = {
  // Common
  INTERNAL_SERVER_ERROR: "Đã xảy ra lỗi, vui lòng thử lại sau.",
  INVALID_KEY: "Khóa không hợp lệ cho thao tác này.",
  INVALID_REQUEST: "Yêu cầu không hợp lệ.",

  // Auth / Account
  MISSING_REQUIRED_FIELDS: "Vui lòng nhập đầy đủ các trường bắt buộc.",
  EMAIL_EXISTS: "Email đã tồn tại.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  ACCOUNT_NOT_FOUND: "Không tìm thấy tài khoản.",
  ACCOUNT_ALREADY_EXISTED: "Tài khoản đã tồn tại.",
  ACCOUNT_BLOCKED: "Tài khoản của bạn đã bị khóa.",
  ACCESS_TOKEN_NOT_FOUND: "Không tìm thấy token đăng nhập.",
  ACCESS_TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
  INVALID_REFRESH_TOKEN: "Token làm mới không hợp lệ hoặc không tồn tại.",
  REFRESH_TOKEN_EXPIRE: "Token đã hết hạn, vui lòng đăng nhập lại.",
  ENTITY_NOT_SUPPORTED: "Loại đăng nhập không được hỗ trợ.",
  ENTITY_NOT_FOUND: "Email hoặc mật khẩu không đúng.",
  INVALID_OTP: "Mã OTP không hợp lệ hoặc đã hết hạn.",
  OTP_EXPIRED: "Mã OTP không hợp lệ hoặc đã hết hạn.",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng.",

  // Cart
  CART_NOT_FOUND: "Không tìm thấy giỏ hàng.",
  CART_EMPTY: "Giỏ hàng trống.",
  NOT_ENOUGH_STOCK: "Số lượng sản phẩm không đủ.",
  VOUCHER_INVALID: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
  USER_CART_MISSMATCH: "Người dùng không hợp lệ cho giỏ hàng này.",
  ALREADY_IN_CART: "Món này đã có trong giỏ hàng.",
  NOT_PARTICIPANT: "Không phải thành viên của giỏ hàng này.",
  USER_REFERENCE_NOT_FOUND: "Không tìm thấy thông tin tham chiếu người dùng.",
  USER_REFERENCE_UPDATE_FAILED: "Cập nhật thông tin tham chiếu thất bại.",

  // Order
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
  ORDER_STATUS_ALREADY_SET: "Trạng thái đơn hàng đã được thiết lập.",
  INVALID_STATUS_TRANSITION: "Không thể chuyển sang trạng thái này.",
  ORDER_EMPTY_ITEMS: "Đơn hàng không có món ăn.",
  ORDER_INVALID_ITEM: "Món trong đơn hàng không hợp lệ.",
  ORDER_HAS_OUT_OF_STOCK: "Một số món trong đơn hàng đã hết hàng.",
  ORDER_CANCEL_UNAUTHORIZED: "Bạn không có quyền hủy đơn hàng này.",
  ORDER_CANNOT_CANCEL_STATUS: "Không thể hủy đơn hàng ở trạng thái hiện tại.",
  INVALID_ORDER_STATUS: "Trạng thái đơn hàng không hợp lệ.",
  ORDER_ALREADY_TAKEN: "Đơn hàng đã được nhận.",
  UNAUTHORIZED_SHIPPER: "Shipper không hợp lệ.",

  // Dish
  DISH_NOT_FOUND: "Không tìm thấy món ăn.",

  // Admin
  ADMIN_NOT_FOUND: "Không tìm thấy quản trị viên.",

  // Payment
  INVALID_SIGNATURE: "Chữ ký không hợp lệ.",

  // User
  USER_NOT_FOUND: "Không tìm thấy người dùng.",

  // Store
  STORE_NOT_FOUND: "Không tìm thấy cửa hàng.",
  STORE_PENDING: "Cửa hàng đang chờ phê duyệt.",
  STORE_BLOCKED: "Cửa hàng đã bị khóa.",
  STORE_NOT_FOUND_FOR_USER: "Người dùng chưa có cửa hàng.",
  INVALID_STORE_STATUS: "Trạng thái cửa hàng không hợp lệ.",
  INVALID_STATUS_TO_CHANGE: "Trạng thái không hợp lệ để thay đổi.",

  // Staff
  STAFF_NOT_FOUND: "Không tìm thấy nhân viên.",

  // Voucher
  VOUCHER_NOT_FOUND: "Không tìm thấy mã giảm giá.",
  VOUCHER_CODE_EXISTS: "Mã giảm giá đã tồn tại.",

  // Upload
  NO_FILE_UPLOADED: "Chưa tải lên tệp nào.",
  NO_FILES_UPLOADED: "Chưa tải lên tệp nào.",
  FILE_DELETE_FAILED: "Xóa tệp thất bại.",
  FILE_NOT_FOUND: "Không tìm thấy tệp.",

  // Favorite
  FAVORITE_NOT_FOUND: "Không tìm thấy danh sách yêu thích.",
  STORE_ALREADY_IN_FAVORITE: "Cửa hàng đã có trong danh sách yêu thích.",

  // Rating
  RATING_NOT_FOUND: "Không tìm thấy đánh giá.",
  ALREADY_RATED: "Bạn đã đánh giá đơn hàng này rồi.",
  INVALID_RATING_VALUE: "Giá trị đánh giá phải từ 1 đến 5.",
  RATING_CONTENT_REQUIRED: "Vui lòng nhập bình luận hoặc hình ảnh.",
  INVALID_REPLY: "Phản hồi không hợp lệ.",

  // System Category
  SYSTEM_CATEGORY_NOT_FOUND: "Không tìm thấy loại thức ăn.",
  SYSTEM_CATEGORY_ALREADY_EXISTS: "Loại thức ăn đã tồn tại.",
  INVALID_SYSTEM_CATEGORY_NAME: "Tên loại thức ăn không hợp lệ.",
  INVALID_SYSTEM_CATEGORY_IMAGE: "Ảnh loại thức ăn không hợp lệ.",
  CAN_NOT_DELETE_SYSTEM_CATEGORY: "Không thể xóa loại thức ăn này.",

  // Notification
  NOTIFICATION_NOT_FOUND: "Không tìm thấy thông báo.",

  // Location
  LOCATION_NOT_FOUND: "Không tìm thấy địa chỉ.",
  LOCATION_DUPLICATE_TYPE: "Bạn chỉ có thể có một địa chỉ cho mỗi loại (nhà hoặc công ty).",
  LOCATION_USER_REQUIRED: "Thiếu mã người dùng cho địa chỉ.",

  // Shipping Fee
  FEE_TOO_HIGH: "Phí giao hàng quá cao.",
  DUPLICATE_FROM_DISTANCE: "Mức phí này đã tồn tại.",
  SHIPPING_FEE_NOT_FOUND: "Không tìm thấy mức phí.",
  CANNOT_DELETE_ZERO_STEP: "Không thể xóa bước có giá trị 0.",

  // Category
  CATEGORY_NOT_FOUND: "Không tìm thấy danh mục.",
  INVALID_CATEGORY_NAME: "Tên danh mục không hợp lệ.",
  INVALID_STORE_ID: "Mã cửa hàng không hợp lệ.",
  CATEGORY_ALREADY_EXISTS: "Danh mục đã tồn tại.",
  CATEGORY_IN_USE: "Không thể xóa vì danh mục đang chứa món ăn.",

  // Topping Group
  TOPPING_GROUP_NOT_FOUND: "Không tìm thấy nhóm topping.",
  INVALID_TOPPING_GROUP: "Nhóm topping không hợp lệ.",
  TOPPING_GROUP_ALREADY_EXISTS: "Nhóm topping đã tồn tại.",
  CAN_NOT_DELETE_TOPPING_GROUP: "Không thể xóa nhóm topping này.",

  // Topping
  TOPPING_NOT_FOUND: "Không tìm thấy topping.",
  INVALID_TOPPING: "Topping không hợp lệ.",

  // AI / Prediction
  AI_IMAGE_REQUIRED: "Vui lòng tải lên hình ảnh để dự đoán.",
  AI_SERVER_CONNECTION_FAILED: "Kết nối đến máy chủ AI thất bại.",
  AI_PREDICTION_FAILED: "Không thể tạo dự đoán thẻ.",
  AI_RECOMMENDATION_FAILED: "Không thể tạo gợi ý món ăn.",
  AI_SIMILAR_DISH_FAILED: "Không thể tìm món tương tự.",
  AI_BEHAVIOR_TEST_FAILED: "Không thể xử lý yêu cầu kiểm thử hành vi.",

  // Tags
  COOKING_METHOD_TAG_NOT_FOUND: "Không tìm thấy thẻ phương pháp nấu.",
  CULTURE_TAG_NOT_FOUND: "Không tìm thấy thẻ văn hóa.",
  FOOD_TAG_NOT_FOUND: "Không tìm thấy thẻ món ăn.",
  TASTE_TAG_NOT_FOUND: "Không tìm thấy thẻ vị giác.",

  // Statistics
  INVALID_DATE_INPUT: "Ngày nhập không hợp lệ.",
  INVALID_DATE_RANGE: "Khoảng thời gian không hợp lệ.",

  // Shipper
  SHIPPER_NOT_FOUND: "Không tìm thấy shipper.",
  SHIPPER_ALREADY_BLOCKED: "Tài khoản shipper đã bị khóa.",
  SHIPPER_ALREADY_ACTIVE: "Tài khoản shipper đã được kích hoạt.",
  CURRENT_PASSWORD_INCORRECT: "Mật khẩu cũ không chính xác.",

  // Reference
  TAG_FETCH_FAILED: "Không thể tải dữ liệu thẻ.",

  // AI Pretrain / Operation
  OPERATION_LOCKED: "Tác vụ đang bị khóa.",
  AI_SERVICE_ERROR: "Dịch vụ AI đang gặp sự cố.",
  AI_OPERATION_FAILED: "Thao tác AI thất bại.",

  // Fallback
  DEFAULT: "Đã xảy ra lỗi, vui lòng thử lại.",
};

module.exports = ErrorMessages;