import Image from "next/image";
import Link from "next/link"; // Import Link
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService"; // Import cartService
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";

// Simple component to display the popup
const SimilarDishesPopup = ({ dishes, storeId, onClose }) => {
    const { addToCart } = useCart();
    const { refreshCart } = useCart();
    const { user } = useAuth();

    if (!dishes || dishes.length === 0) {
        return null;
    }

    const handleAddToCart = async (dish) => {
        // 1. Check if user is logged in
        if (!user) {
            // toast.error("Vui lòng đăng nhập để thêm món vào giỏ hàng!");
            onClose(); // Close popup
            return;
        }

        // 2. Check if dish has required toppings (unlikely in this context, but good practice)
        //    For simplicity, we assume dishes recommended here don't *require* toppings.
        //    If they might, you'd need to navigate to the dish page instead.
        if (dish.metadata?.toppingGroups?.some((group) => group.isRequired)) {
            // toast.info(
            //     `Món "${dish.name}" cần chọn topping. Vui lòng xem chi tiết.`
            // );
            // Optionally navigate: router.push(`/store/${storeId}/dish/${dish._id || dish.dish_id}`);
            onClose();
            return;
        }

        // 3. Prepare payload for cartService
        const dishId = dish._id || dish.dish_id; // Use MongoDB ID preferably
        const payload = {
            storeId: storeId,
            dishId: dishId,
            action: "update_item",
            quantity: 1, // Add one item
            toppings: [], // Assuming no toppings are selected from this quick add
            note: "", // Assuming no note
        };

        try {
            // 4. Call cartService.updateCart
            const response = await cartService.updateCart(payload);

            if (response.success) {
                // toast.success(`Đã thêm "${dish.name}" vào giỏ hàng!`);
                refreshCart(); // Refresh cart state from context
                onClose(); // Close popup after adding
            } else {
                // Show backend error message if available
                if (response.errorCode == "NOT_ENOUGH_STOCK") {
                    // toast.error("Món đặt đã hết, xin vui lòng chọn món khác")
                }
                else {
                    // toast.error(
                    //     response.errorMessage || "Không thể thêm món vào giỏ hàng."
                    // );
                }
                // onClose(); // Still close popup on failure
            }
        } catch (error) {
            console.error("Error adding similar dish to cart:", error);
            // toast.error(
            //     error?.data?.message || "Lỗi khi thêm món vào giỏ hàng!"
            // );
            onClose(); // Close popup on error
        }
    };

    return (
        <div className="fixed bottom-25 right-5 z-[150] bg-white rounded-lg shadow-xl border border-gray-200 w-80 animate-slide-in-left">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                <h4 className="font-semibold text-sm text-gray-700">
                    Có thể bạn cũng thích
                </h4>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close similar dishes popup"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Dish List */}
            <div className="p-3 space-y-2">
                {dishes.slice(0, 3).map(
                    (
                        dish // Show max 3 dishes
                    ) => (
                        <div
                            key={dish.dish_id}
                            className="flex items-center gap-3"
                        >
                            <Link
                                href={`/store/${storeId}/dish/${dish.dish_id}`}
                                className="flex items-center gap-3 flex-1 min-w-0"
                            >
                                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                        src={
                                            dish.metadata?.image?.url ||
                                            "/assets/logo_app.png"
                                        }
                                        alt={dish.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {dish.name}
                                    </p>
                                    <p className="text-xs text-red-600 font-semibold">
                                        {Number(dish.price || 0).toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </p>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleAddToCart(dish)}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex-shrink-0"
                                aria-label={`Add ${dish.name} to cart`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        </div>
                    )
                )}
            </div>
            {/* Add simple CSS animation */}
            <style jsx>{`
                @keyframes slide-in-left {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SimilarDishesPopup;
