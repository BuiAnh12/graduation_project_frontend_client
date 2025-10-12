"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const OrderItem = ({ history, order }) => {
  if (!order || !order.stores) return null;

  return (
    <div
      className="order-item flex flex-col overflow-hidden border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      data-order-id={order._id}
    >
      <Link
        href={`/store/${order.stores._id}`}
        className="flex gap-4 h-fit md:flex-col p-3 md:p-0 md:gap-2"
      >
        {/* Image */}
        <div className="relative flex flex-col gap-1 w-[70px] pt-[70px] md:w-full md:pt-[45%] md:rounded-t-lg rounded-full overflow-hidden">
          <Image
            src={order.stores.avatar?.url || "/default-store.jpg"}
            alt={order.stores.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col md:px-3 md:pb-3 max-w-[calc(100%-85px)] md:max-w-full">
          <span className="text-red-600 text-lg font-bold line-clamp-1">
            {order.stores.name}
          </span>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>{order.items.length} món</span>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            {/* Optionally re-enable address line if needed */}
            {/* <span className="truncate">{order.shipLocation?.address}</span> */}
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center border-t border-gray-200">
        {history ? (
          <>
            <button
              className="flex-1 flex justify-center p-3 hover:bg-red-50 text-red-600 font-semibold border-r border-gray-200 transition"
              onClick={() => console.log("Reorder", order._id)}
            >
              Đặt lại
            </button>
            <Link
              href={`/store/${order.stores._id}/rating/add-rating/${order._id}`}
              className="flex-1 flex justify-center p-3 hover:bg-red-50 text-red-600 font-semibold transition"
            >
              Đánh giá
            </Link>
          </>
        ) : (
          <>
            <button
              className="flex-1 flex justify-center p-3 hover:bg-red-50 text-red-600 font-semibold border-r border-gray-200 transition"
              onClick={() => console.log("Cancel order", order._id)}
            >
              Hủy đơn hàng
            </button>
            <Link
              href={`/orders/detail-order/${order._id}`}
              className="flex-1 flex justify-center p-3 hover:bg-red-50 text-red-600 font-semibold transition"
            >
              Xem tiến trình
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
