"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrderCard = ({ order }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!order) return;
    const statusMap = {
      cancelled: "Đơn hàng đã bị hủy",
      pending: "Đang chờ quán xác nhận",
      confirmed: "Quán đã xác nhận đơn hàng",
      preparing: "Quán đang chuẩn bị món ăn",
      finished: "Món ăn đã hoàn thành",
      taken: "Shipper đã lấy món ăn",
      delivering: "Đang giao đến bạn",
      delivered: "Đơn hàng đã được giao",
      done: "Đơn hàng hoàn tất",
    };
    setStatus(statusMap[order.status] || "");
  }, [order]);

  if (!order) return null;

  return (
    <Link
      href={`/orders/detail-order/${order._id}`}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-red-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-red-400 transition-all duration-300"
    >
      {/* --- Image Section --- */}
      <div className="relative w-full sm:w-32 sm:h-32 h-48 rounded-xl overflow-hidden">
        {order.items.slice(0, 4).map((item, index) => {
          const total = order.items.length;
          const imageUrl = item.dishId?.image?.url || "/assets/logo_app.png";

          let className = "absolute w-full h-full";
          if (total === 2) {
            className = `absolute w-1/2 h-full ${index === 0 ? "left-0" : "right-0"}`;
          } else if (total === 3) {
            if (index === 0) {
              className = "absolute top-0 left-0 w-full h-1/2";
            } else {
              className = `absolute bottom-0 w-1/2 h-1/2 ${index === 1 ? "left-0" : "right-0"}`;
            }
          } else if (total >= 4) {
            const pos = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"];
            className = `absolute w-1/2 h-1/2 ${pos[index]}`;
          }

          return (
            <div key={index} className={className}>
              <Image src={imageUrl} alt={item.dishName} fill className="object-cover" />
            </div>
          );
        })}
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-col justify-between flex-1 overflow-hidden">
        <div>
          <h4 className="text-red-600 text-lg font-bold line-clamp-1">{order?.stores?.name}</h4>
          <p className="text-gray-600 text-sm line-clamp-2">
            <span className="font-medium">Đã đặt:</span>{" "}
            {order.items.map((dish, index) => (
              <span key={index}>
                {dish.dishName}
                {index < order.items.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <span
            className={`text-sm font-medium ${
              order.status === "cancelled"
                ? "text-red-500"
                : order.status === "done"
                ? "text-green-500"
                : "text-orange-500"
            }`}
          >
            Trạng thái: {status}
          </span>
          <span className="text-gray-600 text-sm line-clamp-1">
            Giao tới: {order?.shipInfo?.address}
          </span>
          <span className="text-gray-800 font-semibold text-base">
            Tổng:{" "}
            <span className="text-red-600 font-bold">
              {Number(order.finalTotal).toLocaleString("vi-VN")}đ
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
