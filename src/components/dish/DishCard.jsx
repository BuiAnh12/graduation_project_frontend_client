"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService";
import { useAuth } from "@/context/authContext";

const DishCard = ({ dish, storeInfo, cartItems, onAddToCartShowSimilar }) => {
    const router = useRouter();
    const [cartItem, setCartItem] = useState(null);
    const { user } = useAuth();
    const { refreshCart } = useCart();

    useEffect(() => {
        if (cartItems && Array.isArray(cartItems) && dish?._id) {
            // Added checks
            setCartItem(
                cartItems.find((item) => item?.dishId?._id === dish?._id)
            );
        } else {
            setCartItem(null); // Ensure it resets if cartItems is empty/invalid
        }
    }, [cartItems, dish]);

    const handleChangeQuantity = async (amount) => {
        if (storeInfo?.openStatus === "CLOSED") {
            toast.warn("Món ăn đã hết hàng. Vui lòng chọn món khác.");
            return;
        }

        if (user) {
            if (dish?.toppingGroups?.length > 0) {
                router.push(`/store/${storeInfo?._id}/dish/${dish._id}`);
            } else {
                try {
                    const currentQuantity = cartItem?.quantity || 0;
                    const newQuantity = Math.max(currentQuantity + amount, 0);
                    await cartService.updateCart({
                        storeId: storeInfo?._id,
                        dishId: dish._id,
                        quantity: newQuantity,
                        action: "update_item"
                    });
                    refreshCart();
                    toast.success("Cập nhật giỏ hàng thành công");
                    if (
                        currentQuantity < newQuantity &&
                        newQuantity >= 1 &&
                        onAddToCartShowSimilar
                    ) {
                        onAddToCartShowSimilar(dish._id);
                    }
                } catch (error) {
                    toast.error(error?.data?.message || "Có lỗi xảy ra!");
                }
            }
        } else {
            toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
        }
    };

    return (
        <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
            {/* Overlay trạng thái cửa hàng */}
            {(storeInfo?.openStatus === "CLOSED" ||
                dish?.stockStatus === "OUT_OF_STOCK") && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                    <span className="text-white text-base font-semibold px-4 text-center">
                        {storeInfo?.openStatus === "CLOSED"
                            ? "Cửa hàng hiện đang đóng"
                            : "Món ăn hiện không còn phục vụ"}
                    </span>
                </div>
            )}

            {/* Nội dung chính */}
            <Link
                href={`/store/${dish.storeId}/dish/${dish._id}`}
                name="storeCard"
                className={`flex gap-4 items-start p-3 rounded-2xl bg-white shadow-md hover:shadow-xl hover:border hover:border-red-500 transition-all duration-300 ${
                    storeInfo?.openStatus === "CLOSED"
                        ? "pointer-events-none"
                        : ""
                }`}
            >
                {/* Hình ảnh món ăn */}
                {dish?.image?.url && (
                    <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
                        <Image
                            src={dish.image.url}
                            alt={dish?.name || "Dish"}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Nội dung món ăn */}
                <div className="flex flex-col flex-1">
                    <h4 className="text-gray-900 text-lg font-semibold line-clamp-1 group-hover:text-red-600 transition">
                        {dish?.name}
                    </h4>
                    {dish?.description && (
                        <p className="text-gray-500 text-sm line-clamp-1">
                            {dish?.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-red-600 font-bold text-base">
                            {Number(dish?.price).toLocaleString("vi-VN")}đ
                        </span>

                        {/* Nút giỏ hàng */}
                        {cartItem?.quantity > 0 ? (
                            <div className="flex items-center bg-white border border-red-500 rounded-full px-2 py-1 shadow-md gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChangeQuantity(-1);
                                        e.stopPropagation();
                                    }}
                                    className="text-red-600 text-lg font-bold hover:scale-110 transition"
                                >
                                    −
                                </button>
                                <span className="text-gray-800 text-lg font-semibold w-[30px] text-center">
                                    {cartItem?.quantity}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChangeQuantity(1);
                                        e.stopPropagation();
                                    }}
                                    className="text-red-600 text-lg font-bold hover:scale-110 transition"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChangeQuantity(1);
                                }}
                                className="bg-red-600 text-white rounded-full w-[40px] h-[40px] flex items-center justify-center shadow-md hover:bg-red-700 hover:scale-110 transition"
                            >
                                <Image
                                    src="/assets/plus_white.png"
                                    alt="add"
                                    width={20}
                                    height={20}
                                    className=""
                                />
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default DishCard;
