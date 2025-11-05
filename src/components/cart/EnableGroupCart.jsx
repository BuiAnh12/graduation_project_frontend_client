"use client";
import React, { useState } from 'react';
import { cartService } from '@/api/cartService';
import { useCart } from '@/context/cartContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

const EnableGroupCart = ({ storeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart } = useCart();

  const handleEnableGroupCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.enableGroupCart({ storeId });
      if (response.success) {
        // toast.success("Đã bật giỏ hàng nhóm!");
        // CRITICAL: Refresh the global cart context.
        // This will cause the cart page to detect the new 'group' mode and reload.
        await refreshCart();
      } else {
        // Error is already handled by handleApiResponse, but we catch just in case
        console.error(response.errorMessage);
      }
    } catch (error) {
      console.error("Failed to enable group cart", error);
      toast.error("Lỗi: không thể bật giỏ hàng nhóm.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/assets/users_group.png" alt="Group" width={28} height={28} className='m-2'/>
          <div className='px-2'>
            <h3 className="text-red-600 text-[18px] font-bold">
              Tạo giỏ hàng nhóm
            </h3>
            <p className="text-gray-600 text-sm">
              Mời bạn bè cùng đặt chung đơn hàng này.
            </p>
          </div>
        </div>
        <button
          onClick={handleEnableGroupCart}
          disabled={isLoading}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang tạo..." : "Bắt đầu"}
        </button>
      </div>
    </div>
  );
};

export default EnableGroupCart;