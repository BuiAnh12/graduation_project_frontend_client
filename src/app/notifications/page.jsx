"use client";
import React, { useEffect } from "react";
import { useSocket } from "@/context/socketContext";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { notificationService } from "@/api/notificationService";
import NotificationItem from "@/components/notification/NotificationItem";
import Image from "next/image";

const page = () => {
  const { socket, notifications, setNotifications } = useSocket();

  const handleNotificationStatusChange = async (id) => {
    try {
      await notificationService.updateNotificationStatus(id);

      setNotifications((prev) => prev.map((notif) => (notif._id === id ? { ...notif, status: "read" } : notif)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='pt-[30px] pb-[100px] md:pt-[75px]'>
      <Heading title='Thông báo' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='notifications' />
      </div>

      <MobileHeader page='notifications' />

      <div className='pt-[20px] lg:w-[60%] md:w-[80%] md:mx-auto'>
        {notifications && notifications.length > 0 ? (
          <>
            {notifications
              ?.slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((notification, index) => (
                <NotificationItem
                  key={index}
                  notification={notification}
                  handleNotificationStatusChange={handleNotificationStatusChange}
                />
              ))}
          </>
        ) : (
          <div className='flex flex-col items-center text-center py-10'>
            <Image src='/assets/no_notification.png' alt='empty cart' width={150} height={150} />
            <h3 className='text-[#4A4B4D] text-2xl font-bold mt-4'>Không có thông báo nào!</h3>
          </div>
        )}
      </div>

      <div className='md:hidden'>
        <NavBar page='notifications' />
      </div>
    </div>
  );
};

export default page;
