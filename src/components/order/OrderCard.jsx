import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrderCard = ({ order }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!order) return;
    const statusMap = {
      cancelled: "Đơn hàng đã bị hủy",
      pending: "Đơn hàng đang chờ quán xác nhận",
      confirmed: "Quán đã xác nhận đơn hàng",
      preparing: "Quán đang chuẩn bị món ăn",
      finished: "Món ăn đã hoàn thành",
      taken: "Shipper đã lấy món ăn",
      delivering: "Shipper đang vận chuyển đến chỗ bạn",
      delivered: "Đơn hàng đã được giao tới nơi",
      done: "Đơn hàng được giao hoàn tất",
    };
    setStatus(statusMap[order.status] || "");
  }, [order]);

  console.log(order);

  return (
    <Link
      href={`/orders/detail-order/${order._id}`}
      className='flex gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
    >
      {/* Ảnh món ăn động theo số lượng món */}
      <div className='relative w-32 h-32 rounded-xl overflow-hidden'>
        {order.items.slice(0, 4).map((item, index) => {
          const total = order.items.length;
          const imageUrl = item.dish?.image?.url || "/assets/logo_app.png";

          let className = "absolute w-full h-full"; // default for 1
          if (total === 2) {
            className = `absolute w-24 h-24 rounded-md ${
              index === 0 ? "top-0 left-0 z-0" : "bottom-0 right-0 z-10 shadow-md"
            }`;
          } else if (total === 3) {
            if (index === 0) {
              className = "absolute top-0 left-0 w-full h-1/2";
            } else {
              className = `absolute bottom-0 w-1/2 h-1/2 ${index === 1 ? "left-0" : "right-0"}`;
            }
          } else if (total >= 4) {
            const positions = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"];
            className = `absolute w-1/2 h-1/2 ${positions[index]}`;
          }

          return (
            <div key={index} className={className}>
              <Image src={imageUrl} alt={item.dishName} fill className='object-cover rounded-sm' />
            </div>
          );
        })}
      </div>

      {/* Nội dung */}
      <div className='flex flex-col justify-between flex-1 overflow-hidden'>
        <h4 className='text-gray-800 text-lg font-bold line-clamp-1'>{order.store.name}</h4>
        <span className='text-gray-600 text-sm line-clamp-1'>
          Đã đặt:{" "}
          {order.items.map((dish, index) => (
            <span key={index}>
              {dish.dishName}
              {index < order.items.length - 1 ? ", " : ""}
            </span>
          ))}
        </span>
        <span
          className={`text-sm font-medium truncate ${
            order.status === "cancelled"
              ? "text-red-500"
              : order.status === "done"
              ? "text-green-500"
              : "text-orange-500"
          }`}
        >
          Trạng thái: {status}
        </span>
        <span className='text-gray-600 text-sm line-clamp-1'>Giao tới: {order?.shipInfo?.address}</span>
        <span className='text-gray-800 font-semibold text-base'>
          Đơn giá: {Number(order.finalTotal).toLocaleString("vi-VN")}đ
        </span>
      </div>
    </Link>
  );
};

export default OrderCard;
