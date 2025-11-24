"use client";
import { React, useState} from "react";
import { useSocket } from "@/context/socketContext";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { notificationService } from "@/api/notificationService";
import NotificationItem from "@/components/notification/NotificationItem";
import Image from "next/image";
import { ThreeDot } from "react-loading-indicators";

const NotificationPage = () => {
  const { notifications, setNotifications } = useSocket();
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const [isMarking, setIsMarking] = useState(false);
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

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setIsMarking(true);
    try {
      await notificationService.markAllAsRead();
      
      // Update local state immediately so badges disappear
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, status: "read" }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setIsMarking(false);
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
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Tất cả thông báo
          </h3>
          
          {/* Only show button if there are unread notifications */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isMarking}
              className="text-sm text-[#fc2111] font-medium hover:text-[#d91b0e] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
            >
              {isMarking ? (
                 <ThreeDot color="#fc2111" size="small" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Đánh dấu đã đọc tất cả
                </>
              )}
            </button>
          )}
        </div>
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
