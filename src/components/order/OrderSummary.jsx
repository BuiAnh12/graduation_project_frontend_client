"use client";
import React from "react";
import Image from "next/image"; // For potential remove icon
import { reportService } from "@/api/reportService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// Add onRemoveTopping prop, remove onRemoveItem
const OrderSummary = ({
  detailItems,
  subtotalPrice,
  shippingFee,
  orderId, 
  storeId,
  totalDiscount,
  onUpdateQuantity, 
  onRemoveTopping,
  isReadOnly = false, 
  orderStatus
}) => {
  const handleReportDish = async (dishItem) => {
    try {
      // 1. Fetch danh sách lý do từ API trước khi mở Modal
      // Hiển thị loading nhẹ nếu cần, hoặc để Swal tự xử lý delay
      const res = await reportService.getAllReasons();
      
      // Kiểm tra dữ liệu trả về (tùy format response của bạn: res.data hoặc res)
      const reasons = res.data || []; 

      if (!reasons.length) {
        toast.error("Không tải được danh sách lý do báo cáo.");
        return;
      }

      // 2. Tạo HTML Options từ dữ liệu API
      const optionsHtml = reasons.map(r => 
        `<option value="${r._id}">${r.name}</option>`
      ).join('');

      // 3. Hiển thị Modal
      const { value: formValues } = await Swal.fire({
        title: `<h3 class="text-xl font-bold text-gray-800">Báo cáo món: ${dishItem.dishName}</h3>`,
        html: `
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Lý do báo cáo:</label>
            <select id="report-reason" class="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 mb-3">
              <option value="" disabled selected>-- Chọn lý do --</option>
              ${optionsHtml} </select>
            
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Chi tiết (Bắt buộc nếu chọn lý do 'Khác'):
            </label>
            <textarea id="report-note" class="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" rows="3" placeholder="Mô tả chi tiết vấn đề..."></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Gửi báo cáo',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#fc2111',
        focusConfirm: false,
        showLoaderOnConfirm: true, // Hiển thị loading khi bấm nút gửi
        preConfirm: async () => {
          const reasonId = document.getElementById('report-reason').value;
          const note = document.getElementById('report-note').value;
          
          if (!reasonId) {
            Swal.showValidationMessage('Vui lòng chọn lý do báo cáo');
            return false;
          }

          // Kiểm tra logic 'Khác' ở client (tùy chọn, backend đã check rồi)
          // Tìm object reason tương ứng để check thuộc tính 'other'
          const selectedReason = reasons.find(r => r._id === reasonId);
          if (selectedReason?.other && !note.trim()) {
             Swal.showValidationMessage('Vui lòng nhập chi tiết cho lý do này');
             return false;
          }
          
          // Trả về dữ liệu để xử lý tiếp
          return { reasonId, note };
        }
      });

      // 4. Gọi API tạo báo cáo nếu người dùng bấm Gửi
      if (formValues) {
        const payload = {
          orderId: orderId,
          storeId: storeId,
          dishId: dishItem.dishId._id || dishItem.dishId,
          reasonId: formValues.reasonId, // Đây là ObjectId thật từ DB
          note: formValues.note
        };

        const createRes = await reportService.createReport(payload);

        // if (createRes.success) {
        //     await Swal.fire({
        //     icon: 'success',
        //     title: 'Đã gửi báo cáo!',
        //     text: 'Cảm ơn phản hồi của bạn.',
        //     confirmButtonColor: '#fc2111',
        //     });
        // } else {
        //     // Xử lý lỗi từ backend trả về (ví dụ: đã báo cáo rồi)
        //     toast.error(createRes.message || "Gửi báo cáo thất bại");
        // }
      }

    } catch (error) {
      console.error(error);
      // Nếu backend trả về lỗi trùng lặp (400), hiển thị thông báo
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 border border-red-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-[#fc2111] text-xl font-bold">Tóm tắt đơn hàng</span>
      </div>

      {/* Dish list */}
      <div className="flex flex-col gap-4 mt-4">
        {detailItems &&
          detailItems.map((item, index) => {
            const dishId = item.dishId?._id || item.dishId;
            const itemId = item._id; // CartItem ID
            const dishBasePrice = item.price || item.dishId?.price || 0;
            const totalDishPrice = dishBasePrice * item.quantity;

            return (
              <div
                className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 items-start"
                key={itemId || index}
                name="cartItems"
              >
                {/* --- Quantity Controls --- */}
                <div className="flex flex-col items-center gap-1 w-10 flex-shrink-0 pt-1">
                  <button
                    onClick={() => onUpdateQuantity(dishId, (item.quantity || 0) + 1, item.toppings, item.note)}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition active:scale-95"
                    aria-label="Increase quantity"
                    hidden={isReadOnly}
                  >
                    +
                  </button>
                  <span className="text-gray-800 font-semibold text-lg" name="quantity">
                    x{item.quantity}
                  </span>
                  <button
                    // When quantity hits 0, backend handles removal
                    onClick={() => onUpdateQuantity(dishId, Math.max(0, (item.quantity || 0) - 1), item.toppings, item.note)}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 transition active:scale-95"
                    aria-label="Decrease quantity"
                    hidden={isReadOnly}
                  >
                    -
                  </button>
                </div>

                {/* --- Dish Details (Left Side) --- */}
                <div className="flex-1 flex flex-col mr-2">
                  <h3 className="text-gray-800 text-base md:text-lg font-semibold line-clamp-2" name="dishName">
                    {item?.dishName || item?.dishId?.name}
                    
                  </h3>
                  {isReadOnly && orderStatus && orderStatus == 'done' && (
                          <button 
                            onClick={() => handleReportDish(item)}
                            className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-sm"
                            title="Báo cáo vấn đề về món ăn này"
                          >
                              <span className="font-bold text-xs">!</span>
                          </button>
                      )}
                  {/* Toppings with Remove Buttons */}
                  {item.toppings?.length > 0 &&
                    item.toppings.map((topping, tIdx) => (
                      // Use flex to align the 'x' button and the topping name/price
                      <div key={topping._id || tIdx} className="flex items-center mt-0.5">
                        {/* Topping Remove Button (replaces the '+') */}
                        <button
                          onClick={() => onRemoveTopping(itemId, topping.toppingId._id)}
                          className="mr-1 text-red-500 hover:text-red-700 font-bold leading-none text-xl w-4 h-4 flex items-center justify-center rounded-full transition" // Added size, centering, hover bg
                          aria-label={`Remove ${topping.toppingName}`}
                          hidden={isReadOnly}
                        >
                          &times; {/* The 'x' character */}
                        </button>
                        {/* Topping Name and Price */}
                        <span className="text-gray-500 text-sm" name="toppingName">
                          {topping.toppingName}
                        </span>
                        {/* Removed the separate button from the end */}
                      </div>
                    ))}

                  {/* Note */}
                  {item.note && (
                    <p className="text-gray-500 text-sm italic mt-1" name="note">
                      Ghi chú: {item.note}
                    </p>
                  )}
                </div>

                {/* --- Price Details (Right Side) --- */}
                <div className="flex flex-col items-end text-right flex-shrink-0 w-24"> {/* Fixed width for alignment */}
                  {/* Total Dish Price */}
                  <span className="text-gray-800 font-medium whitespace-nowrap" name="dishPrice">
                    {Number(totalDishPrice).toLocaleString("vi-VN")}đ
                  </span>

                  {/* Individual Topping Prices */}
                  {item.toppings?.length > 0 &&
                    item.toppings.map((topping, tIdx) => (
                      <span
                        key={topping._id || tIdx}
                        className="text-gray-500 text-sm whitespace-nowrap"
                        name="toppingPrice"
                      >
                         {/* Show price per topping * quantity */}
                        {Number(topping.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    ))}
                    {/* No total item price needed here as it's implied */}
                </div>
                 {/* --- REMOVED Trash Button --- */}
              </div>
            );
          })}
      </div>

      {/* Totals */}
      <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
        {/* ... (Subtotal, Discount, Shipping Fee, Grand Total - No changes needed) ... */}
         {subtotalPrice > 0 && (
              <div className="flex items-center justify-between text-gray-700">
                <span>Tổng tạm tính</span>
                <span>{Number(subtotalPrice.toFixed(0)).toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            {totalDiscount > 0 && (
                 <div className="flex items-center justify-between text-gray-700">
                     <span>Giảm giá</span>
                     <span className="text-[#fc2111]">
                         -{Number(totalDiscount.toFixed(0)).toLocaleString("vi-VN")}đ
                     </span>
                 </div>
            )}
            {shippingFee > 0 && (
                 <div className="flex items-center justify-between text-gray-700">
                     <span>Phí vận chuyển</span>
                     <span>{Number(shippingFee.toFixed(0)).toLocaleString("vi-VN")}đ</span>
                 </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                 <span className="text-gray-900 text-lg font-bold">Tổng cộng</span>
                 <span className="text-[#fc2111] text-lg font-bold">
                     {Number((subtotalPrice - totalDiscount + shippingFee).toFixed(0)).toLocaleString("vi-VN")}đ
                 </span>
            </div>
      </div>
    </div>
  );
};

export default OrderSummary;