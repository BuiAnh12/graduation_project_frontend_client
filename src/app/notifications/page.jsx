"use client";
import React from "react";
import { useSocket } from "@/context/socketContext";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { notificationService } from "@/api/notificationService";
import NotificationItem from "@/components/notification/NotificationItem";
import Image from "next/image";

const NotificationPage = () => {
  const { notifications, setNotifications } = useSocket();

  const handleNotificationStatusChange = async (id) => {
    try {
      await notificationService.updateNotificationStatus(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: "read" } : notif
        )
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const sortedNotifications = notifications
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="pt-[30px] pb-[100px] md:pt-[75px] min-h-screen bg-gray-50">
      {/* SEO / Meta */}
      <Heading title="Thông báo" description="" keywords="" />

      {/* Header */}
      <div className="hidden md:block">
        <Header page="notifications" />
      </div>
      <MobileHeader page="notifications" />

      {/* Notifications List */}
      <div className="pt-6 lg:w-[60%] md:w-[80%] md:mx-auto px-4 md:px-0">
        {sortedNotifications && sortedNotifications.length > 0 ? (
          <div className="space-y-4">
            {sortedNotifications.map((notification, index) => (
              <NotificationItem
                key={index}
                notification={notification}
                handleNotificationStatusChange={handleNotificationStatusChange}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white shadow-sm rounded-2xl">
            <Image
              src="/assets/no_notification.png"
              alt="empty notification"
              width={160}
              height={160}
              className="opacity-80"
            />
            <h3 className="text-[#fc2111] text-2xl font-bold mt-4">
              Không có thông báo nào!
            </h3>
            <p className="text-gray-500 text-base mt-2 max-w-[300px]">
              Bạn sẽ thấy thông báo mới tại đây khi có hoạt động từ cửa hàng
              hoặc đơn hàng của bạn.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navbar (Mobile Only) */}
      <div className="md:hidden">
        <NavBar page="notifications" />
      </div>
    </div>
  );
};

export default NotificationPage;
