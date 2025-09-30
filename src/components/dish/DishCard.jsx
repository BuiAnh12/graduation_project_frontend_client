"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService";
import { useAuth } from "@/context/authContext";

const DishCard = ({ dish, storeInfo, cartItems }) => {
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
      if (dish.toppingGroups.length > 0) {
        router.push(`/store/${storeInfo?._id}/dish/${dish._id}`);
      } else {
        try {
          const currentQuantity = cartItem?.quantity || 0;
          const newQuantity = Math.max(currentQuantity + amount, 0);
          await cartService.updateCart({ storeId: storeInfo?._id, dishId: dish._id, quantity: newQuantity });
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
    <div className='relative group'>
      {/* Overlay trạng thái */}
      {(storeInfo?.openStatus === "CLOSED" || dish?.stockStatus === "OUT_OF_STOCK") && (
        <div className='absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl backdrop-blur-sm'>
          <span className='text-white text-lg font-semibold px-3 text-center'>
            {storeInfo?.openStatus === "CLOSED" ? "Cửa hàng hiện đang đóng" : "Món ăn hiện không còn phục vụ"}
          </span>
        </div>
      )}

      <Link
        href={`/store/${dish.storeId}/dish/${dish._id}`}
        name='storeCard'
        className={`flex gap-4 items-start p-3 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:scale-[1.01] transition-transform duration-200 ${
          storeInfo?.openStatus === "CLOSED" ? "pointer-events-none" : ""
        }`}
      >
        {/* Hình ảnh món ăn */}
        {dish?.image?.url && (
          <div className='relative w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden'>
            <Image
              src={dish.image.url}
              alt={dish?.name || "Dish"}
              layout='fill'
              objectFit='cover'
              className='transition-transform duration-300 group-hover:scale-105'
            />
          </div>
        )}

        {/* Nội dung món */}
        <div className='flex flex-col flex-1'>
          <h4 className='text-[#4A4B4D] text-lg font-semibold line-clamp-1' name='storeName'>
            {dish?.name}
          </h4>
          {dish?.description && <p className='text-[#a4a5a8] text-sm line-clamp-1'>{dish?.description}</p>}

          <div className='flex items-center justify-between mt-2'>
            <span className='text-black font-bold text-base'>{Number(dish?.price).toLocaleString("vi-VN")}đ</span>

            {/* Nút giỏ hàng */}
            {cartItem?.quantity > 0 ? (
              <div className='flex items-center bg-white border border-[#fc6011] rounded-full px-2 py-1 shadow-md gap-2'>
                <Image
                  src='/assets/minus.png'
                  alt='minus'
                  width={20}
                  height={20}
                  className='cursor-pointer hover:scale-110 transition'
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(-1);
                  }}
                />
                <span className='text-[#4A4B4D] text-lg font-bold w-[32px] text-center'>{cartItem?.quantity}</span>
                <Image
                  src='/assets/plus_active.png'
                  alt='plus'
                  width={20}
                  height={20}
                  className='cursor-pointer hover:scale-110 transition'
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangeQuantity(1);
                  }}
                />
              </div>
            ) : (
              <Image
                src='/assets/add_active.png'
                alt='add'
                width={40}
                height={40}
                className='bg-white rounded-full shadow-md cursor-pointer hover:scale-110 transition'
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeQuantity(1);
                }}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DishCard;
