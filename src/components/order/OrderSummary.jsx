import React from "react";

const OrderSummary = ({ detailItems, subtotalPrice, shippingFee, totalDiscount }) => {
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
            const dishBasePrice = item.price || item.dishId?.price || 0;

            return (
              <div
                className="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
                key={item._id || index}
                name="cartItems"
              >
                {/* Quantity box */}
                <div className="p-2 rounded-lg border border-[#fc2111]/40 w-10 h-10 flex items-center justify-center bg-[#fff6f5]">
                  <span className="text-[#fc2111] font-semibold" name="quantity">
                    {item.quantity}x
                  </span>
                </div>

                {/* Dish details */}
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-gray-800 text-base md:text-lg font-semibold line-clamp-1" name="dishName">
                      {item?.dishName || item?.dishId?.name}
                    </h3>

                    {/* Toppings */}
                    {item.toppings?.length > 0 &&
                      item.toppings.map((topping, tIdx) => (
                        <p key={topping._id || tIdx} className="text-gray-500 text-sm" name="toppingName">
                          + {topping.toppingName}
                        </p>
                      ))}

                    {/* Note */}
                    {item.note && (
                      <p className="text-gray-500 text-sm italic" name="note">
                        Ghi chú: {item.note}
                      </p>
                    )}
                  </div>

                  {/* Prices */}
                  <div className="flex flex-col items-end text-right">
                    <span className="text-gray-800 font-medium" name="dishPrice">
                      {Number(dishBasePrice).toLocaleString("vi-VN")}đ
                    </span>

                    {item.toppings?.length > 0 &&
                      item.toppings.map((topping, tIdx) => (
                        <span
                          key={topping._id || tIdx}
                          className="text-gray-500 text-sm"
                          name="toppingPrice"
                        >
                          {Number(topping.price).toLocaleString("vi-VN")}đ
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Totals */}
      <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
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

        {/* Grand total */}
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
