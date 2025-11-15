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
import UpsellSlider from "@/components/dish/UpsellSlider";
import EnableGroupCart from "@/components/cart/EnableGroupCart";
import GroupCartView from "@/components/cart/GroupCartView";

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

    const [detailCart, setDetailCart] = useState(null); // Private
    const [groupCartData, setGroupCartData] = useState(null); // Group

    const [storeCart, setStoreCart] = useState(null);
    const [subtotalPrice, setSubtotalPrice] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const { user, userId } = useAuth();
    const { refreshCart, cart } = useCart();
    const { refreshOrder } = useOrder();
    const { storeVouchers } = useVoucher();

    const selectedVouchers = storeVouchers[storeId] || [];

    const [isCartLoading, setIsCartLoading] = useState(true); // Add this line

    const isGroupOwner =
        groupCartData?.cart?.userId && user?._id
            ? groupCartData.cart.userId === user._id
            : false;

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
                // toast.success(message);
            } else if (status === "24") {
                toast.warning(message);
            } else {
                // toast.error(message);
            }
            router.replace(window.location.pathname);
        }
    }, [searchParams, router]);

    useEffect(() => {
        console.log("Main Cart Effect Triggered: cart context changed");
        const cartIdFromQuery = searchParams.get("id");

        let foundCart = null;
        if (cart === null || cart === undefined) {
            console.log(
                "Setting storeCart to null (cart context is null or undefined)"
            );
            setStoreCart(null);
        } else {
            try {
                if (cartIdFromQuery) {
                    foundCart = cart.find((c) => c._id === cartIdFromQuery);
                } else {
                    foundCart = cart.find(
                        (c) => c.store._id === storeId && c.mode === "group"
                    );
                    if (!foundCart) {
                        foundCart = cart.find(
                            (c) =>
                                c.store._id === storeId && c.mode === "private"
                        );
                    }
                }
                console.log("Found storeCart:", foundCart || null);
                setStoreCart(foundCart || null); // Still set state for other components
            } catch (error) {
                console.log(error);
            }
        }

        // This fetch logic now runs immediately with the 'foundCart' we just got
        const fetchCartData = async () => {
            console.log("Fetch Detail");
            // Condition 1: We have a valid storeCart ID to fetch details for
            if (foundCart && foundCart._id) {
                setIsCartLoading(true); // Start loading

                // Check the mode from the cart we just found
                if (foundCart.mode === "group") {
                    console.log("Fetching GROUP cart data...");
                    const response = await cartService.getGroupCart(
                        foundCart._id
                    );
                    if (response.success && response.data) {
                        setGroupCartData(response.data);
                        setDetailCart(null); // Ensure private cart is null
                    } else {
                        // Handle error (e.g., user was removed, cart expired)
                        toast.error(
                            response.errorMessage ||
                                "Không thể tải giỏ hàng nhóm."
                        );
                        router.push(`/store/${storeId}`);
                        setGroupCartData(null);
                    }
                } else {
                    // --- EXISTING LOGIC ---
                    console.log("Fetching PRIVATE cart data...");
                    const response = await cartService.getDetailCart(
                        foundCart._id
                    );
                    if (
                        response.success &&
                        response.data &&
                        response.data.items &&
                        response.data.items.length > 0
                    ) {
                        setDetailCart(response.data);
                        setGroupCartData(null); // Ensure group cart is null
                    } else {
                        // Cart is empty or not found, redirect
                        router.push(`/store/${storeId}`);
                        setDetailCart(null);
                    }
                }
                // setIsCartLoading(false);
            }
            // Condition 2: Global cart has loaded (cart !== null), but no cart was found for this store
            else if (cart !== null && !foundCart) {
                // Global cart loaded, but no cart for this store
                console.log("No storeCart found for this store.");
                router.push(`/store/${storeId}`);
                setIsCartLoading(false);
            }
            // Condition 3: Global cart is still loading (cart === null)
            else if (cart === null) {
                // console.log("Waiting for global cart context to load..."); // Optional debug
                setIsCartLoading(true); // Keep showing loading while waiting for context
            }
        };

        fetchCartData(); // Call the fetch logic
    }, [cart, storeId, router]);

    useEffect(() => {
        if (detailCart || groupCartData || (cart !== null && !storeCart)) {
            setIsCartLoading(false);
        }
    }, [detailCart, groupCartData, cart, storeCart]);

    useEffect(() => {
        setStoreId(storeId);
    }, [storeId]);

    useEffect(() => {
        if (detailCart) {
            calculateCartPrice();
        }
    }, [detailCart]);

    const handleUpdateQuantity = async (
        dishId,
        newQuantity,
        toppings,
        note
    ) => {
        if (!storeCart) {
            router.push(`/store/${storeId}`);
            return;
        }
        if (!storeId) {
            toast.warn("Không tìm thấy thông tin cửa hàng.");
            return;
        }
        newQuantity = Math.max(0, newQuantity);

        console.log(`Updating dish ${dishId} to quantity ${newQuantity}`);

        const toppingIds = Array.isArray(toppings)
            ? toppings.map((topping) => topping.toppingId?._id).filter(Boolean)
            : [];

        const update_res = await cartService.updateCart({
            storeId: storeId,
            dishId: dishId,
            quantity: newQuantity,
            action: "update_item",
            toppings: toppingIds,
            note,
        });

        if (!update_res.success) {
            console.error("API Error updating cart:", update_res.errorMessage);
            return;
        }

        const cart_refresh_result = await refreshCart();

        if (cart_refresh_result && !cart_refresh_result.success) {
            if (
                cart_refresh_result.errorCode === "CART_EMPTY" ||
                update_res.message === "Cart deleted because it's empty"
            ) {
                router.push(`/store/${storeId}`);
                return;
            } else {
                console.error(
                    "Error refreshing cart context:",
                    cart_refresh_result.errorMessage
                );
                return;
            }
        }
        // Loading state will be managed by the main data fetching useEffect
    };

    const handleRemoveTopping = async (cartItemId, toppingIdToRemove) => {
        const currentItem = detailCart?.items?.find(
            (item) => item._id === cartItemId
        );

        if (!currentItem) {
            toast.warn(
                "Không tìm thấy món hàng trong giỏ để cập nhật topping."
            );
            return;
        }

        const dishId = currentItem.dishId?._id || currentItem.dishId;
        if (!storeId || !dishId) {
            toast.warn("Thiếu thông tin món ăn hoặc cửa hàng.");
            return;
        }

        const currentToppingIdStrings =
            currentItem.toppings?.map((t) => t.toppingId._id.toString()) || [];

        const newToppingIdStrings = currentToppingIdStrings.filter(
            (id) => id !== toppingIdToRemove.toString()
        );

        // setIsCartLoading(true); // Indicate loading

        try {
            const update_res = await cartService.updateCart({
                storeId: storeId,
                dishId: dishId,
                quantity: currentItem.quantity,
                action: "update_item",
                toppings: newToppingIdStrings,
                note: currentItem.note || "",
            });

            if (!update_res.success) {
                console.error(
                    "API Error updating toppings:",
                    update_res.errorMessage
                );
                // setIsCartLoading(false);
                return;
            }

            const cart_refresh_result = await refreshCart();

            if (cart_refresh_result && !cart_refresh_result.success) {
                console.error(
                    "Error refreshing cart context:",
                    cart_refresh_result.errorMessage
                );
                // setIsCartLoading(false);
                return;
            }
            // Loading state will be reset by the fetchDetails effect
        } catch (error) {
            console.error("Error updating toppings:", error);
            // setIsCartLoading(false); // Stop loading on catch
        }
    };

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
            const currentCartStore = detailCart?.store || groupCartData?.store;
            if (
                storeLocation &&
                storeLocation.lat !== 200 &&
                currentCartStore?.location?.lat &&
                currentCartStore?.location?.lon
            ) {
                try {
                    const res = await shippingFeeService.calculateShippingFee(
                        storeId,
                        {
                            distanceKm: haversineDistance(
                                [storeLocation.lat, storeLocation.lon],
                                [
                                    currentCartStore.location.lat,
                                    currentCartStore.location.lon,
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
    }, [storeLocation, detailCart, groupCartData]);

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
        // --- 1. Common validation for both modes ---
        const currentCartData = detailCart || groupCartData?.cart;
        if (!currentCartData) {
            toast.error("Giỏ hàng không tồn tại.");
            return;
        }

        if (currentCartData?.store?.openStatus === "closed") {
            toast.error("Cửa hàng đã đóng cửa, không thể đặt hàng.");
            return;
        }

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

        const voucherIds = selectedVouchers.map(voucher => voucher._id);

        // --- 2. Build common payload ---
        const commonPayload = {
            deliveryAddress: storeLocation.address,
            customerName: storeLocation.contactName,
            customerPhonenumber: storeLocation.contactPhonenumber,
            detailAddress: storeLocation.detailAddress,
            note: storeLocation.note,
            location: [storeLocation.lon, storeLocation.lat],
            vouchers: voucherIds,
        };

        try {
            // --- 3. Fork logic based on cart mode ---

            // --- GROUP CART LOGIC ---
            if (groupCartData) {
                if (groupCartData.cart.status !== "locking") {
                    toast.warn("Vui lòng khóa giỏ hàng trước khi thanh toán.");
                    return;
                }

                // Group cart only supports cash for now
                if (paymentMethod === "VNPay") {
                    toast.error(
                        "Thanh toán online chưa được hỗ trợ cho giỏ hàng nhóm."
                    );
                    return;
                }

                const response = await cartService.completeGroupCart(
                    groupCartData.cart._id,
                    {
                        ...commonPayload,
                        paymentMethod: "cash",
                    }
                );

                if (response?.data?.orderId) {
                    toast.success("Đặt hàng nhóm thành công!");
                    refreshOrder?.();
                    refreshCart?.();
                    router.push(
                        `/orders/detail-order/${response.data.orderId}`
                    );
                }
                // Error is handled by apiHelper

                // --- PRIVATE CART LOGIC (Your existing logic) ---
            } else if (detailCart) {
                if (paymentMethod === "VNPay") {
                    const redirectUrlResponse =
                        await paymentService.createVNPayOrder(
                            detailCart.cartId,
                            {
                                paymentMethod: "vnpay",
                                ...commonPayload,
                            }
                        );
                    if (redirectUrlResponse?.paymentUrl) {
                        router.push(redirectUrlResponse.paymentUrl);
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
                    router.push(
                        `/orders/detail-order/${response?.data?.orderId}`
                    );
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Thanh toán thất bại, vui lòng thử lại.");
        }
    };

    const warningShownRef = useRef(false);

    useEffect(() => {
        if (
            !warningShownRef.current &&
            storeLocation &&
            storeLocation.lat !== 200 &&
            (detailCart?.store?.location?.lat ||
                groupCartData?.cart?.store?.location?.lat)
        ) {
            const storeLat =
                detailCart?.store?.location?.lat ||
                groupCartData?.cart?.store?.location?.lat;
            const storeLon =
                detailCart?.store?.location?.lon ||
                groupCartData?.cart?.store?.location?.lon;

            const distance = haversineDistance(
                [storeLocation.lat, storeLocation.lon],
                [storeLat, storeLon]
            );

            if (distance > 20) {
                toast.warn(
                    "Khoảng cách giao hàng hơn 20km. Vui lòng kiểm tra lại địa chỉ. Nếu vẫn đặt đơn hàng có thể không được hoàn thành"
                );
                warningShownRef.current = true;
            }
        }
    }, [storeLocation, detailCart, groupCartData]);

    useEffect(() => {
        if (groupCartData) {
            // For group cart, totals come from API
            setSubtotalPrice(groupCartData.totals.subtotal);
            setTotalDiscount(groupCartData.totals.discount);
            // Note: We don't need calculateTotalDiscount here
            // We trust the backend's calculation
        } else if (detailCart) {
            // For private cart, we calculate locally
            setTotalDiscount(calculateTotalDiscount(subtotalPrice));
        }
    }, [selectedVouchers, subtotalPrice, detailCart, groupCartData]);

    const calculateTotalDiscount = (currentSubtotal) => {
        // Use the subtotal passed to it
        if (
            !currentSubtotal ||
            !selectedVouchers ||
            selectedVouchers.length === 0
        )
            return 0;

        let totalDiscount = 0;
        const orderPrice = currentSubtotal;

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

    if (isCartLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    const store =
        detailCart?.store || groupCartData?.cart?.store || storeCart?.store;
    let finalTotal = 0;
    if (groupCartData) {
        finalTotal = groupCartData.totals.finalTotal + shippingFee;
    } else if (detailCart) {
        finalTotal = subtotalPrice - totalDiscount + shippingFee;
    }

    if (!store) {
        console.log("BOck - No store found after loading.");
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p>Không thể tải giỏ hàng hoặc giỏ hàng trống.</p>
                <Link href={`/store/${storeId}`} className="text-blue-500 ml-2">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    return (
        <>
            {store && (
                <div className="pt-[20px] pb-[140px] bg-[#fff] md:pt-[110px]">
                    <Heading title="Giỏ hàng" description="" keywords="" />
                    <div className="hidden md:block">
                        <Header />
                    </div>

                    <div className="lg:w-[60%] md:w-[80%] md:mx-auto">
                        <div className="relative bg-white flex flex-col p-5 border border-gray-100 rounded-2xl shadow-md md:p-6 hover:shadow-lg transition-all duration-300">
                            {/* --- Store Header --- */}
                            <div className="fixed top-0 right-0 left-0 z-10 flex items-center gap-[40px] bg-[#fff] h-[85px] p-5 md:static md:gap-[20px] border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition-all duration-300">
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
                                    className="relative w-[70px] pt-[70px] rounded-[12px] overflow-hidden hidden md:block"
                                >
                                    <Image
                                        src={
                                            store?.avatarImage?.url ||
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
                                        className="text-red-600 text-[24px] font-bold line-clamp-1 hover:text-red-700 transition"
                                    >
                                        {store.name}
                                    </Link>

                                    {storeLocation &&
                                        storeLocation.lat !== 200 && (
                                            <p className="text-gray-500 text-[15px]">
                                                Khoảng cách tới chỗ bạn{" "}
                                                <span className="text-red-500 font-semibold">
                                                    {haversineDistance(
                                                        [
                                                            storeLocation.lat,
                                                            storeLocation.lon,
                                                        ],
                                                        [
                                                            detailCart?.store
                                                                ?.location
                                                                ?.lat ||
                                                                groupCartData
                                                                    ?.store
                                                                    ?.location
                                                                    ?.lat,
                                                            detailCart?.store
                                                                ?.location
                                                                ?.lon ||
                                                                groupCartData
                                                                    ?.store
                                                                    ?.location
                                                                    ?.lon,
                                                        ]
                                                    ).toFixed(2)}
                                                    km
                                                </span>
                                            </p>
                                        )}
                                </div>
                            </div>
                            {/* --- Shipping Info --- */}
                            {isGroupOwner ? (
                                <>
                                    <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                    <div className="mt-[25px] md:mt-0 bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
                                        <p className="text-red-600 text-[18px] font-bold pb-[15px]">
                                            Giao tới
                                        </p>

                                        <div className="flex flex-col gap-[15px]">
                                            <Link
                                                href={`/account/location`}
                                                className="flex gap-[15px] items-center"
                                            >
                                                <Image
                                                    src="/assets/location_active.png"
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-1 items-center justify-between">
                                                    <div>
                                                        <h3 className="text-[#4A4B4D] text-[18px] font-bold">
                                                            {storeLocation.name}
                                                        </h3>
                                                        <p className="text-gray-500 line-clamp-1">
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
                                                className="p-[10px] rounded-[6px] flex items-center justify-between bg-[#fff5f5] border border-red-100 hover:bg-red-50 transition"
                                            >
                                                <span className="text-gray-700">
                                                    Thêm chi tiết địa chỉ và
                                                    hướng dẫn giao hàng
                                                </span>
                                                <span className="text-red-600 font-semibold">
                                                    Thêm
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                            {/* --- Payment Method --- */}
                            {!groupCartData || isGroupOwner ? (
                                <>
                                    <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
                                        <div className="pb-[15px] flex items-center justify-between">
                                            <span className="text-red-600 text-[18px] font-bold">
                                                Thông tin thanh toán
                                            </span>
                                        </div>

                                        {/* Tiền mặt */}
                                        <div className="flex gap-[15px] mb-[10px]">
                                            <div className="relative w-[30px] pt-[30px]">
                                                <Image
                                                    src="/assets/money.png"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                            <div
                                                className="flex flex-1 items-center justify-between cursor-pointer"
                                                onClick={() =>
                                                    setPaymentMethod("cash")
                                                }
                                            >
                                                <h3 className="text-[#4A4B4D] text-[18px] font-bold md:text-[16px]">
                                                    Tiền mặt
                                                </h3>
                                                <Image
                                                    src={`/assets/${
                                                        paymentMethod === "cash"
                                                            ? "button_active.png"
                                                            : "button.png"
                                                    }`}
                                                    alt=""
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        </div>

                                        {/* VNPay */}
                                        <div className="flex gap-[15px]">
                                            <div className="relative w-[30px] pt-[30px]">
                                                <Image
                                                    src="/assets/vnpay.jpg"
                                                    alt=""
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                            <div
                                                className="flex flex-1 items-center justify-between cursor-pointer"
                                                onClick={() =>
                                                    setPaymentMethod("VNPay")
                                                }
                                            >
                                                <h3 className="text-[#4A4B4D] text-[18px] font-bold md:text-[16px]">
                                                    VNPay
                                                </h3>
                                                <Image
                                                    src={`/assets/${
                                                        paymentMethod ===
                                                        "VNPay"
                                                            ? "button_active.png"
                                                            : "button.png"
                                                    }`}
                                                    alt=""
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* --- Vouchers --- */}
                            {!groupCartData || isGroupOwner ? (
                                <>
                                    <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
                                        <span className="text-red-600 text-[18px] font-bold">
                                            Ưu đãi
                                        </span>

                                        {selectedVouchers.length > 0 ? (
                                            <div className="mt-3 flex flex-col gap-2">
                                                {selectedVouchers.map(
                                                    (voucher) => (
                                                        <div
                                                            key={voucher._id}
                                                            className="flex items-center justify-between p-3 rounded-lg border border-[#fc2111] bg-[#fff5f0]"
                                                        >
                                                            <span className="text-gray-700 font-medium">
                                                                {voucher.code}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {
                                                                    voucher.description
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-sm text-gray-400">
                                                Chưa có ưu đãi nào được chọn
                                            </p>
                                        )}

                                        <Link
                                            href={`/store/${storeId}/vouchers`}
                                            className="flex gap-[15px] items-center mt-[20px] hover:text-red-600 transition"
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
                                                    Sử dụng ưu đãi hoặc mã
                                                    khuyến mãi
                                                </span>
                                                <Image
                                                    src="/assets/arrow_right.png"
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                </>
                            ) : (
                                <></>
                            )}
                            {groupCartData ? (
                                // --- RENDER GROUP CART ---
                                <>
                                <UpsellSlider
                                        storeId={storeId}
                                        storeCartItems={detailCart?.items || []}
                                    />
                                <GroupCartView data={groupCartData} voucher={selectedVouchers} />
                                </>
                            ) : (
                                // --- RENDER PRIVATE CART ---
                                <>
                                    <EnableGroupCart storeId={storeId} />
                                    <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                    <UpsellSlider
                                        storeId={storeId}
                                        storeCartItems={detailCart?.items || []}
                                    />
                                    <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                    <OrderSummary
                                        detailItems={detailCart?.items}
                                        subtotalPrice={subtotalPrice}
                                        shippingFee={shippingFee}
                                        totalDiscount={totalDiscount}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemoveTopping={handleRemoveTopping}
                                    />
                                </>
                            )}
                            <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                            {/* --- Terms --- */}
                            <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
                                <span className="text-gray-500 text-[15px] leading-relaxed">
                                    Bằng việc đặt đơn này, bạn đã đồng ý{" "}
                                    <span className="text-red-600 font-semibold cursor-pointer hover:underline">
                                        Điều khoản Sử dụng
                                    </span>{" "}
                                    và{" "}
                                    <span className="text-red-600 font-semibold cursor-pointer hover:underline">
                                        Quy chế hoạt động
                                    </span>{" "}
                                    của chúng tôi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- Bottom Bar --- */}

                    <div className="fixed bottom-0 left-0 right-0 bg-[#fff] p-[15px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] border-t border-red-100 z-50">
                        <div className="flex items-center justify-between pb-[8px] lg:w-[60%] md:w-[80%] md:mx-auto">
                            <span className="text-gray-700 text-[18px]">
                                Tổng cộng
                            </span>
                            <span className="text-red-600 text-[24px] font-bold">
                                {Number(
                                    finalTotal
                                        // Sử dụng finalTotal đã tính toán ở trên
                                        .toFixed(0)
                                ).toLocaleString("vi-VN")}
                                đ
                            </span>
                        </div>

                        {/* --- Logic Nút Đặt Hàng Động --- */}

                        {/* Case 1: Giỏ hàng nhóm (groupCartData tồn tại) */}
                        {groupCartData ? (
                            (() => {
                                // Kiểm tra vai trò và trạng thái
                                const isOwner =
                                    groupCartData.cart.userId === user?._id;
                                const isLocking =
                                    groupCartData.cart.status === "locking";

                                if (isOwner && isLocking) {
                                    // 1a: Chủ nhóm VÀ giỏ hàng đã khóa -> Được phép đặt
                                    return (
                                        <div
                                            onClick={handleCompleteCart}
                                            className="flex items-center justify-center rounded-lg bg-[#fc2111] text-white px-[20px] py-[12px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-pointer shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <span className="text-[20px] font-semibold md:text-[18px]">
                                                Đặt đơn cho nhóm
                                            </span>
                                        </div>
                                    );
                                } else if (isOwner && !isLocking) {
                                    // 1b: Chủ nhóm NHƯNG giỏ hàng chưa khóa -> Báo phải khóa
                                    return (
                                        <div className="flex items-center justify-center rounded-lg bg-gray-400 text-white px-[20px] py-[12px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-not-allowed">
                                            <span className="text-[18px] font-semibold md:text-[16px]">
                                                Vui lòng khóa giỏ hàng trước khi
                                                đặt hàng
                                            </span>
                                        </div>
                                    );
                                } else {
                                    // 1c: Là người tham gia (participant) -> Báo chờ
                                    return (
                                        <div className="flex items-center justify-center rounded-lg bg-gray-400 text-white px-[20px] py-[12px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-not-allowed">
                                            <span className="text-[18px] font-semibold md:text-[16px]">
                                                Chờ chủ nhóm đặt hàng...
                                            </span>
                                        </div>
                                    );
                                }
                            })()
                        ) : detailCart ? (
                            // Case 2: Giỏ hàng cá nhân (detailCart tồn tại) -> Nút đặt đơn bình thường
                            <div
                                onClick={handleCompleteCart}
                                className="flex items-center justify-center rounded-lg bg-[#fc2111] text-white px-[20px] py-[12px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-pointer shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="text-[20px] font-semibold md:text-[18px]">
                                    Đặt đơn
                                </span>
                            </div>
                        ) : (
                            // Case 3: Fallback (không có giỏ hàng nào) -> Vô hiệu hóa
                            <div className="flex items-center justify-center rounded-lg bg-gray-400 text-white px-[20px] py-[12px] md:px-[10px] lg:w-[60%] md:w-[80%] md:mx-auto cursor-not-allowed">
                                <span className="text-[18px] font-semibold md:text-[16px]">
                                    Không thể đặt đơn
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default page;
