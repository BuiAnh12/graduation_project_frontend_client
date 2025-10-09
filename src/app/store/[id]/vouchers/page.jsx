"use client";
import { cartService } from "@/api/cartService";
import { voucherService } from "@/api/voucherService";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { useCart } from "@/context/cartContext";
import { useVoucher } from "@/context/voucherContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import Swal from "sweetalert2";

const Page = () => {
  const { id: storeId } = useParams();
  const router = useRouter();

  const [storeVouchersList, setStoreVouchersList] = useState([]);
  const [detailCart, setDetailCart] = useState(null);
  const [storeCart, setStoreCart] = useState(null);
  const [cartPrice, setCartPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const { storeVouchers, toggleVoucher } = useVoucher();
  const { cart } = useCart();

  const selectedVouchers = storeVouchers[storeId] || [];

  const getStoreVouchers = async () => {
    setLoading(true);
    try {
      const response = await voucherService.getVouchersByStore(storeId);
      setStoreVouchersList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart && cart.length > 0) {
      const foundCart = cart.find((c) => c.storeId === storeId);
      setStoreCart(foundCart || null);
    } else {
      setStoreCart(null);
    }
  }, [cart, storeId]);

  const getDetailCart = async () => {
    try {
      const response = await cartService.getDetailCart(storeCart._id);
      setDetailCart(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (storeCart) {
      getDetailCart();
    }
  }, [storeCart]);

  useEffect(() => {
    if (detailCart) {
      calculateCartPrice();
      getStoreVouchers();
    }
  }, [detailCart]);

  const calculateCartPrice = () => {
    const { totalPrice, totalQuantity } = detailCart?.items.reduce(
      (acc, item) => {
        const dishPrice = (item.dish?.price || 0) * item.quantity;
        const toppingsPrice =
          (Array.isArray(item.toppings) ? item.toppings.reduce((sum, topping) => sum + (topping.price || 0), 0) : 0) *
          item.quantity;

        acc.totalPrice += dishPrice + toppingsPrice;
        acc.totalQuantity += item.quantity;

        return acc;
      },
      { totalPrice: 0, totalQuantity: 0 }
    );

    setCartPrice(totalPrice);
  };

  const handleApply = () => {
    if (selectedVouchers.length === 0) return;
    router.push(`/store/${storeId}/cart`);
  };

  const isVoucherValid = (voucher) => {
    const now = new Date();
    if (!voucher.isActive) return false;

    if (voucher.startDate && new Date(voucher.startDate) > now) return false;
    if (voucher.endDate && new Date(voucher.endDate) < now) return false;

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) return false;
    if (voucher.minOrderAmount && detailCart && cartPrice && cartPrice < voucher.minOrderAmount) return false;
    return true;
  };

  return (
    <div className='min-h-screen py-[85px] md:bg-[#f9f9f9] md:pt-[110px]'>
      <Heading title='Phiếu giảm giá' description='' keywords='' />
      <div className='hidden md:block'>
        <Header />
      </div>

      {/* Mobile Header */}
      <div className='fixed top-0 right-0 left-0 z-10 flex items-center gap-5 bg-white h-[85px] px-5 shadow-md md:hidden'>
        <Image
          src='/assets/arrow_left_long.png'
          alt='Back'
          width={30}
          height={30}
          className='cursor-pointer hover:scale-105 transition'
          onClick={() => router.back()}
        />
        <h3 className='text-[#4A4B4D] text-xl font-bold'>Ưu đãi</h3>
      </div>

      {!loading ? (
        <>
          {/* Content */}
          <div className='bg-white lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-gray-200 md:rounded-2xl md:shadow-md'>
            <div className='px-5 py-4'>
              {storeVouchersList.length > 0 ? (
                storeVouchersList.map((voucher) => {
                  const valid = isVoucherValid(voucher);
                  const isSelected = selectedVouchers.some((v) => v._id === voucher._id);
                  const hasNonStackable = selectedVouchers.some((v) => !v.isStackable);

                  return (
                    <div
                      key={voucher._id}
                      onClick={() => {
                        if (!valid) return;

                        // Nếu voucher này không stack được và đã chọn voucher khác -> chặn
                        if (!voucher.isStackable && selectedVouchers.length > 0 && !isSelected) {
                          Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "warning",
                            title: "Voucher này không thể dùng chung với voucher khác",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                          });
                          return;
                        }

                        // Nếu đã chọn 1 voucher non-stackable -> chặn chọn voucher mới, trừ khi bỏ chọn chính nó
                        if (hasNonStackable && !isSelected) {
                          Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "warning",
                            title: "Bạn đã chọn voucher không thể dùng chung",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                          });
                          return;
                        }

                        toggleVoucher(storeId, voucher);
                      }}
                      className={`flex gap-4 items-start p-4 mb-3 border rounded-xl shadow-sm transition 
          ${
            valid
              ? isSelected
                ? "border-[#fc6011] bg-[#fff5f0] cursor-pointer hover:shadow-md"
                : "border-gray-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
              : "opacity-50 cursor-not-allowed border-gray-200"
          }`}
                    >
                      <div className='flex justify-between flex-1 items-center'>
                        <div className='flex flex-col'>
                          <h4 className='text-[#4A4B4D] text-lg font-semibold line-clamp-1'>{voucher.code}</h4>
                          <p className='text-gray-500 text-sm'>{voucher.description}</p>
                        </div>
                        {valid && (
                          <div className='relative w-[26px] h-[26px]'>
                            <Image
                              src={`/assets/${isSelected ? "button_active" : "button"}.png`}
                              alt=''
                              fill
                              className='object-contain'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='flex flex-col items-center text-center py-10'>
                  <Image src='/assets/no_voucher.png' alt='empty cart' width={150} height={150} />
                  <h3 className='text-[#4A4B4D] text-2xl font-bold mt-4'>Quán hiện không có ưu đãi nào</h3>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between p-5 shadow-lg'>
            <h4 className='text-[#4A4B4D] text-lg font-semibold'>Đã chọn {selectedVouchers.length} ưu đãi</h4>
            <div
              onClick={handleApply}
              className={`flex items-center justify-center rounded-lg px-6 py-3 shadow-md transition-all duration-300 
              ${
                selectedVouchers.length > 0
                  ? "bg-[#fc6011] text-white hover:bg-[#e0560f] hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className='text-[18px] font-semibold'>Áp dụng</span>
            </div>
          </div>
        </>
      ) : (
        <div className='w-full h-screen flex items-center justify-center'>
          <Atom color='#fc6011' size='medium' text='' textColor='' />
        </div>
      )}
    </div>
  );
};

export default Page;
