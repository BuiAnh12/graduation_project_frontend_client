"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService";
import { useAuth } from "@/context/authContext";

const DishBigCard = ({ dish, storeInfo, cartItems }) => {
  const router = useRouter();
  const [cartItem, setCartItem] = useState(null);
  const { user } = useAuth();
  const { refreshCart } = useCart();

  useEffect(() => {
    if (cartItems) {
      setCartItem(cartItems.find((item) => item?.dish?._id === dish?._id));
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
          });

          refreshCart();
          toast.success("Cập nhật giỏ hàng thành công");
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
      {(storeInfo?.openStatus === "CLOSED" || dish?.stockStatus === "OUT_OF_STOCK") && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
          <span className="text-white text-lg font-semibold px-4 text-center">
            {storeInfo?.openStatus === "CLOSED"
              ? "Cửa hàng hiện đang đóng"
              : "Món ăn hiện không còn phục vụ"}
          </span>
        </div>
      )}

      {/* Nội dung chính */}
      <Link
        href={`/store/${dish.storeId}/dish/${dish._id}`}
        className={storeInfo?.openStatus === "CLOSED" ? "pointer-events-none" : ""}
      >
        <div className="relative flex flex-col gap-2 pt-[75%] w-full rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300">
          <Image
            src={dish?.image?.url}
            alt={dish?.name || "Dish"}
            layout="fill"
            objectFit="cover"
            className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
          />

          {/* Nút giỏ hàng */}
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
        </div>

        {/* Thông tin món ăn */}
        <div className="mt-3">
          <h4 className="text-gray-900 text-lg font-semibold truncate group-hover:text-red-600 transition">
            {dish?.name}
          </h4>
          {dish?.description && (
            <p className="text-gray-500 text-sm truncate">{dish?.description}</p>
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
