"use client";
import React from "react";
import Image from "next/image"; // For potential remove icon

// Add onRemoveTopping prop, remove onRemoveItem
const OrderSummary = ({
  detailItems,
  subtotalPrice,
  shippingFee,
  totalDiscount,
  onUpdateQuantity, 
  onRemoveTopping,
  isReadOnly = false, 
}) => {
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
                    onClick={() => onUpdateQuantity(dishId, (item.quantity || 0) + 1)}
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
                    onClick={() => onUpdateQuantity(dishId, Math.max(0, (item.quantity || 0) - 1))}
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