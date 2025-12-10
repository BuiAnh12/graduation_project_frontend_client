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

const DishCard = ({
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
            try {
                if (dish?.toppingGroups?.length > 0) {
                    router.push(`/store/${storeInfo?._id}/dish/${dish._id}`);
                } else {
                    const currentQuantity = cartItem?.quantity || 0;
                    const newQuantity = Math.max(currentQuantity + amount, 0);
                    let response;
                    const isGroup = storeCart && storeCart?.mode === "group";
                    console.log(storeCart);
                    console.log(isGroup);
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
                            // toast.error("Món đặt đã hết, xin vui lòng chọn món khác")
                        } else {
                            // toast.error(response.errorMessage);
                        }
                    }
                }
            } catch (e) {
                console.error(error);
            }
        } else {
            toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
        }
    };

    const isDisabled =
        storeInfo?.openStatus === "closed" ||
        dish?.stockCount == 0 ||
        dish?.suitability === "prohibit";
    const suitabilityStyles = {
        suitable: "border-transparent",
        warning: "border-yellow-500 border-2",
        prohibit: "border-red-500 border-2 opacity-60",
    };

    const cardStyle =
        suitabilityStyles[dish?.suitability] || "border-transparent";

    return (
        <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
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

            {/* Nội dung chính */}
            <Link
                href={`/store/${dish.storeId}/dish/${dish._id}?cartId=${storeCart?._id}`}
                name="storeCard"
                className={`flex gap-4 items-start p-3 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 
                ${cardStyle}
                ${isDisabled ? "pointer-events-none" : ""}
                `}
            >
                {/* Hình ảnh món ăn */}
                <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
                        <Image
                            src={dish?.image?.url ||  "/assets/default-dish.png"}
                            alt={dish?.name || "Dish"}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                {/* Nội dung món ăn */}
                <div className="flex flex-col flex-1">
                    <h4 className="text-gray-900 text-lg font-semibold line-clamp-1 transition">
                        {dish?.name}
                    </h4>
                    {dish?.description && (
                        <p className="text-gray-500 text-sm line-clamp-1">
                            {dish?.description}
                        </p>
                    )}

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

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-red-600 font-bold text-base">
                            {Number(dish?.price).toLocaleString("vi-VN")}đ
                        </span>

                        {/* Nút giỏ hàng */}
                        {!isDisabled && (
                            <>
                                {cartItem?.quantity > 0 ? (
                                    <div className="flex items-center bg-white border border-red-500 rounded-full px-2 py-1 shadow-md gap-2">
                                        <button
                                            className="text-red-600 text-sm font-bold"
                                        >
                                            ✓
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
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default DishCard;
