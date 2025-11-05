"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cartService } from "@/api/cartService";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";

// Component Loading đơn giản
const LoadingSpinner = () => (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-semibold text-lg">
            Đang tham gia giỏ hàng...
        </p>
    </div>
);

const JoinCartPage = () => {
    const router = useRouter();
    const { token } = useParams();
    const { refreshCart } = useCart();
    const { user, isAuthenticated } = useAuth(); // Kiểm tra xem user đã đăng nhập chưa
    const [error, setError] = useState(null);
    const effectRan = useRef(false);

    useEffect(() => {
        const join = async () => {
            if (effectRan.current === true) {
                return;
            }

            if (!token) {
                setError("Link tham gia không hợp lệ.");
                return;
            }

            // Bắt buộc người dùng đăng nhập trước
            if (!isAuthenticated) {
                toast.warn("Bạn cần đăng nhập để tham gia giỏ hàng nhóm.");
                // Lưu link để quay lại sau khi đăng nhập
                router.push(`/auth/login?redirect=/join-cart/${token}`);
                return;
            }

            // Gọi API để tham gia
            const response = await cartService.joinGroupCart(token);
            effectRan.current = true;
            if (response.success && response.data?.storeId) {
                const storeId = response.data.storeId;
                const cartId = response.data.cartId;

                // Quan trọng: Làm mới context giỏ hàng
                await refreshCart();

                // Chuyển hướng đến trang giỏ hàng của cửa hàng
                // toast.success("Tham gia giỏ hàng nhóm thành công!");
                router.push(`/store/${storeId}`);
            } else {
                if (response.errorCode == ALREADY_IN_CART) {
                    toast.success("Tham gia giỏ hàng nhóm thành công!");
                    router.push(`/store/${storeId}`);
                }
                // Xử lý lỗi (Link hết hạn, đã ở trong giỏ, v.v.)
                setError(
                    response.errorMessage || "Không thể tham gia giỏ hàng."
                );
                toast.error(
                    response.errorMessage || "Link hỏng hoặc đã hết hạn."
                );
                // Chuyển về trang chủ sau 3 giây
                setTimeout(() => {
                    router.push("/home");
                }, 3000);
            }
        };
        
        join();
    }, []);

    if (error) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="mt-4 text-red-600 font-semibold text-lg">
                    {error}
                </p>
                <p className="text-gray-500">
                    Đang chuyển hướng bạn về trang chủ...
                </p>
            </div>
        );
    }

    // Hiển thị loading trong khi chờ xử lý
    return <LoadingSpinner />;
};

export default JoinCartPage;
