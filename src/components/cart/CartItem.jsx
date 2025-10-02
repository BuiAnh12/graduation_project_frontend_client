import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/cartContext";

const CartItem = ({ cartItem }) => {
  const [quantity, setQuantity] = useState(0);
  const { refreshCart } = useCart();

  useEffect(() => {
    const totalQuantity = cartItem.items.reduce((sum, item) => sum + item.quantity, 0);
    setQuantity(totalQuantity);
  }, [cartItem.items]);

  const handleClearCartItem = async () => {
    try {
      await cartService.clearCartItem(cartItem.store._id);
      refreshCart();
      toast.success("Xóa khỏi giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const confirmClearCartItem = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa khỏi giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleClearCartItem();
    }
  };

  return (
    <Link
      href={`/store/${cartItem.store._id}/cart`}
      className='relative block bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 overflow-hidden'
    >
      <div className='relative w-full h-56 rounded-t-2xl overflow-hidden'>
        {cartItem.items.slice(0, 4).map((item, index) => {
          const total = cartItem.items.length;
          const imageUrl = item.dish?.image?.url || "/assets/logo_app.png";

          let className = "absolute w-full h-full";
          if (total === 2) {
            className = `absolute w-2/3 h-2/3 rounded-xl ${index === 0 ? "top-0 left-0 z-0" : "bottom-0 right-0 z-10"}`;
          } else if (total === 3) {
            if (index === 0) {
              className = "absolute top-0 left-0 w-full h-1/2";
            } else {
              className = `absolute bottom-0 w-1/2 h-1/2 ${index === 1 ? "left-0" : "right-0"}`;
            }
          } else if (total >= 4) {
            const positions = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"];
            className = `absolute w-1/2 h-1/2 ${positions[index]}`;
          }

          return (
            <div key={index} className={className}>
              <Image src={imageUrl} alt={item.dishName} fill className='object-cover rounded-xl' />
              {total > 4 && index === 3 && (
                <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl'>
                  <span className='text-white text-lg font-semibold'>+{total - 4}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nội dung */}
      <div className='p-4'>
        <div className='flex items-center justify-between gap-2'>
          <h4 className='text-gray-800 text-lg font-semibold line-clamp-1 flex-1'>{cartItem.store.name}</h4>
          <p className='text-gray-700 font-medium text-sm'>{quantity} món</p>
        </div>

        {/* Danh sách món ăn */}
        <div className='text-gray-600 text-sm mb-2 line-clamp-1'>
          {cartItem.items.map((item, index) => (
            <span key={index}>
              {item.dishName} x{item.quantity}
              {index !== cartItem.items.length - 1 && <span className='text-orange-500'> • </span>}
            </span>
          ))}
        </div>
      </div>

      {/* Nút xóa */}
      <div
        className='absolute top-3 right-3 z-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer transition'
        onClick={(e) => {
          e.preventDefault();
          confirmClearCartItem();
        }}
      >
        <div className='relative w-6 h-6'>
          <Image src='/assets/trash.png' alt='remove' fill className='object-contain' />
        </div>
      </div>
    </Link>
  );
};

export default CartItem;
