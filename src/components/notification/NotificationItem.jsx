import moment from "moment";
import Link from "next/link";
import React from "react";

const NotificationItem = ({ notification, handleNotificationStatusChange }) => {
  const isRead = notification.status === "read";

  return (
    <Link
      href={`/orders/detail-order/${notification.orderId}`}
      onClick={() => handleNotificationStatusChange(notification._id)}
      className={`flex items-start gap-4 p-4 mb-[2px] rounded-lg transition-all duration-200 
        ${isRead ? "bg-white hover:bg-gray-50" : "bg-orange-50 hover:bg-orange-100"}
      `}
    >
      {/* Chấm trạng thái */}
      <div
        className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 
          ${isRead ? "bg-gray-300" : "bg-orange-500"}
        `}
      />

      {/* Nội dung */}
      <div className='flex flex-col gap-1 overflow-hidden'>
        {/* Tiêu đề */}
        <p
          className={`font-semibold text-base line-clamp-1 
            ${isRead ? "text-gray-500" : "text-gray-900"}
          `}
        >
          {notification.title}
        </p>

        {/* Tin nhắn */}
        <p
          className={`text-sm line-clamp-2 
            ${isRead ? "text-gray-400" : "text-gray-700"}
          `}
        >
          {notification.message}
        </p>

        {/* Thời gian */}
        <p
          className={`text-xs 
            ${isRead ? "text-gray-400" : "text-gray-500"}
          `}
        >
          {moment(notification.createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>
    </Link>
  );
};

export default NotificationItem;
