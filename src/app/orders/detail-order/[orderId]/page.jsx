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
import { useOrder } from "@/context/orderContext";
import { useCart } from "@/context/cartContext";
import { useSearchParams } from "next/navigation";
// import { shippingFeeService } from "@/api/shippingFeeService";
import { toast } from "react-toastify";
// import TagRecommendationModal from "@/components/modal/TagRecommendationModal";
import TagRecommendationToast from "@/components/modal/TagRecommendationToast";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get("status");

    const { orderId } = useParams();

    const [status, setStatus] = useState("");
    const [orderDetail, setOrderDetail] = useState(null);
    const [participantBreakdown, setParticipantBreakdown] = useState(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [dishIdsForRecommendation, setDishIdsForRecommendation] = useState([]);

    const { user } = useAuth();
    const { refreshOrder } = useOrder();
    const { refreshCart } = useCart();

    const [paymentMethods, setPaymentMethods] = useState([]);
    const getOrderDetail = async () => {
        try {
            const response = await orderService.getOrderDetail(orderId);
            setOrderDetail(response.data);
            if (response.data?.items) {
                const ids = response.data.items.map(item => item.dishId?._id || item.dishId);
                setDishIdsForRecommendation(ids);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (orderDetail && dishIdsForRecommendation.length > 0) {
             setIsTagModalOpen(true);
        }
    }, [orderDetail, dishIdsForRecommendation]);

    useEffect(() => {
        if (paymentStatus === "success") {
            toast.success("Thanh toán thành công");
            // Remove `payment` param from URL without reload
            const url = new URL(window.location.href);
            url.searchParams.delete("status");
            window.history.replaceState({}, "", url);

            // if(orderDetail) { // Ensure orderDetail is loaded first
            //     setIsTagModalOpen(true);
            // }
        }
    }, [paymentStatus, 
        // orderDetail
    ]);

    useEffect(() => {
        // Ensure user is loaded before fetching
        if (orderId && user) {
            getOrderDetail();
        }
    }, [orderId, user]); // Add user as a dependency

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
                store_delivering: "Đơn hàng đang được cửa hàng vận chuyển",
                delivered: "Đơn hàng đã được giao tới nơi",
                done: "Đơn hàng được giao hoàn tất",
            };
            setStatus(statusMap[orderDetail?.status] || "");
            setPaymentMethods([
                {
                    key: "cash",
                    label: "Tiền mặt",
                    icon: "/assets/money.png",
                    isActive:
                        orderDetail?.paymentMethod !== "vnpay" ||
                        orderDetail?.paymentStatus !== "paid",
                },
                {
                    key: "vnpay",
                    label: "VNPay",
                    icon: "/assets/vnpay.jpg",
                    isActive:
                        orderDetail?.paymentMethod === "vnpay" &&
                        orderDetail?.paymentStatus === "paid",
                },
            ]);
            if (orderDetail.isGroupOrder) {
                // 1. Calculate each participant's subtotal
                const participantSubtotals = {};
                for (const item of orderDetail.items) {
                    const pid = item.participantId.toString();

                    // --- SỬA LỖI LOGIC TÍNH TOÁN Ở ĐÂY ---

                    // Tính toán lại một cách thủ công vì không tin tưởng dữ liệu
                    const dishPrice = (item.price || 0) * item.quantity;

                    // `item.toppings` ở đây là mảng đã được populate với giá của từng topping
                    // (Giả sử `orderService.getOrderDetail` đã populate `items.toppings`)
                    const toppingsPrice =
                        (item.toppings?.reduce(
                            (sum, t) => sum + (t.price || 0),
                            0
                        ) || 0) * item.quantity;

                    // Tổng tiền chính xác cho món này (bao gồm topping)
                    const itemTotal = dishPrice + toppingsPrice;

                    // --- KẾT THÚC SỬA LỖI ---

                    if (!participantSubtotals[pid]) {
                        participantSubtotals[pid] = 0;
                    }
                    participantSubtotals[pid] += itemTotal;
                }

                // Get the order's total subtotal (should match orderDetail.subtotalPrice)
                const totalSubtotal = orderDetail.subtotalPrice;
                if (totalSubtotal === 0) {
                    setParticipantBreakdown([]); // Avoid division by zero
                    return;
                }

                // 2. Map participants to their final owed amount
                const breakdown = orderDetail.participants.map((p) => {
                    const participantId = p._id.toString();
                    const subtotal = participantSubtotals[participantId] || 0;

                    // Find their % contribution
                    const contributionPercent = subtotal / totalSubtotal;

                    // Distribute fees and discounts proportionally
                    const shippingShare =
                        (orderDetail.shippingFee || 0) * contributionPercent;
                    const discountShare =
                        (orderDetail.totalDiscount || 0) * contributionPercent;

                    const finalOwes = subtotal + shippingShare - discountShare;

                    // Get participant name (handling populated userId)
                    let name = "Thành viên";

                    let userIdStr = null;

                    if (
                        p.userId &&
                        typeof p.userId === "object" &&
                        p.userId.name
                    ) {
                        name = p.userId.name;
                        userIdStr = p.userId._id.toString(); // Get populated user ID
                    } else if (p.name) {
                        name = p.name;
                        if (p.userId && typeof p.userId === "string") {
                            userIdStr = p.userId.toString(); // Get string user ID
                        }
                    }

                    return {
                        id: participantId,
                        userId: userIdStr, // Store the user ID
                        name: name,
                        finalOwes: finalOwes,
                    };
                });

                setParticipantBreakdown(breakdown);
            }
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
            } catch (error) {}
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
            } catch (error) {}
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
                await orderService.updateOrderStatus({
                    orderId,
                    data: { status: "done" },
                });
                // toast.success("Xác nhận đơn hàng thành công!");
                getOrderDetail();
                if (dishIdsForRecommendation.length > 0) {
                    setIsTagModalOpen(true);
                }
            } catch (error) {}
        }
    };

    return (
        <div className="pb-36 bg-white md:bg-white md:pt-28 min-h-screen">
            <Heading title="Chi tiết đơn hàng" description="" keywords="" />
            <div className="hidden md:block">
                <Header />
            </div>

            <TagRecommendationToast 
                isOpen={isTagModalOpen} 
                onClose={() => setIsTagModalOpen(false)} 
                dishIds={dishIdsForRecommendation}
            />

            {/* --- FIX: Corrected Auth Logic & JSX Structure --- */}
            {!orderDetail || !user ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <ThreeDot color="#fc2111" size="medium" />
                </div>
            ) : (
                (() => {
                    const isCreator = orderDetail.userId === user._id;

                    // Check if the current user is in the participants list
                    // This assumes orderDetail.participants is an array of objects
                    // where each object 'p' has a 'userId' (which can be an object or string)
                    const isParticipant = orderDetail.participants?.some(
                        (p) => {
                            if (
                                p.userId &&
                                typeof p.userId === "object" &&
                                p.userId._id
                            ) {
                                return p.userId._id === user._id;
                            }
                            if (p.userId && typeof p.userId === "string") {
                                return p.userId === user._id;
                            }
                            return false;
                        }
                    );
                    let myBill = null;
                    if (!isCreator && isParticipant && participantBreakdown) {
                        myBill = participantBreakdown.find(
                            (p) => p.userId === user._id
                        );
                    }
                    // The `users` virtual on OrderSchema should be populated with the creator's info
                    const ownerName = orderDetail.users?.name || "chủ nhóm";

                    // --- If NOT creator AND NOT participant, deny access ---
                    if (!isCreator && !isParticipant) {
                        return (
                            <div className="lg:w-[60%] md:w-[80%] md:mx-auto text-center mt-20">
                                <h3 className="text-xl text-gray-600 font-semibold">
                                    Bạn không có quyền xem đơn hàng này.
                                </h3>
                            </div>
                        );
                    }

                    // --- User is authorized, return the full page content ---
                    return (
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
                                <h3 className="text-[#333] text-2xl font-bold">
                                    Chi tiết đơn hàng
                                </h3>
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
                                                src={
                                                    orderDetail?.stores
                                                        ?.avatarImage?.url || ""
                                                }
                                                alt={
                                                    orderDetail?.stores?.name ||
                                                    ""
                                                }
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
                                                {
                                                    orderDetail?.stores
                                                        .description
                                                }
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Only show Cancel/Confirm button to the creator */}
                                    {isCreator &&
                                        orderDetail?.status === "pending" && (
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

                                    {isCreator &&
                                        orderDetail?.status ===
                                            "store_delivering" && (
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
                            <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>

                            {/* Status */}
                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <span className="text-lg font-medium block mb-2">
                                    {status}
                                </span>

                                {orderDetail?.status !== "cancelled" && (
                                    <div className="relative flex items-center justify-between py-4">
                                        <Image
                                            src={`/assets/start_active.png`}
                                            alt=""
                                            width={25}
                                            height={25}
                                        />
                                        <div
                                            className={`absolute top-[50%] left-[9%] h-[4px] w-[20%] rounded-full ${
                                                !["preorder"].includes(
                                                    orderDetail?.status
                                                )
                                                    ? "bg-[#fc6011]"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>

                                        <Image
                                            src={`/assets/cooking${
                                                [
                                                    "confirmed",
                                                    "preparing",
                                                    "finished",
                                                    "taken",
                                                    "delivering",
                                                    "store_delivering",
                                                    "delivered",
                                                    "done",
                                                ].includes(orderDetail?.status)
                                                    ? "_active"
                                                    : ""
                                            }.png`}
                                            alt=""
                                            width={25}
                                            height={25}
                                        />

                                        <div
                                            className={`absolute top-[50%] left-[40%] h-[4px] w-[20%] rounded-full ${
                                                [
                                                    "preparing",
                                                    "finished",
                                                    "taken",
                                                    "delivering",
                                                    "store_delivering",
                                                    "delivered",
                                                    "done",
                                                ].includes(orderDetail?.status)
                                                    ? "bg-[#fc6011]"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>

                                        <Image
                                            src={`/assets/delivery${
                                                [
                                                    "taken",
                                                    "delivering",
                                                    "store_delivering",
                                                    "delivered",
                                                    "done",
                                                ].includes(orderDetail?.status)
                                                    ? "_active"
                                                    : ""
                                            }.png`}
                                            alt=""
                                            width={25}
                                            height={25}
                                        />

                                        <div
                                            className={`absolute top-[50%] right-[10%] h-[4px] w-[20%] rounded-full ${
                                                [
                                                    "delivering",
                                                    "delivered",
                                                    "done",
                                                ].includes(orderDetail?.status)
                                                    ? "bg-[#fc6011]"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>

                                        <Image
                                            src={`/assets/home${
                                                ["done", "delivered"].includes(
                                                    orderDetail?.status
                                                )
                                                    ? "_active"
                                                    : ""
                                            }.png`}
                                            alt=""
                                            width={25}
                                            height={25}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ===== DELIVERY INFO ===== */}
                            <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
                                <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                    Giao tới
                                </h3>
                                {[
                                    {
                                        icon: "/assets/account.png",
                                        value: orderDetail?.shipInfo
                                            ?.contactName || orderDetail?.users?.name
                                    },
                                    {
                                        icon: "/assets/phone.png",
                                        value: orderDetail?.shipInfo
                                            ?.contactPhonenumber || orderDetail?.users?.phonenumber
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
                                <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                    Thông tin thanh toán
                                </h3>
                                {(() => {
                                    const selected = paymentMethods.find(
                                        (pm) => pm.isActive
                                    );
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
                                <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                    Ưu đãi
                                </h3>
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
                                                    {
                                                        voucher.voucherId
                                                            .description
                                                    }
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
                            <div className="mt-2 p-2 bg-transparent"></div>

                            <OrderSummary
                                detailItems={orderDetail?.items}
                                subtotalPrice={orderDetail?.subtotalPrice}
                                shippingFee={orderDetail?.shippingFee}
                                totalDiscount={orderDetail?.totalDiscount}
                                isReadOnly={true}
                            />
                            {orderDetail.isGroupOrder && (
                                <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
                                    <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                        Chi tiết món ăn theo người đặt
                                    </h3>
                                    <div className="space-y-6">
                                        {orderDetail.participants.map((p) => {
                                            const participantItems =
                                                orderDetail.items.filter(
                                                    (item) =>
                                                        item.participantId.toString() ===
                                                        p._id.toString()
                                                );

                                            const participantName =
                                                p.userId &&
                                                typeof p.userId === "object" &&
                                                p.userId.name
                                                    ? p.userId.name
                                                    : p.name || "Thành viên";
                                            const participantAvatar =
                                                p.userId &&
                                                typeof p.userId === "object" &&
                                                p.userId.profileImage
                                                    ? p.userId.profileImage
                                                          .url ||
                                                      "/assets/avatar_default.png"
                                                    : "/assets/avatar_default.png";

                                            return (
                                                <div
                                                    key={p._id}
                                                    className="border-t pt-4 first:border-t-0"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Image
                                                            src={
                                                                participantAvatar
                                                            }
                                                            alt={
                                                                participantName
                                                            }
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full"
                                                        />
                                                        <span className="font-semibold text-gray-800">
                                                            {participantName}{" "}
                                                            {p.userId?._id ===
                                                                user._id &&
                                                                "(Bạn)"}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-3 pl-10">
                                                        {participantItems.length >
                                                        0 ? (
                                                            participantItems.map(
                                                                (item) => (
                                                                    <div
                                                                        key={
                                                                            item._id
                                                                        }
                                                                        className="text-sm"
                                                                    >
                                                                        <span className="font-semibold">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                            x
                                                                        </span>{" "}
                                                                        {
                                                                            item.dishName
                                                                        }
                                                                        {item
                                                                            .toppings
                                                                            ?.length >
                                                                            0 && (
                                                                            <div className="pl-4 text-xs text-gray-500">
                                                                                {item.toppings.map(
                                                                                    (
                                                                                        t,
                                                                                        idx
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                t._id ||
                                                                                                idx
                                                                                            }
                                                                                        >
                                                                                            +{" "}
                                                                                            {
                                                                                                t.toppingName
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {item.note && (
                                                                            <p className="text-xs text-gray-500 italic">
                                                                                Ghi
                                                                                chú:{" "}
                                                                                {
                                                                                    item.note
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="text-sm text-gray-400 italic">
                                                                Không có món ăn
                                                                nào.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ===== PARTICIPANT PAYMENT (Conditional) ===== */}

                            {/* --- Show "What I Owe" if I am a PARTICIPANT --- */}
                            {orderDetail.isGroupOrder &&
                                !isCreator &&
                                myBill && (
                                    <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
                                        <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                            Thanh toán của bạn
                                        </h3>
                                        <p className="text-gray-700 text-base md:text-lg">
                                            Bạn phải trả{" "}
                                            <span className="text-xl md:text-xl font-bold text-[#fc2111]">
                                                {Math.round(
                                                    myBill.finalOwes
                                                ).toLocaleString("vi-VN")}
                                                đ
                                            </span>{" "}
                                            cho
                                            <span className="font-bold">
                                                {" "}
                                                {ownerName}
                                            </span>
                                            .
                                        </p>
                                    </div>
                                )}

                            {/* --- Show full breakdown *only* if I am the CREATOR --- */}
                            {orderDetail.isGroupOrder &&
                                isCreator &&
                                participantBreakdown && (
                                    <div className="bg-white mt-6 p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
                                        <h3 className="text-[#fc2111] text-xl font-bold mb-4">
                                            Chi tiết thanh toán (Chủ nhóm)
                                        </h3>
                                        <div className="space-y-2">
                                            {participantBreakdown.map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <span className="text-gray-700">
                                                        {p.name}{" "}
                                                        {p.userId ===
                                                            user._id && "(Bạn)"}
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        {Math.round(
                                                            p.finalOwes
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        đ
                                                    </span>
                                                </div>
                                            ))}

                                            <div className="pt-2"></div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                <span className="text-gray-900 text-lg font-bold">
                                                    Tổng cộng
                                                </span>
                                                <span className="text-[#fc2111] text-lg font-bold">
                                                    {orderDetail.finalTotal.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* ===== ACTION BUTTONS ===== */}
                            {/* Only show action buttons to the creator */}
                            {isCreator && (
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
                                                className="flex items-center justify-center w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white font-semibold shadow-md hover:shadow-lg hover:scale-101 transition-all"
                                            >
                                                Đánh giá đơn hàng
                                            </Link>
                                            <button
                                                onClick={confirmReOrder}
                                                className="w-full px-6 py-3 rounded-lg border border-[#fc2111] text-[#fc2111] font-semibold bg-white shadow-md hover:bg-[#fff4ef] hover:scale-101 transition-all"
                                            >
                                                Đặt lại đơn hàng
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()
            )}
        </div>
    );
};

export default Page;
