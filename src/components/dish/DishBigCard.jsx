"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService";
import { useAuth } from "@/context/authContext";
import PreferenceTags from "@/components/dish/PreferenceTags";

// --- DishBigCard Component ---
const DishBigCard = ({
    dish,
    storeInfo,
    cartItems,
    onAddToCartShowSimilar,
    allTags,
    storeCart,
}) => {
    const router = useRouter();
    const { user, userId } = useAuth();
    const { refreshCart } = useCart();

    const cartItem = useMemo(() => {
        // Check if cartItems is valid before trying to use .find()
        if (!cartItems || !Array.isArray(cartItems) || !dish?._id) {
            return null;
        }
        // Find the item matching the current dish's ID
        return cartItems.find(
            (item) =>
                item?.dishId?._id === dish?._id &&
                item?.participantId?.userId?._id === userId
        );
    }, [cartItems, dish]);

    const handleChangeQuantity = async (amount) => {
        if (storeInfo?.openStatus === "closed") {
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
                    let response;
                    const isGroup = storeCart && storeCart?.mode === "group";
                    if (isGroup) {
                        response = await cartService.upsertGroupCartItem({
                            cartId: storeCart._id,
                            dishId: dish._id,
                            quantity: newQuantity,
                            toppings: [],
                            action: "add_item",
                        });
                    } else {
                        response = await cartService.updateCart({
                            storeId: storeInfo?._id,
                            dishId: dish._id,
                            action: "update_item",
                            quantity: newQuantity,
                        });
                    }
                    if (response.success) {
                        refreshCart();
                        // toast.success("Cập nhật giỏ hàng thành công");
                        if (
                            currentQuantity < newQuantity &&
                            newQuantity >= 1 &&
                            onAddToCartShowSimilar
                        ) {
                            onAddToCartShowSimilar(dish._id);
                        }
                    } else {
                        if (response.errorCode == "NOT_ENOUGH_STOCK") {
                            // toast.error("Món đặt đã hết, xin vui lòng chọn món khác");
                        } else {
                            // toast.error(response.errorMessage);
                        }
                    }
                } catch (error) {
                    console.error(error);
                    // toast.error(error?.data?.message || "Có lỗi xảy ra!");
                }
            }
        } else {
            // toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
        }
    };

    const isDisabled =
        storeInfo?.openStatus === "closed" ||
        dish?.stockStatus === "out_of_stock" ||
        dish?.suitability === "prohibit";

    const suitabilityStyles = {
        suitable: "border-transparent",
        warning: "border-yellow-400 border-2",
        prohibit: "border-red-500 border-2 opacity-60",
    };

    const cardStyle =
        suitabilityStyles[dish?.suitability] || "border-transparent";

    return (
        // --- 1. STYLES MOVED HERE ---
        <div
            className={`relative group transition-transform duration-300 hover:scale-[1.02] 
        bg-white rounded-2xl shadow-lg hover:shadow-2xl 
        ${cardStyle}
      `}
        >
            {/* Overlay trạng thái cửa hàng */}
            {isDisabled && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                    <span className="text-white text-base font-semibold px-4 text-center">
                        {dish?.suitability === "prohibit"
                            ? "Không phù hợp (Dị ứng)"
                            : storeInfo?.openStatus === "closed"
                            ? "Cửa hàng hiện đang đóng"
                            : "Món ăn hiện không còn phục vụ"}
                    </span>
                </div>
            )}

            {/* --- 2. LINK CLASSNAME FIXED --- */}
            <Link
                href={`/store/${dish.storeId}/dish/${dish._id}`}
                name="storeCard"
                className={`${isDisabled ? "pointer-events-none" : ""}`}
            >
                {/* --- Image Container --- */}
                <div className="relative flex flex-col gap-2 pt-[75%] w-full rounded-t-2xl overflow-hidden">
                    {/* --- 3. IMAGE TAG RE-ADDED --- */}
                    <Image
                        src={dish?.image?.url || "/assets/default-dish.png"}
                        alt={dish?.name || "Dish"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Nút giỏ hàng */}
                    {!isDisabled && (
                        <>
                            {cartItem?.quantity > 0 ? (
                                <div className="absolute bottom-3 right-3 flex items-center bg-white gap-2 border border-red-500 rounded-full px-3 py-1 shadow-lg z-10">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleChangeQuantity(-1);
                                        }}
                                        className="text-red-600 text-xl font-bold hover:scale-110 transition"
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
                                        }}
                                        className="text-red-600 text-xl font-bold hover:scale-110 transition"
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
                                    className="absolute bottom-3 right-3 bg-red-600 text-white rounded-full w-[42px] h-[42px] flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition"
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
                        </>
                    )}
                </div>

                {/* Thông tin món ăn */}
                <div className="mt-3 p-3">
                    <h4 className="text-gray-900 text-lg font-semibold truncate transition">
                        {dish?.name}
                    </h4>
                    {dish?.description && (
                        <p className="text-gray-500 text-sm truncate">
                            {dish?.description}
                        </p>
                    )}

                    {/* Preference Tags */}
                    {dish?.suitability === "suitable" &&
                        dish.preferenceMatches?.like?.length > 0 && (
                            <PreferenceTags
                                ids={dish.preferenceMatches.like}
                                allTags={allTags}
                                type="like"
                            />
                        )}
                    {dish?.suitability === "warning" && (
                        <PreferenceTags
                            ids={dish.preferenceMatches.warning}
                            allTags={allTags}
                            type="warning"
                        />
                    )}
                    {dish?.suitability === "prohibit" && (
                        <PreferenceTags
                            ids={dish.preferenceMatches.allergy}
                            allTags={allTags}
                            type="allergy"
                        />
                    )}

                    <p className="text-red-600 font-bold mt-1 text-[17px]">
                        {Number(dish?.price).toLocaleString("vi-VN")}đ
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default DishBigCard;
