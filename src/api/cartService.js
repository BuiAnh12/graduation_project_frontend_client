import { config, instance } from "@/utils/axiosConfig";
import { handleApiResponse } from "@/utils/apiHelper";

const getUserCart = async () => {
  return handleApiResponse(instance.get(`/cart`, config()), { showToast: false });
};

const getDetailCart = async (cartId) => {
  return handleApiResponse(instance.get(`/cart/${cartId}`, config()), { showToast: false });
};

const updateCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/update`, data, config()), {successMessage:'Cập nhật giỏ hàng thành công'}); // show toast
};

const completeCart = async (data) => {
  return handleApiResponse(instance.post(`/cart/complete`, data, config()), {successMessage:'Đặt đơn hàng thành công'}); // show toast
};

const clearCartItem = async (storeId) => {
  return handleApiResponse(instance.delete(`/cart/clear/item/${storeId}`, config()), {successMessage:'Xóa các món trong giỏ hàng thành công'}); // show toast
};

const clearCart = async () => {
  return handleApiResponse(instance.delete(`/cart/clear`, config()), {successMessage:'Xóa tất cả giỏ hàng thành công'}); // show toast
};

// --- Group Cart Lifecycle ---

const enableGroupCart = async (data) => {
  // data = { storeId: "..." }
  return handleApiResponse(instance.patch('/cart/group/enable', data, config()), { 
    successMessage: 'Đã bật giỏ hàng nhóm' 
  });
};

const joinGroupCart = async (privateToken) => {
  return handleApiResponse(instance.post(`/cart/join/${privateToken}`, {}, config()), { 
    successMessage: 'Tham gia giỏ hàng thành công' 
  });
};

const getGroupCart = async (cartId) => {
  return handleApiResponse(instance.get(`/cart/group/${cartId}`, config()), { 
    showToast: false 
  });
};

const lockGroupCart = async (cartId) => {
  return handleApiResponse(instance.patch(`/cart/group/${cartId}/lock`, {}, config()), { 
    successMessage: 'Đã khóa giỏ hàng' 
  });
};

const unlockGroupCart = async (cartId) => {
  return handleApiResponse(instance.patch(`/cart/group/${cartId}/unlock`, {}, config()), { 
    successMessage: 'Đã mở khóa giỏ hàng' 
  });
};

const completeGroupCart = async (cartId, data) => {
  return handleApiResponse(instance.post(`/cart/group/${cartId}/complete`, data, config()), { 
    successMessage: 'Đặt hàng nhóm thành công' 
  });
};

const deleteGroupCart = async (cartId) => {
  return handleApiResponse(instance.delete(`/cart/group/${cartId}`, config()), { 
    successMessage: 'Đã xóa giỏ hàng nhóm' 
  });
};

// --- Group Cart Item Management ---

const upsertGroupCartItem = async (data) => {
  // data = { cartId, dishId, itemId, quantity, toppings, note, action }
  return handleApiResponse(instance.post(`/cart/group/upsert`, data, config()), {
    successMessage: "Cập nhật giỏ hàng thành công",
  });
};

// --- Group Cart Participant Management ---

const leaveGroupCart = async (cartId) => {
  return handleApiResponse(instance.post(`/cart/group/${cartId}/leave`, {}, config()), { 
    successMessage: 'Bạn đã rời khỏi giỏ hàng' 
  });
};

const removeParticipant = async (cartId, participantId) => {
  return handleApiResponse(instance.delete(`/cart/group/${cartId}/participant/${participantId}`, config()), { 
    successMessage: 'Đã xóa thành viên khỏi nhóm' 
  });
};

export const cartService = {
  // Private
  getUserCart,
  getDetailCart,
  updateCart,
  completeCart,
  clearCartItem,
  clearCart,
  // Group
  enableGroupCart,
  joinGroupCart,
  getGroupCart,
  lockGroupCart,
  unlockGroupCart,
  completeGroupCart,
  deleteGroupCart,
  upsertGroupCartItem,
  leaveGroupCart,
  removeParticipant,
};
