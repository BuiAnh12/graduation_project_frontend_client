"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useOrder } from "@/context/orderContext";
import OrderCard from "@/components/order/OrderCard";
import { ThreeDot } from "react-loading-indicators";
import Image from "next/image";

const Page = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current"); // "current" | "history"

  const { order, loading } = useOrder();

  useEffect(() => {
    setCurrentOrders(order?.filter((o) => o.status !== "done"));
    setDoneOrders(order?.filter((o) => o.status === "done"));
  }, [order]);

  const renderOrders = (orders, isHistory) => {
    return orders.map((o) => <OrderCard key={o._id} order={o} history={isHistory} />);
  };

  return (
    <div className='pt-[10px] pb-[100px] md:pt-[90px] md:px-0'>
      <Heading title='Đơn hàng' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='orders' />
      </div>

      <MobileHeader />

      {/* Tabs */}
      <div className='px-[20px] md:w-[90%] md:mx-auto'>
        <div className='flex items-center justify-center mb-6 bg-gray-100 rounded-full p-1'>
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "current" ? "bg-[#fc6011] text-white shadow-md" : "text-gray-600 hover:text-[#fc6011]"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Hiện tại
          </button>
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "history" ? "bg-[#fc6011] text-white shadow-md" : "text-gray-600 hover:text-[#fc6011]"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "current" &&
          (() => {
            if (loading) {
              return (
                <div className='w-full h-screen flex items-center justify-center'>
                  <ThreeDot color='#fc6011' size='medium' text='' textColor='' />
                </div>
              );
            }

            if (!currentOrders || currentOrders.length === 0) {
              return (
                <div className='flex flex-col items-center text-center py-10'>
                  <Image src='/assets/no_order.jfif' alt='empty cart' width={150} height={150} />
                  <h3 className='text-[#4A4B4D] text-2xl font-bold mt-4'>Đơn hàng hiện tại trống</h3>
                  <p className='text-gray-500 mt-2'>Hãy chọn vài món ăn ngon ngay nào!</p>
                  <button
                    onClick={() => router.push("/search")}
                    className='mt-5 px-6 py-3 bg-[#fc6011] text-white rounded-full shadow hover:scale-105 transition-transform'
                  >
                    Mua sắm ngay
                  </button>
                </div>
              );
            }

            return (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]'>
                {renderOrders(currentOrders, false)}
              </div>
            );
          })()}

        {activeTab === "history" &&
          (() => {
            if (loading) {
              return (
                <div className='w-full h-screen flex items-center justify-center'>
                  <ThreeDot color='#fc6011' size='medium' text='' textColor='' />
                </div>
              );
            }

            if (!doneOrders || doneOrders.length === 0) {
              return (
                <div className='flex flex-col items-center text-center py-10'>
                  <Image
                    src='data:image/jpeg;base64,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'
                    alt='empty cart'
                    width={150}
                    height={150}
                  />
                  <h3 className='text-[#4A4B4D] text-2xl font-bold mt-4'>Lịch sử đơn hàng trống</h3>
                </div>
              );
            }

            return (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]'>
                {renderOrders(doneOrders, false)}
              </div>
            );
          })()}
      </div>

      <div className='block md:hidden'>
        <NavBar page='orders' />
      </div>
    </div>
  );
};

export default Page;
