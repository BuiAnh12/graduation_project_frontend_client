"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import OrderSummary from "@/components/order/OrderSummary";
import { orderService } from "@/api/orderService";
import { useAuth } from "@/context/authContext";
import { ThreeDot } from "react-loading-indicators";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useOrder } from "@/context/orderContext";
import { useCart } from "@/context/cartContext";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const { orderId } = useParams();

  const [status, setStatus] = useState("");
  const [orderDetail, setOrderDetail] = useState(null);

  const { user } = useAuth();
  const { refreshOrder } = useOrder();
  const { refreshCart } = useCart();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const getOrderDetail = async () => {
    try {
      const response = await orderService.getOrderDetail(orderId);
      setOrderDetail(response.data);
      setPaymentMethods([
        {
          key: "cash",
          label: "Tiền mặt",
          icon: "/assets/money.png",
          isActive: orderDetail?.paymentMethod !== "vnpay" || orderDetail?.paymentStatus !== "paid",
        },
        {
          key: "vnpay",
          label: "VNPay",
          icon: "/assets/vnpay.jpg",
          isActive: orderDetail?.paymentMethod === "vnpay" && orderDetail?.paymentStatus === "paid",
        },
      ])
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      // toast.success("Thanh toán thành công");
      // Remove `payment` param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      window.history.replaceState({}, "", url);
    }
  }, [paymentStatus]);

  useEffect(() => {
    getOrderDetail();
    console.log(orderDetail);
  }, []);



  useEffect(() => {
    if (orderDetail) {
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
      setStatus(statusMap[orderDetail?.status] || "");
    }
  }, [orderDetail]);

  const confirmCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn hủy đơn hàng?",
      text: "Đơn hàng sẽ không thể khôi phục sau khi hủy.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await orderService.cancelOrder(orderId);
        // toast.success("Hủy đơn hàng thành công!");
        refreshOrder();
        router.push("/orders");
      } catch (error) { }
    }
  };

  const confirmReOrder = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn đặt lại không?",
      text: "Khi đặt lại giỏ hàng hiện tại của bạn sẽ bị thay thế.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đặt lại",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await orderService.reOrder(orderId);
        // toast.success("Đặt lại đơn hàng thành công!");
        refreshCart();
        router.push(`/store/${orderDetail.storeId}/cart/`);
      } catch (error) { }
    }
  };

  const confirmTakeOrder = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xác nhận đơn hàng không?",
      text: "Khi xác nhận, đơn hàng sẽ được đánh dấu là đã hoàn tất",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await orderService.updateOrderStatus({ orderId, data: { status: "done" } });
        // toast.success("Xác nhận đơn hàng thành công!");
        getOrderDetail();
      } catch (error) { }
    }
  };

  return (
    <div className="pb-36 bg-white md:bg-white md:pt-28 min-h-screen">
      <Heading title="Chi tiết đơn hàng" description="" keywords="" />
      <div className="hidden md:block">
        <Header />
      </div>

      {!orderDetail ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ThreeDot color="#fc2111" size="medium" />
        </div>
      ) : orderDetail?.userId !== user._id ? (
        <div className="lg:w-[60%] md:w-[80%] md:mx-auto text-center mt-20">
          <h3 className="text-xl text-gray-600 font-semibold">
            Đơn hàng thuộc tài khoản khác
          </h3>
        </div>
      ) : (
        <div className="lg:w-[60%] md:w-[80%] md:mx-auto mt-5">
          {/* Mobile Header */}
          <div className="flex items-center gap-4 px-5 pt-5 md:hidden">
            <Image
              src="/assets/arrow_left_long.png"
              alt=""
              width={40}
              height={40}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
              onClick={() => router.back()}
            />
            <h3 className="text-[#333] text-2xl font-bold">Chi tiết đơn hàng</h3>
          </div>

          {/* ===== STORE INFO ===== */}
          <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm mt-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Link
                  href={`/store/${orderDetail?.stores._id}`}
                  className="relative w-[70px] h-[70px] overflow-hidden rounded-xl shadow hover:scale-105 transition-transform"
                >
                  <Image
                    src={orderDetail?.stores?.avatarImage?.url || ""}
                    alt={orderDetail?.stores?.name || ""}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </Link>
                <Link
                  href={`/store/${orderDetail?.stores._id}`}
                  className="flex flex-col gap-1 group"
                >
                  <span className="text-[#333] text-xl font-bold group-hover:text-[#fc2111] transition-colors">
                    {orderDetail?.stores.name}
                  </span>
                  <span className="text-gray-500 text-sm line-clamp-1">
                    {orderDetail?.stores.description}
                  </span>
                </Link>
              </div>

              {orderDetail?.status === "pending" && (
                <button
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white font-semibold shadow-md hover:scale-105 transition"
                  onClick={confirmCancelOrder}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Hủy đơn hàng
                </button>
              )}

              {orderDetail?.status === "delivering" && (
                <button
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white font-semibold shadow-md hover:scale-105 transition"
                  onClick={confirmTakeOrder}
                >
                  Xác nhận đơn hàng
                </button>
              )}
            </div>
          </div>

                {/* Divider */}
                <div className='h-[6px] w-full bg-transparent my-4 rounded-full'></div>

                {/* Status */}
                <div className='bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition'>
                  <span className='text-[#333] text-lg font-medium block mb-2'>{status}</span>

                  {orderDetail?.status !== "cancelled" && (
                    <div className='relative flex items-center justify-between py-4'>
                      <Image src={`/assets/start_active.png`} alt='' width={25} height={25} />
                      <div
                        className={`absolute top-[50%] left-[9%] h-[4px] w-[20%] rounded-full ${!["preorder"].includes(orderDetail?.status) ? "bg-[#fc6011]" : "bg-gray-300"
                          }`}
                      ></div>

                      <Image
                        src={`/assets/cooking${["confirmed", "preparing", "finished", "taken", "delivering", "delivered", "done"].includes(
                          orderDetail?.status
                        )
                          ? "_active"
                          : ""
                          }.png`}
                        alt=''
                        width={25}
                        height={25}
                      />

                      <div
                        className={`absolute top-[50%] left-[40%] h-[4px] w-[20%] rounded-full ${["preparing", "finished", "taken", "delivering", "delivered", "done"].includes(
                          orderDetail?.status
                        )
                          ? "bg-[#fc6011]"
                          : "bg-gray-300"
                          }`}
                      ></div>

                      <Image
                        src={`/assets/delivery${["taken", "delivering", "delivered", "done"].includes(orderDetail?.status) ? "_active" : ""
                          }.png`}
                        alt=''
                        width={25}
                        height={25}
                      />

                      <div
                        className={`absolute top-[50%] right-[10%] h-[4px] w-[20%] rounded-full ${["delivering", "delivered", "done"].includes(orderDetail?.status)
                          ? "bg-[#fc6011]"
                          : "bg-gray-300"
                          }`}
                      ></div>

                      <Image
                        src={`/assets/home${["done", "delivered"].includes(orderDetail?.status) ? "_active" : ""}.png`}
                        alt=''
                        width={25}
                        height={25}
                      />
                    </div>
                  )}
                </div>

          {/* ===== DELIVERY INFO ===== */}
          <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <h3 className="text-[#333] text-lg font-bold mb-4">Giao tới</h3>
            {[
              {
                icon: "/assets/account.png",
                value: orderDetail?.shipInfo?.contactName,
              },
              {
                icon: "/assets/phone.png",
                value: orderDetail?.shipInfo?.contactPhonenumber,
              },
              {
                icon: "/assets/location.png",
                value: orderDetail?.shipInfo?.address,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex items-center bg-gray-50 text-gray-600 rounded-xl border border-gray-200 overflow-hidden mb-3"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <input
                  type="text"
                  readOnly
                  value={item.value}
                  className="bg-gray-50 text-base py-2 pr-3 pl-9 w-full"
                />
              </div>
            ))}
          </div>

          {/* ===== PAYMENT INFO ===== */}
          <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <h3 className="text-[#333] text-lg font-bold mb-4">
              Thông tin thanh toán
            </h3>
            {(() => {
              const selected = paymentMethods.find((pm) => pm.isActive);
              return (
                selected && (
                  <div className="flex gap-4 items-center">
                    <div className="relative w-7 h-7">
                      <Image
                        src={selected.icon}
                        alt={selected.label}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <span className="text-[#333] text-lg font-semibold">
                      {selected.label}
                    </span>
                    <Image
                      src="/assets/button_active.png"
                      alt={selected.label}
                      width={20}
                      height={20}
                    />
                  </div>
                )
              );
            })()}
          </div>

          {/* ===== VOUCHERS ===== */}
          <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
            <h3 className="text-[#4A4B4D] text-lg font-bold mb-3">Ưu đãi</h3>
            {orderDetail.vouchers.length > 0 ? (
              <div className="space-y-3">
                {orderDetail.vouchers.map((voucher) => (
                  <div
                    key={voucher._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#fc2111] bg-[#fff5f0]"
                  >
                    <span className="font-medium text-[#4A4B4D]">
                      {voucher.voucherId.code}
                    </span>
                    <span className="text-sm text-gray-500">
                      {voucher.voucherId.description}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Chưa có ưu đãi nào được chọn
              </p>
            )}
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="mt-2 p-2 bg-transparent">
            
          </div>

          <OrderSummary
              detailItems={orderDetail?.items}
              subtotalPrice={orderDetail?.subtotalPrice}
              shippingFee={orderDetail?.shippingFee}
              totalDiscount={orderDetail?.totalDiscount}
            />

          {/* ===== ACTION BUTTONS ===== */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-end">
            {orderDetail?.status === "pending" && (
              <button
                onClick={confirmCancelOrder}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                Hủy đơn hàng
              </button>
            )}

            {orderDetail?.status === "done" && (
              <>
                <Link
                  href={`/store/${orderDetail.storeId}/rating/add-rating/${orderId}`}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  Đánh giá đơn hàng
                </Link>
                <button
                  onClick={confirmReOrder}
                  className="w-full px-6 py-3 rounded-lg border border-[#fc2111] text-[#fc2111] font-semibold bg-white shadow-md hover:bg-[#fff4ef] hover:scale-105 transition-all"
                >
                  Đặt lại đơn hàng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
