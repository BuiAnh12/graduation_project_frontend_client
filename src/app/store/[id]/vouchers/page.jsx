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
import { ThreeDot } from "react-loading-indicators";
import Swal from "sweetalert2";

const Page = () => {
  const { id: storeId } = useParams();
  const router = useRouter();

  const [storeVouchersList, setStoreVouchersList] = useState([]);
  const [groupCartData, setGroupCartData] = useState(null); // <-- THÊM MỚI
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
    // 1. Tìm giỏ hàng đang hoạt động
    let foundCart = null;
    if (cart && cart.length > 0) {
        // Ưu tiên giỏ hàng nhóm, sau đó mới đến giỏ hàng cá nhân
        foundCart =
            cart.find((c) => c.store._id === storeId && c.mode === "group") ||
            cart.find((c) => c.store._id === storeId && c.mode === "private");
    }
    setStoreCart(foundCart);

    // 2. Fetch dữ liệu chi tiết dựa trên loại giỏ hàng
    const fetchCartData = async () => {
        if (foundCart) {
            setLoading(true);
            if (foundCart.mode === "group") {
                // --- LOGIC CHO GIỎ HÀNG NHÓM ---
                try {
                    const response = await cartService.getGroupCart(foundCart._id);
                    if (response.success && response.data) {
                        setGroupCartData(response.data);
                        setDetailCart(null);
                        // Lấy subtotal từ API giỏ hàng nhóm
                        setCartPrice(response.data.totals.subtotal);
                        await getStoreVouchers(); // Lấy voucher sau khi có giá
                    } else {
                        router.push(`/store/${storeId}/cart`);
                    }
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            } else {
                // --- LOGIC CHO GIỎ HÀNG CÁ NHÂN (Như cũ) ---
                try {
                    const response = await cartService.getDetailCart(foundCart._id);
                    if (response.success && response.data) {
                        setDetailCart(response.data);
                        setGroupCartData(null);
                        // Tính toán subtotal từ giỏ hàng cá nhân
                        calculateCartPrice(response.data); 
                        await getStoreVouchers(); // Lấy voucher sau khi có giá
                    } else {
                        router.push(`/store/${storeId}/cart`);
                    }
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            }
        } else if (cart !== null) {
            // Cart đã load xong nhưng không tìm thấy giỏ hàng nào cho store này
            toast.warn("Bạn cần thêm món vào giỏ hàng trước khi xem ưu đãi.");
            router.push(`/store/${storeId}`);
        }
        // Nếu cart === null, chúng ta chỉ cần đợi nó load ở lần trigger sau
    };

    fetchCartData();
}, [cart, storeId, router]);

  const calculateCartPrice = (cartData) => {
    const dataToUse = cartData || detailCart;
    if (!dataToUse || !dataToUse.items) {
         setCartPrice(0);
         return;
    }

    const { totalPrice } = dataToUse.items.reduce(
        (acc, item) => {
            // Sửa lỗi: Dữ liệu từ getDetailCart có item.price, không phải item.dish.price
            const dishPrice = (item.price || 0) * item.quantity;
            const toppingsPrice =
                (Array.isArray(item.toppings)
                    ? item.toppings.reduce(
                          (sum, topping) => sum + (topping.price || 0),
                          0
                      )
                    : 0) * item.quantity;

            acc.totalPrice += dishPrice + toppingsPrice;
            return acc;
        },
        { totalPrice: 0 }
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
    
    if (voucher.minOrderAmount && cartPrice < voucher.minOrderAmount) return false;
    
    return true;
};

  return (
    <div className="min-h-screen py-[85px] md:bg-[#f9f9f9] md:pt-[110px]">
      <Heading title="Phiếu giảm giá" description="" keywords="" />

      {/* Header (Desktop + Mobile) */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="fixed top-0 right-0 left-0 z-10 flex items-center gap-5 bg-white h-[85px] px-5 shadow-md md:hidden">
        <Image
          src="/assets/arrow_left_long.png"
          alt="Back"
          width={30}
          height={30}
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => router.back()}
        />
        <h3 className="text-[#4A4B4D] text-xl font-bold">Ưu đãi</h3>
      </div>

      {/* Main Content */}
      {!loading ? (
        <>
          <div className="bg-white lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-gray-200 md:rounded-2xl md:shadow-md">
            <div className="px-5 py-4">
              {storeVouchersList.length > 0 ? (
                storeVouchersList.map((voucher) => {
                  const valid = isVoucherValid(voucher);
                  const isSelected = selectedVouchers.some((v) => v._id === voucher._id);
                  const hasNonStackable = selectedVouchers.some((v) => !v.isStackable);

                  const handleVoucherClick = () => {
                    if (!valid) return;

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
                  };

                  return (
                    <div
                      key={voucher._id}
                      onClick={handleVoucherClick}
                      className={`flex gap-4 items-start p-4 mb-3 border rounded-xl shadow-sm transition-all duration-300 ${valid
                          ? isSelected
                            ? "border-[#fc2111] bg-[#fff4f2] hover:shadow-md hover:scale-[1.01] cursor-pointer"
                            : "border-gray-200 hover:border-[#fc2111]/40 hover:shadow-md hover:scale-[1.01] cursor-pointer"
                          : "opacity-50 cursor-not-allowed border-gray-200"
                        }`}
                    >
                      <div className="flex justify-between flex-1 items-center">
                        <div className="flex flex-col">
                          <h4 className="text-[#4A4B4D] text-lg font-semibold line-clamp-1">
                            {voucher.code}
                          </h4>
                          <p className="text-gray-500 text-sm">{voucher.description}</p>
                        </div>
                        {valid && (
                          <div className="relative w-[26px] h-[26px]">
                            <Image
                              src={`/assets/${isSelected ? "button_active" : "button"}.png`}
                              alt="Selected"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center text-center py-10">
                  <Image
                    src="/assets/no_voucher.png"
                    alt="No vouchers"
                    width={150}
                    height={150}
                  />
                  <h3 className="text-[#4A4B4D] text-2xl font-bold mt-4">
                    Quán hiện không có ưu đãi nào
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between p-5 shadow-lg border-t border-gray-200">
            <h4 className="text-[#4A4B4D] text-lg font-semibold">
              Đã chọn {selectedVouchers.length} ưu đãi
            </h4>
            <button
              onClick={handleApply}
              disabled={selectedVouchers.length === 0}
              className={`flex items-center justify-center rounded-lg px-6 py-3 shadow-md font-semibold text-lg transition-all duration-300 ${selectedVouchers.length > 0
                  ? "bg-[#fc2111] text-white hover:bg-[#e01b0d] hover:shadow-lg hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Áp dụng
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <ThreeDot color="#fc2111" size="medium" text="" textColor="" />
        </div>
      )}
    </div>
  );
};

export default Page;
