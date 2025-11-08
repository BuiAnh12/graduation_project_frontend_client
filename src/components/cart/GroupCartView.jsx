"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { cartService } from "@/api/cartService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// --- UPDATED: ItemControls restyled to be vertical ---
const ItemControls = ({ item, isOwner, isSelf, onUpdate, isLocking }) => {
    if (isLocking || (!isOwner && !isSelf)) {
        return (
            <div className="flex flex-col items-center gap-1 w-10 flex-shrink-0 pt-1">
                <span
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-400"
                    aria-label="Increase quantity"
                >
                    +
                </span>
                <span
                    className="text-gray-800 font-semibold text-lg"
                    name="quantity"
                >
                    {item.quantity}
                </span>
                <span
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-400"
                    aria-label="Decrease quantity"
                >
                    -
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1 w-10 flex-shrink-0 pt-1">
            <button
                onClick={() => onUpdate(item._id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition active:scale-95"
                aria-label="Increase quantity"
            >
                +
            </button>
            <span
                className="text-gray-800 font-semibold text-lg"
                name="quantity"
            >
                {item.quantity}
            </span>
            <button
                onClick={() =>
                    onUpdate(item._id, Math.max(0, item.quantity - 1))
                } // Backend handles 0
                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 transition active:scale-95"
                aria-label="Decrease quantity"
            >
                -
            </button>
        </div>
    );
};

// --- UPDATED: ParticipantSection layout rebuilt to match OrderSummary ---
const ParticipantSection = ({
    participant,
    isOwner,
    isLocking,
    currentUserId,
    onUpdateItem,
    onRemoveItem,
    onRemoveTopping,
    onRemoveParticipant,
}) => {
    const isSelf = participant.userId._id === currentUserId;
    const showRemoveButton = isOwner && !participant.isOwner;

    return (
        <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Image
                        src={
                            participant.userId.profileImage ||
                            "/assets/avatar_default.png"
                        }
                        alt={participant.userId.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <span className="font-semibold text-gray-800">
                        {participant.userId.name}
                        {participant.isOwner && " (Chủ)"}
                        {isSelf && !participant.isOwner && " (Bạn)"}
                    </span>
                </div>
                {showRemoveButton && (
                    <button
                        onClick={() =>
                            onRemoveParticipant(
                                participant._id,
                                participant.userId.name
                            )
                        }
                        className="text-xs text-gray-500 hover:text-red-500"
                    ></button>
                )}
            </div>

            {/* List of items for this participant */}
            <div className="flex flex-col gap-4">
                {participant.items.map((item) => {
                    const totalDishPrice = (item.price || 0) * item.quantity;
                    const canEdit = isOwner || isSelf;

                    return (
                        <div
                            key={item._id}
                            className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 items-start"
                        >
                            {/* --- 1. Controls (Left) --- */}
                            <ItemControls
                                item={item}
                                isOwner={isOwner}
                                isSelf={isSelf}
                                onUpdate={onUpdateItem}
                                isLocking={isLocking}
                            />

                            {/* --- 2. Details (Middle) --- */}
                            <div className="flex-1 flex flex-col mr-2">
                                <h3
                                    className="text-gray-800 text-base md:text-lg font-semibold line-clamp-2"
                                    name="dishName"
                                >
                                    {item.dishName}
                                </h3>

                                {/* Toppings with Remove Buttons */}
                                {item.toppings?.length > 0 &&
                                    item.toppings.map((topping, tIdx) => (
                                        <div
                                            key={topping._id || tIdx}
                                            className="flex items-center mt-0.5"
                                        >
                                            {canEdit ? (
                                                <button
                                                    onClick={() =>
                                                        onRemoveTopping(
                                                            item,
                                                            topping.toppingId
                                                                ._id
                                                        )
                                                    }
                                                    className="mr-1 text-red-500 hover:text-red-700 font-bold leading-none text-xl w-4 h-4 flex items-center justify-center rounded-full transition"
                                                    aria-label={`Remove ${topping.toppingName}`}
                                                >
                                                    &times;
                                                </button>
                                            ) : (
                                                <span className="mr-1 text-gray-400 leading-none text-xl w-4 h-4 flex items-center justify-center">
                                                    +
                                                </span>
                                            )}
                                            <span
                                                className="text-gray-500 text-sm"
                                                name="toppingName"
                                            >
                                                {topping.toppingName}
                                            </span>
                                        </div>
                                    ))}

                                {/* Note */}
                                {item.note && (
                                    <p
                                        className="text-gray-500 text-sm italic mt-1"
                                        name="note"
                                    >
                                        Ghi chú: {item.note}
                                    </p>
                                )}
                            </div>

                            {/* --- 3. Price (Right) --- */}
                            <div className="flex flex-col items-end text-right flex-shrink-0 w-24">
                                <span
                                    className="text-gray-800 font-medium whitespace-nowrap"
                                    name="dishPrice"
                                >
                                    {Number(totalDishPrice).toLocaleString(
                                        "vi-VN"
                                    )}
                                    đ
                                </span>

                                {item.toppings?.length > 0 &&
                                    item.toppings.map((topping, tIdx) => (
                                        <span
                                            key={topping._id || tIdx}
                                            className="text-gray-500 text-sm whitespace-nowrap"
                                            name="toppingPrice"
                                        >
                                            {Number(
                                                topping.price * item.quantity
                                            ).toLocaleString("vi-VN")}
                                            đ
                                        </span>
                                    ))}
                            </div>

                            {/* --- 4. Trash Icon (Far Right) --- */}
                            {canEdit && (
                                <button
                                    onClick={() => onRemoveItem(item._id)}
                                    className="text-gray-400 hover:text-red-500 flex-shrink-0 pt-1"
                                >
                                    <Image
                                        src="/assets/trash.png"
                                        alt="Remove"
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Group Cart Component ---
const GroupCartView = ({ data, voucher }) => {
    const { cart, participants, totals } = data;
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const isLocking = cart?.status === "locking";
    const me = participants.find((p) => p.userId._id === user._id);
    const isOwner = me?.isOwner || false;

    const isExpired = new Date(cart.expiryAt) < new Date();

    const handleCopyLink = () => {
        const link = `${window.location.origin}/join-cart/${cart.privateToken}`;
        navigator.clipboard.writeText(link);
        toast.success("Đã sao chép link mời!");
    };

    // --- UPDATED: Added 'updateItemToppings' case ---
    const handleUpdate = async (action, ...args) => {
        if (isLoading) return;
        setIsLoading(true);

        let response;
        try {
            switch (action) {
                // --- Item Actions (using the single upsert endpoint) ---
                case "updateItem":
                    response = await cartService.upsertGroupCartItem({
                        userId: user._id,
                        itemId: args[0], // itemId
                        quantity: args[1], // newQuantity
                        action: "update_item",
                    });
                    break;
                case "removeItem":
                    response = await cartService.upsertGroupCartItem({
                        userId: user._id,
                        itemId: args[0], // itemId
                        action: "remove_item",
                    });
                    break;
                case "updateItemToppings":
                    const item = args[0];
                    const toppingIdToRemove = args[1];
                    const newToppingIds = item.toppings
                        .map((t) => t.toppingId._id)
                        .filter(
                            (id) =>
                                id.toString() !== toppingIdToRemove.toString()
                        );
                    response = await cartService.upsertGroupCartItem({
                        userId: user._id,
                        itemId: item._id,
                        toppings: newToppingIds,
                        action: "update_item",
                    });
                    break;

                // --- Cart Actions (using their dedicated services) ---
                case "lock":
                    response = await cartService.lockGroupCart(cart._id);
                    break;
                case "unlock":
                    response = await cartService.unlockGroupCart(cart._id);
                    break;
                case "leave":
                    response = await cartService.leaveGroupCart(cart._id);
                    break;
                case "removeParticipant":
                    response = await cartService.removeParticipant(
                        cart._id,
                        args[0]
                    );
                    break;
                case "regenerate":
                    response = await cartService.enableGroupCart({
                        storeId: cart.storeId, // Pass the storeId to the 'enable' service
                    });
                    // toast.success("Đã tạo lại link mời mới!");
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            if (response && response.success) {
                await refreshCart(); // This will trigger page.js to re-fetch data
            } else if (response) {
                console.error("API Error:", response.errorMessage);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateDiscount = (subtotal, vouchers = []) => {
        if (!subtotal || !vouchers || vouchers.length === 0) return 0;
        let totalDiscount = 0;
        vouchers.forEach((v) => {
            if (v.minOrderAmount && subtotal < v.minOrderAmount) return;
            let discount = 0;
            if (v.discountType === "PERCENTAGE") {
                discount = (subtotal * v.discountValue) / 100;
                if (v.maxDiscount) {
                    discount = Math.min(discount, v.maxDiscount);
                }
            } else if (v.discountType === "FIXED") {
                discount = v.discountValue;
            }
            totalDiscount += discount;
        });
        return Math.min(totalDiscount, subtotal);
    };

    const apiSubtotal = totals.subtotal;

    // 3. Tính toán giảm giá từ voucher (client-side)
    const clientDiscount = calculateDiscount(apiSubtotal, voucher);

    // 4. Tính toán tổng cuối cùng (client-side)
    // (Lưu ý: Phí ship sẽ được cộng ở component cha, ở đây chỉ tính subtotal - discount)
    const clientFinalTotal = apiSubtotal - clientDiscount;

    // 5. Tính toán lại số tiền phải trả của mỗi người
    const participantBreakdown = participants.map(p => {
        // Tính subtotal của từng người
        const pSubtotal = p.items.reduce((acc, item) => {
            const dishPrice = (item.price || 0) * item.quantity;
            const toppingsTotal = (item.toppings || []).reduce((tAcc, t) => tAcc + (t.price || 0), 0) * item.quantity;
            return acc + dishPrice + toppingsTotal;
        }, 0);

        // Tính % đóng góp
        const contributionPercent = apiSubtotal > 0 ? (pSubtotal / apiSubtotal) : 0;
        
        // Chia sẻ giảm giá (từ client)
        const discountShare = clientDiscount * contributionPercent;

        // Số tiền cuối cùng phải trả (chưa tính ship)
        const finalOwes = pSubtotal - discountShare;

        return {
            ...p, // Giữ lại toàn bộ thông tin gốc (như name, _id, items)
            finalOwes: finalOwes // Ghi đè số tiền phải trả bằng giá trị mới
        };
    });

    const confirmRemoveParticipant = (participantId, name) => {
        Swal.fire({
            title: `Xóa ${name}?`,
            text: `Bạn có chắc muốn xóa ${name} khỏi giỏ hàng? Món ăn của họ cũng sẽ bị xóa.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xác nhận xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdate("removeParticipant", participantId);
            }
        });
    };

    return (
        <>
            {/* --- UPDATED: Group Header & Share (Added hover/transition) --- */}
            <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 mb-4 hover:shadow-lg transition-all">
                {/* --- UPDATED: Header Style --- */}
                <div className="pb-4 border-b border-gray-200">
                    <span className="text-[#fc2111] text-xl font-bold">
                        Giỏ hàng nhóm
                    </span>
                </div>

                {cart.status === "active" && !isExpired && isOwner && (
                    <>
                        <p className="text-gray-600 mt-4">
                            {" "}
                            {/* Added mt-4 */}
                            Gửi link này cho bạn bè để cùng đặt món. Link sẽ hết
                            hạn sau 2 giờ.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                readOnly
                                value={`${window.location.origin}/join-cart/${cart.privateToken}`}
                                className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600"
                            >
                                Sao chép
                            </button>
                        </div>
                    </>
                )}

                {cart.status === "active" && isExpired && isOwner && (
                    <>
                        <p className="text-red-600 font-semibold mt-4 p-3 bg-red-50 rounded-lg">
                            Link mời đã hết hạn. Bạn bè không thể tham gia nữa.
                        </p>
                        {isOwner && (
                            <button
                                onClick={() => handleUpdate("regenerate")}
                                disabled={isLoading}
                                className="w-full mt-3 p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                            >
                                {isLoading
                                    ? "Đang tạo..."
                                    : "Tạo link mới (2 giờ)"}
                            </button>
                        )}
                    </>
                )}

                {cart.status === "locking" && !isOwner && (
                    <p className="text-blue-600 font-semibold mt-4 p-3 bg-blue-50 rounded-lg">
                        Giỏ hàng đã khóa. Chủ nhóm đang tiến hành thanh toán...
                    </p>
                )}

                {/* --- Owner Controls --- */}
                {isOwner && cart.status === "active" && !isExpired && (
                    <button
                        onClick={() => handleUpdate("lock")}
                        disabled={isLoading}
                        className="w-full mt-3 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isLoading
                            ? "Đang khóa..."
                            : "Khóa giỏ hàng & Thanh toán"}
                    </button>
                )}
                {isOwner && cart.status === "locking" && (
                    <button
                        onClick={() => handleUpdate("unlock")}
                        disabled={isLoading}
                        className="w-full mt-3 p-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
                    >
                        {isLoading ? "Đang mở..." : "Mở khóa giỏ hàng"}
                    </button>
                )}

                {/* --- Participant Leave Button --- */}
                {!isOwner && cart.status === "active" && (
                    <button
                        onClick={() => handleUpdate("leave")}
                        disabled={isLoading}
                        className="w-full mt-3 p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
                    >
                        Rời khỏi giỏ hàng
                        {/* {isLoading ? "Đang rời..." : "Rời khỏi giỏ hàng"} */}
                    </button>
                )}
            </div>

            {/* --- UPDATED: Participant Item List (Added hover/transition) --- */}
            <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-lg transition-all">
                {/* --- UPDATED: Header Style --- */}
                <div className="pb-4">
                    <span className="text-[#fc2111] text-xl font-bold">
                        Đơn hàng của mọi người
                    </span>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    {" "}
                    {/* Added mt-4 */}
                    {participantBreakdown.map((p) => (
                        <ParticipantSection
                            key={p._id}
                            participant={p}
                            isOwner={isOwner}
                            isLocking={isLocking}
                            currentUserId={user._id}
                            onUpdateItem={(itemId, qty) =>
                                handleUpdate("updateItem", itemId, qty)
                            }
                            onRemoveItem={(itemId) =>
                                handleUpdate("removeItem", itemId)
                            }
                            onRemoveTopping={(item, toppingId) =>
                                handleUpdate(
                                    "updateItemToppings",
                                    item,
                                    toppingId
                                )
                            }
                            onRemoveParticipant={confirmRemoveParticipant}
                        />
                    ))}
                </div>
            </div>
            <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 mt-4 hover:shadow-lg transition-all">
                <div className="pb-4 border-b border-gray-200">
                    <span className="text-[#fc2111] text-xl font-bold">
                        Chi tiết thanh toán
                    </span>
                </div>

                <div className="space-y-2 mt-4">
                    {" "}
                    {/* Added mt-4 and space-y-2 */}
                    {participantBreakdown.map((p) => (
                        <div
                            key={p._id}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                            <span className="text-gray-700">
                                {p.userId.name}{" "}
                                {isOwner && p.isOwner && "(Bạn)"}
                            </span>
                            <span className="font-semibold text-gray-900">
                                {Math.round(p.finalOwes).toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    ))}
                </div>

                {/* --- UPDATED: Re-styled to match OrderSummary totals --- */}
                <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-gray-700">
                        <span>Tổng tạm tính</span>
                        <span>{apiSubtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {clientDiscount > 0 && (
                        <div className="flex items-center justify-between text-gray-700">
                            <span>Giảm giá</span>
                            <span className="text-[#fc2111]">
                            -{clientDiscount.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    )}
                    {/* Note: Shipping fee is handled by the main page, but we can show this */}
                    <div className="flex items-center justify-between text-gray-700">
                        <span>Phí vận chuyển</span>
                        <span>...</span>
                        {/* This will be added in the main page's total */}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-gray-900 text-lg font-bold">
                            Tổng cộng
                        </span>
                        <span className="text-[#fc2111] text-lg font-bold">
                        {clientFinalTotal.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupCartView;
