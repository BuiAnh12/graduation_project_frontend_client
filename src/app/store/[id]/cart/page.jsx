"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { useStoreLocation } from "@/context/storeLocationContext";
import { haversineDistance } from "@/utils/functions";
import OrderSummary from "@/components/order/OrderSummary";
import { useAuth } from "@/context/authContext";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/cartContext";
import { useOrder } from "@/context/orderContext";
import { useVoucher } from "@/context/voucherContext";
import { paymentService } from "@/api/paymentService";
import { shippingFeeService } from "@/api/shippingFeeService";
import { useSearchParams } from "next/navigation";

const page = () => {
    const router = useRouter();
    const { id: storeId } = useParams();
    const searchParams = useSearchParams();
    const {
        storeLocation,
        setStoreLocation,
        storeId: storeLocationId,
        setStoreId,
    } = useStoreLocation();

    const [detailCart, setDetailCart] = useState(null);
    const [storeCart, setStoreCart] = useState(null);
    const [subtotalPrice, setSubtotalPrice] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const { user } = useAuth();
    const { refreshCart, cart } = useCart();
    const { refreshOrder } = useOrder();
    const { storeVouchers } = useVoucher();

    const selectedVouchers = storeVouchers[storeId] || [];

    useEffect(() => {
        const status = searchParams.get("status");

        if (status) {
            // Mapping of VNPay response codes
            const statusMessages = {
                "00": "Giao dịch thành công",
                "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
                "09": "Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
                10: "Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.",
                11: "Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.",
                12: "Thẻ/Tài khoản của khách hàng bị khóa.",
                13: "Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Vui lòng thực hiện lại giao dịch.",
                24: "Khách hàng hủy giao dịch.",
                51: "Tài khoản không đủ số dư để thực hiện giao dịch.",
                65: "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.",
                75: "Ngân hàng thanh toán đang bảo trì.",
                79: "Nhập sai mật khẩu thanh toán quá số lần quy định. Vui lòng thực hiện lại.",
                99: "Lỗi khác (không có trong danh sách mã lỗi).",
            };

            const message =
                statusMessages[status] ||
                `Thanh toán thất bại. Mã lỗi: ${status}`;

            if (status === "00") {
                toast.success(message);
            } else if (status === "24") {
                toast.warning(message);
            } else {
                toast.error(message);
            }
            router.replace(window.location.pathname);
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (cart) {
            setStoreCart(cart.find((cart) => cart.store._id === storeId));
        } else {
            setStoreCart(null);
        }
    }, [cart]);

    const getDetailCart = async () => {
        try {
            const response = await cartService.getDetailCart(storeCart._id);
            setDetailCart(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setStoreId(storeId);
    }, [storeId]);

    useEffect(() => {
        if (storeCart) {
            getDetailCart();
        }
    }, [storeCart]);

    useEffect(() => {
        if (detailCart) {
            calculateCartPrice();
        }
    }, [detailCart]);

    const fetchPlaceName = async (lon, lat) => {
        try {
          // ✅ Use LocationIQ instead of Nominatim
          const url = `https://us1.locationiq.com/v1/reverse?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=vi`;
      
          const res = await fetch(url);
      
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
      
          const data = await res.json();
      
          if (data) {
            setStoreLocation({
              address: data.display_name,
              contactName: user.name,
              contactPhonenumber: user.phonenumber,
              detailAddress: "",
              name: "Vị trí hiện tại",
              note: "",
              lat,
              lon,
            });
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };
      

    useEffect(() => {
        if (storeLocation.lon === 200 && user) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const userLat = pos.coords.latitude;
                        const userLon = pos.coords.longitude;
                        fetchPlaceName(userLon, userLat);
                    },
                    (error) => {
                        console.error("Lỗi khi lấy vị trí:", error);
                    }
                );
            }
        }
    }, []);

    useEffect(() => {
        const fetchShippingFee = async () => {
            if (
                storeLocation &&
                storeLocation.lat !== 200 &&
                detailCart?.store?.location?.lat &&
                detailCart?.store?.location?.lon
            ) {
                try {
                    const res = await shippingFeeService.calculateShippingFee(
                        storeId,
                        {
                            distanceKm: haversineDistance(
                                [storeLocation.lat, storeLocation.lon],
                                [
                                    detailCart?.store?.location?.lat,
                                    detailCart?.store?.location?.lon,
                                ]
                            ).toFixed(2),
                        }
                    );
                    if (res?.fee) {
                        setShippingFee(res.fee);
                    }
                } catch (error) {
                    setShippingFee(0);
                }
            }
        };

        fetchShippingFee();
    }, [storeLocation, detailCart, subtotalPrice]);

    const calculateCartPrice = () => {
        const { subtotalPrice } = detailCart?.items.reduce(
            (acc, item) => {
                const dishPrice =
                    (item.price || item.dishId?.price || 0) * item.quantity;
                const toppingsPrice =
                    (Array.isArray(item.toppings)
                        ? item.toppings.reduce(
                              (sum, topping) => sum + (topping.price || 0),
                              0
                          )
                        : 0) * item.quantity;

                acc.subtotalPrice += dishPrice + toppingsPrice;
                acc.totalQuantity += item.quantity;
                return acc;
            },
            { subtotalPrice: 0, totalQuantity: 0 }
        );

        setSubtotalPrice(subtotalPrice);
    };

    const handleCompleteCart = async () => {
        try {
            // --- Basic cart checks ---
            if (
                !detailCart ||
                !Array.isArray(detailCart.items) ||
                detailCart.items.length === 0
            ) {
                toast.error("Giỏ hàng trống hoặc không thể truy vấn.");
                return;
            }

            if (detailCart?.store?.openStatus === "CLOSED") {
                toast.error(
                    "Cửa hàng đã đóng cửa, không thể đặt hàng. Vui lòng quay lại sau!"
                );
                return;
            }

            const outOfStockItems =
                detailCart.items?.filter(
                    (item) => item?.dishId?.stockStatus === "OUT_OF_STOCK"
                ) ?? [];

            if (outOfStockItems.length > 0) {
                toast.error(
                    "Có món ăn hiện đang hết hàng, không thể đặt hàng. Vui lòng quay lại sau!"
                );
                return;
            }

            // --- Address / contact checks ---
            if (
                storeLocation?.lat === 200 ||
                storeLocation?.lat == null ||
                storeLocation?.lon == null
            ) {
                toast.error("Vui lòng chọn địa chỉ giao hàng");
                return;
            }
            if (!storeLocation?.contactName?.trim()) {
                toast.error("Vui lòng nhập tên người nhận");
                return;
            }
            if (!storeLocation?.contactPhonenumber?.trim()) {
                toast.error("Vui lòng nhập số điện thoại người nhận");
                return;
            }

            // Common payload
            const commonPayload = {
                deliveryAddress: storeLocation.address,
                customerName: storeLocation.contactName,
                customerPhonenumber: storeLocation.contactPhonenumber,
                detailAddress: storeLocation.detailAddress,
                note: storeLocation.note,
                location: [storeLocation.lon, storeLocation.lat],
                vouchers: selectedVouchers,
            };

            // --- Payment flows ---
            if (paymentMethod === "VNPay") {
                if (!detailCart.cartId) {
                    toast.error("CartId không thể truy vấn");
                    return;
                }

                const redirectUrlResponse =
                    await paymentService.createVNPayOrder(detailCart.cartId, {
                        paymentMethod: "vnpay",
                        ...commonPayload,
                    });

                if (redirectUrlResponse?.paymentUrl) {
                    router.push(redirectUrlResponse.paymentUrl);
                    // refreshOrder?.();
                    // refreshCart?.();
                    return;
                } else {
                    toast.error("Lỗi phương thức thanh toán online");
                    return;
                }
            }

            // Cash (default) flow
            const response = await cartService.completeCart({
                storeId,
                paymentMethod: "cash",
                ...commonPayload,
            });

            if (response?.data?.orderId) {
                toast.success("Đặt thành công");
                refreshOrder?.();
                refreshCart?.();
                router.push(`/orders/detail-order/${response?.data?.orderId}`);
            } else {
                toast.error("Lỗi phương thức thanh toán tiền mặt");
            }
        } catch (error) {
            console.error(error);
            toast.error("Thanh toán thất bại");
        }
    };

    const warningShownRef = useRef(false);

    useEffect(() => {
        if (
            !warningShownRef.current &&
            storeLocation &&
            storeLocation.lat !== 200 &&
            detailCart?.store?.location?.lat &&
            detailCart?.store?.location?.lon
        ) {
            const distance = haversineDistance(
                [storeLocation.lat, storeLocation.lon],
                [
                    detailCart?.store?.location?.lat,
                    detailCart?.store?.location?.lon,
                ]
            );

            if (distance > 20) {
                toast.warn(
                    "Khoảng cách giao hàng hơn 20km. Vui lòng kiểm tra lại địa chỉ. Nếu vẫn đặt đơn hàng có thể không được hoàn thành"
                );
                warningShownRef.current = true;
            }
        }
    }, [storeLocation, detailCart]);

    useEffect(() => {
        setTotalDiscount(calculateTotalDiscount());
    }, [selectedVouchers, subtotalPrice, detailCart]);

    const calculateTotalDiscount = () => {
        if (!detailCart || !selectedVouchers || selectedVouchers.length === 0)
            return 0;

        let totalDiscount = 0;
        const orderPrice = subtotalPrice;

        selectedVouchers.forEach((voucher) => {
            if (voucher.minOrderAmount && orderPrice < voucher.minOrderAmount)
                return;

            let discount = 0;
            if (voucher.discountType === "PERCENTAGE") {
                discount = (orderPrice * voucher.discountValue) / 100;
                if (voucher.maxDiscount) {
                    discount = Math.min(discount, voucher.maxDiscount);
                }
            } else if (voucher.discountType === "FIXED") {
                discount = voucher.discountValue;
            }

            totalDiscount += discount;
        });

        return Math.min(totalDiscount, orderPrice);
    };

    return (
        <>
            {detailCart && (
                <div className="pt-[20px] pb-[140px] bg-[#fff] md:pt-[110px]">
                    <Heading title="Giỏ hàng" description="" keywords="" />
                    <div className="hidden md:block">
                        <Header />
                    </div>

                    <div className="lg:w-[60%] md:w-[80%] md:mx-auto">
                        <div className="relative bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                            <div className="fixed top-0 right-0 left-0 z-10 flex items-center gap-[40px] bg-[#fff] h-[85px] p-5 md:static md:gap-[20px] border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <Link
                                    href={`/store/${storeId}`}
                                    className="relative w-[30px] pt-[30px] md:hidden"
                                >
                                    <Image
                                        src="/assets/arrow_left_long.png"
                                        alt=""
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </Link>
                                <Link
                                    href={`/store/${storeId}`}
                                    className="relative w-[70px] pt-[70px] rounded-[8px] overflow-hidden hidden md:block"
                                >
                                    <Image
                                        src={
                                            detailCart?.store?.avatarImage?.url 
                                            ||
                                            "/assets/store_default.png"
                                        }
                                        alt=""
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </Link>
                                <div>
                                    <Link
                                        href={`/store/${storeId}`}
                                        className="text-[#4A4B4D] text-[24px] font-bold line-clamp-1"
                                    >
                                        {detailCart?.store.name}
                                    </Link>
                                    {storeLocation &&
                                        storeLocation.lat !== 200 && (
                                            <p className="text-[#636464]">
                                                Khoảng cách tới chỗ bạn{" "}
                                                {haversineDistance(
                                                    [
                                                        storeLocation.lat,
                                                        storeLocation.lon,
                                                    ],
                                                    [
                                                        detailCart?.store
                                                            ?.location?.lat,
                                                        detailCart?.store
                                                            ?.location?.lon,
                                                    ]
                                                ).toFixed(2)}
                                                km
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div className="h-[6px] w-full bg-gray-100 my-4 rounded-full"></div>

                            <div className="mt-[25px] md:mt-0 bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <p className="text-[#4A4B4D] text-[18px] font-bold pb-[15px]">
                                    Giao tới
                                </p>

                                <div className=" flex flex-col gap-[15px]">
                                    <Link
                                        href={`/account/location`}
                                        className="flex gap-[15px]"
                                    >
                                        <Image
                                            src="/assets/location_active.png"
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                        <div className="flex flex-1 items-center justify-between">
                                            <div>
                                                <h3 className="text-[#4A4B4D] text-[18px] font-bold">
                                                    {storeLocation.name}
                                                </h3>
                                                <p className="text-[#a4a5a8] line-clamp-1">
                                                    {storeLocation.address ||
                                                        "Nhấn chọn để thêm địa chỉ giao hàng"}
                                                </p>
                                            </div>
                                            <Image
                                                src="/assets/arrow_right.png"
                                                alt=""
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                    </Link>

                                    <Link
                                        href={`/store/${storeId}/cart/edit-current-location`}
                                        className="p-[10px] rounded-[6px] flex items-center justify-between bg-[#e0e0e0a3]"
                                    >
                                        <span className="text-[#4A4B4D]">
                                            Thêm chi tiết địa chỉ và hướng dẫn
                                            giao hàng
                                        </span>
                                        <span className="text-[#0054ff] font-semibold">
                                            Thêm
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            <div className="h-[6px] w-full bg-gray-100 my-4 rounded-full"></div>

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <div className="pb-[15px] flex items-center justify-between">
                                    <span className="text-[#4A4B4D] text-[18px] font-bold">
                                        Thông tin thanh toán
                                    </span>
                                </div>

                                <div className="flex gap-[15px] mb-[10px]">
                                    <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px]">
                                        <Image
                                            src="/assets/money.png"
                                            alt=""
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div
                                        className="flex flex-1 items-center justify-between"
                                        onClick={() => setPaymentMethod("cash")}
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <h3 className="text-[#4A4B4D] text-[18px] font-bold md:text-[16px]">
                                                Tiền mặt
                                            </h3>
                                        </div>
                                        {paymentMethod === "cash" ? (
                                            <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px] cursor-pointer">
                                                <Image
                                                    src="/assets/button_active.png"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px] cursor-pointer">
                                                <Image
                                                    src="/assets/button.png"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-[15px]">
                                    <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px]">
                                        <Image
                                            src="/assets/vnpay.jpg"
                                            alt=""
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div
                                        className="flex flex-1 items-center justify-between"
                                        onClick={() =>
                                            setPaymentMethod("VNPay")
                                        }
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <h3 className="text-[#4A4B4D] text-[18px] font-bold md:text-[16px]">
                                                VNPay
                                            </h3>
                                        </div>
                                        {paymentMethod === "VNPay" ? (
                                            <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px] cursor-pointer">
                                                <Image
                                                    src="/assets/button_active.png"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative w-[30px] pt-[30px] md:w-[20px] md:pt-[20px] cursor-pointer">
                                                <Image
                                                    src="/assets/button.png"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[6px] w-full bg-gray-100 my-4 rounded-full"></div>

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <span className="text-[#4A4B4D] text-[18px] font-bold">
                                    Ưu đãi
                                </span>

                                {/* Hiển thị danh sách voucher đã chọn */}
                                {selectedVouchers.length > 0 ? (
                                    <div className="mt-3 flex flex-col gap-2">
                                        {selectedVouchers.map((voucher) => (
                                            <div
                                                key={voucher._id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-[#fc6011] bg-[#fff5f0]"
                                            >
                                                <span className="text-[#4A4B4D] font-medium">
                                                    {voucher.code}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {voucher.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-gray-400">
                                        Chưa có ưu đãi nào được chọn
                                    </p>
                                )}

                                {/* Link sang trang chọn voucher */}
                                <Link
                                    href={`/store/${storeId}/vouchers`}
                                    className="flex gap-[15px] mb-[10px] mt-[20px]"
                                >
                                    <div className="relative w-[30px] pt-[30px]">
                                        <Image
                                            src="/assets/marketing.png"
                                            alt=""
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-between">
                                        <span className="text-[#4A4B4D] text-[18px]">
                                            Sử dụng ưu đãi hoặc mã khuyến mãi
                                        </span>
                                        <div className="relative w-[20px] pt-[20px]">
                                            <Image
                                                src="/assets/arrow_right.png"
                                                alt=""
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="h-[6px] w-full bg-gray-100 my-4 rounded-full"></div>

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <OrderSummary
                                    detailItems={detailCart?.items}
                                    subtotalPrice={subtotalPrice}
                                    shippingFee={shippingFee}
                                    totalDiscount={totalDiscount}
                                />
                            </div>

                            <div className="h-[6px] w-full bg-gray-100 my-4 rounded-full"></div>

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <span className="text-[#4A4B4D] text-[16px]">
                                    Bằng việc đặt đơn này, bạn đã đồng ý Điều
                                    khoản Sử dụng và Quy chế hoạt động của chúng
                                    tôi
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-[#fff] p-[15px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                        <div className="flex items-center justify-between pb-[8px] lg:w-[60%] md:w-[80%] md:mx-auto">
                            <span className="text-[#000] text-[18px]">
                                Tổng cộng
                            </span>
                            <span className="text-[#4A4B4D] text-[24px] font-semibold">
                                {Number(
                                    (
                                        subtotalPrice -
                                        totalDiscount +
                                        shippingFee
                                    ).toFixed(0)
                                ).toLocaleString("vi-VN")}
                                đ
                            </span>
                        </div>
                        <div
                            onClick={handleCompleteCart}
                            className="flex items-center justify-center rounded-[8px] bg-[#fc6011] text-[#fff] px-[20px] py-[10px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="text-[#fff] text-[20px] font-semibold md:text-[18px]">
                                Đặt đơn
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default page;
