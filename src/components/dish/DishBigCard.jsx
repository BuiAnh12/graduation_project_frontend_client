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
      if (dish.toppingGroups.length > 0) {
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
    <div className='relative group'>
      {/* Overlay trạng thái cửa hàng */}
      {(storeInfo?.openStatus === "CLOSED" || dish?.stockStatus === "OUT_OF_STOCK") && (
        <div className='absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl backdrop-blur-[2px]'>
          <span className='text-white text-lg font-semibold px-4 text-center'>
            {storeInfo?.openStatus === "CLOSED" ? "Cửa hàng hiện đang đóng" : "Món ăn hiện không còn phục vụ"}
          </span>
        </div>
      )}

      {/* Nội dung chính */}
      <Link
        href={`/store/${dish.storeId}/dish/${dish._id}`}
        className={storeInfo?.openStatus === "CLOSED" ? "pointer-events-none" : ""}
      >
        <div
          className='relative flex flex-col gap-2 pt-[75%] w-full rounded-2xl overflow-hidden shadow-md bg-white transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl'
          name='bigDishCard'
        >
          <Image
            src={dish?.image?.url}
            alt={dish?.name || "Dish"}
            layout='fill'
            objectFit='cover'
            className='rounded-2xl transition-transform duration-300 group-hover:scale-105'
          />

          {/* Nút giỏ hàng */}
          {cartItem?.quantity > 0 ? (
            <div className='absolute bottom-3 right-3 flex items-center bg-white gap-2 border border-[#fc6011] rounded-full px-3 py-1 shadow-lg z-10'>
              <Image
                src='/assets/minus.png'
                alt='minus'
                width={20}
                height={20}
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeQuantity(-1);
                }}
                className='cursor-pointer hover:scale-110 transition'
              />
              <span className='text-[#4A4B4D] text-lg font-bold w-[30px] text-center'>{cartItem?.quantity}</span>
              <Image
                src='/assets/plus_active.png'
                alt='plus'
                width={20}
                height={20}
                onClick={(e) => {
                  e.preventDefault();
                  handleChangeQuantity(1);
                }}
                className='cursor-pointer hover:scale-110 transition'
              />
            </div>
          ) : (
            <Image
              src='/assets/add_active.png'
              name='addingCart'
              alt='add'
              width={42}
              height={42}
              className='absolute bottom-3 right-3 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition'
              onClick={(e) => {
                e.preventDefault();
                handleChangeQuantity(1);
              }}
            />
          )}
        </div>

        {/* Thông tin món ăn */}
        <div className='mt-2'>
          <h4 className='text-[#4A4B4D] text-lg font-semibold truncate' name='dishName'>
            {dish?.name}
          </h4>
          {dish?.description && <p className='text-[#a4a5a8] text-sm truncate'>{dish?.description}</p>}
          <p className='text-black font-bold mt-1' name='dishPrice'>
            {Number(dish?.price).toLocaleString("vi-VN")}đ
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DishBigCard;
