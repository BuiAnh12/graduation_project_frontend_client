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
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Page = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const { order, loading } = useOrder();
  const router = useRouter();

  useEffect(() => {
    setCurrentOrders(order?.filter((o) => o.status !== "done"));
    setDoneOrders(order?.filter((o) => o.status === "done"));
  }, [order]);

  const renderOrders = (orders, isHistory) =>
    orders.map((o) => <OrderCard key={o._id} order={o} history={isHistory} />);

  const EmptyState = ({ title, desc }) => (
    <div className="flex flex-col items-center text-center py-10 px-5">
      <Image
        src="/assets/no_order.jfif"
        alt="no orders"
        width={160}
        height={160}
        className="rounded-lg shadow-sm"
      />
      <h3 className="text-[#4A4B4D] text-2xl font-bold mt-4">{title}</h3>
      <p className="text-gray-500 mt-2 max-w-[320px]">{desc}</p>
      <button
        onClick={() => router.push("/search")}
        className="mt-5 px-6 py-3 bg-[#fc2111] text-white rounded-full font-semibold shadow hover:scale-105 hover:shadow-md transition-transform duration-200"
      >
        Mua sắm ngay
      </button>
    </div>
  );

  const LoadingState = () => (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <ThreeDot color="#fc2111" size="medium" text="" textColor="" />
    </div>
  );

  return (
    <div className="pt-[10px] pb-[100px] md:pt-[90px] md:px-0 bg-[#fafafa] min-h-screen transition-all">
      <Heading title="Đơn hàng" description="" keywords="" />

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header page="orders" />
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      {/* Tabs */}
      <div className="px-[20px] md:w-[90%] md:mx-auto mt-4">
        <div className="flex items-center justify-center mb-6 bg-gray-100 rounded-full p-1 sticky top-[70px] z-10 shadow-sm md:top-[90px]">
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "current"
                ? "bg-[#fc2111] text-white shadow-md"
                : "text-gray-600 hover:text-[#fc2111]"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Hiện tại
          </button>
          <button
            className={`flex-1 text-center py-2 text-lg font-semibold rounded-full transition-all duration-300 ${
              activeTab === "history"
                ? "bg-[#fc2111] text-white shadow-md"
                : "text-gray-600 hover:text-[#fc2111]"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử
          </button>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          {activeTab === "current" && (
            <motion.div
              key="current"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <LoadingState />
              ) : !currentOrders || currentOrders.length === 0 ? (
                <EmptyState
                  title="Đơn hàng hiện tại trống"
                  desc="Hãy chọn vài món ăn ngon ngay nào!"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]">
                  {renderOrders(currentOrders, false)}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <LoadingState />
              ) : !doneOrders || doneOrders.length === 0 ? (
                <EmptyState
                  title="Lịch sử đơn hàng trống"
                  desc="Bạn chưa có đơn hàng nào trong quá khứ."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[20px]">
                  {renderOrders(doneOrders, true)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden">
        <NavBar page="orders" />
      </div>
    </div>
  );
};

export default Page;
