// src/components/dish/UpsellDishCard.js
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCart } from '@/context/cartContext';
import { cartService } from '@/api/cartService';
import { useAuth } from '@/context/authContext';

const UpsellDishCard = ({ dish, storeId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  // Extract necessary data, handle potential missing metadata
  const dishId = dish?._id || dish?.dish_id; // Use _id if enriched, dish_id otherwise
  const metadata = dish?.metadata || {}; // Use enriched data if available
  const name = metadata?.name || dish?.name || 'Món ăn';
  const price = metadata?.price ?? dish?.price; // Use nullish coalescing
  const image = metadata?.image?.url || '/assets/default-dish.png';
  const link = `/store/${storeId}/dish/${dishId}`;
  const hasToppings = metadata?.toppingGroups?.length > 0; // Check if metadata includes topping info

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!user) {
      // toast.error("Vui lòng đăng nhập để thêm món!");
      return;
    }
    if (!storeId || !dishId) {
        // toast.error("Thiếu thông tin món ăn hoặc cửa hàng.");
        return;
    }

    // If dish has toppings, redirect to detail page
    if (hasToppings) {
      router.push(link);
      return;
    }

    // Add directly if no toppings
    try {
      const update_res = await cartService.updateCart({
        storeId: storeId,
        dishId: dishId,
        quantity: 1, // Add quantity 1
        action: "add_item",
      });

      if (!update_res.success) {
        // toast.error(update_res.errorMessage || "Lỗi khi thêm vào giỏ.");
        return;
      }

      await refreshCart();
      // toast.success(`Đã thêm "${name}" vào giỏ hàng!`);

    } catch (error) {
      console.error("Error adding upsell item:", error);
      // toast.error(error?.data?.message || "Lỗi khi thêm món.");
    }
  };

  if (!dishId) return null; // Don't render if essential ID is missing

  return (
    <div className="relative bg-white rounded-lg border border-red-100 rounded-xl shadow-md overflow-hidden group p-3 m-3 flex gap-3 h-full">
        {/* Image */}
        <Link href={link} className="block w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
            <Image
                src={image}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-200"
                onError={(e) => (e.target.src = "/assets/default-dish.png")}
            />
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
             <div>
                <Link href={link} className="block">
                     <h5 className="font-semibold text-sm text-gray-800 line-clamp-1 transition">
                         {name}
                     </h5>
                </Link>
                {/* Optional: Add description if needed */}
                {/* <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{metadata?.description}</p> */}
             </div>

            <div className="flex items-center justify-between mt-1">
                 <span className="font-medium text-red-600 text-sm">
                     {price?.toLocaleString('vi-VN')}₫
                 </span>
                 <button
                    onClick={handleAddToCart}
                    className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition active:scale-95 text-xs leading-none"
                    aria-label={`Thêm ${name} vào giỏ`}
                 >
                    {/* Simple Plus Icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                     </svg>
                 </button>
            </div>
        </div>
    </div>
  );
};

export default UpsellDishCard;