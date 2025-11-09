"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";
import { useCart } from "./cartContext";
import { useOrder } from "./orderContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ENDPOINT = "http://localhost:5000" || "";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const { user } = useAuth();
    const { refreshCart } = useCart();
    const { refreshOrder } = useOrder();
    const router = useRouter();

    useEffect(() => {
        console.log("Update notification", notifications);
    }, [notifications]);

    useEffect(() => {
        if (!user) return;

        const newSocket = io(ENDPOINT, { transports: ["websocket"] });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.emit("registerUser", user._id);

        // --- CÁC SỰ KIỆN NOTIFICATION (Đã có) ---
        newSocket.on("getAllNotifications", (allNotifications) => {
            setNotifications(allNotifications);
            console.log("Socket: getAllNotifications", allNotifications);
        });

        newSocket.on("newNotification", (newNotification) => {
            setNotifications((prev) => [...prev, newNotification]);
            // Hiển thị toast cho các thông báo chung (ví dụ: store nhận đơn)
            toast.success(newNotification.message);
        });

        // --- CÁC SỰ KIỆN GIỎ HÀNG (MỚI) ---

        // 1. Cập nhật giỏ hàng CÁ NHÂN (từ upsertCartItem)
        newSocket.on("cartUpdated", (data) => {
            console.log("Socket: cartUpdated", data);
            // Chỉ làm mới nếu người khác cập nhật (đã xử lý ở lượt trước)
            if (data.userId !== user._id) {
                toast.info("Giỏ hàng của bạn được cập nhật!");
                refreshCart();
            }
        });

        // 2. Một người tham gia giỏ hàng NHÓM (từ joinGroupCart)
        newSocket.on("participant_joined", (data) => {
            console.log("Socket: participant_joined", data);
            if (data.userId !== user._id) {
                toast.info(`${data.userName} vừa tham gia giỏ hàng!`);
            }
            refreshCart(); // Luôn làm mới để cập nhật danh sách
        });

        // 3. Một người rời/bị xóa khỏi giỏ hàng NHÓM (từ leaveGroupCart, removeParticipant)
        newSocket.on("participant_left", (data) => {
            console.log("Socket: participant_left", data);
            if (data.userId === user._id) {
                // Chính là BẠN đã rời đi hoặc bị xóa
                toast.warn("Bạn đã rời khỏi giỏ hàng nhóm.");
                router.push("/"); // Đẩy về trang chủ
            } else {
                // Người khác rời đi
                toast.info(`${data.userName} vừa rời khỏi giỏ hàng nhóm!`);
            }
            refreshCart();
        });

        // 4. Món ăn trong giỏ hàng NHÓM thay đổi (từ upsertGroupCartItem)
        const handleGroupItemChange = (eventName, data) => {
            console.log(`Socket: ${eventName}`, data);
            // Kiểm tra xem ai là người gây ra hành động
            const actorId = data.updatedBy || data.addedBy || data.removedBy;
            if (actorId && actorId !== user._id) {
                toast.info("Giỏ hàng nhóm vừa được cập nhật!");
                refreshCart();
            }
        };
        newSocket.on("item_added", (data) =>
            handleGroupItemChange("item_added", data)
        );
        newSocket.on("item_updated", (data) =>
            handleGroupItemChange("item_updated", data)
        );
        newSocket.on("item_removed", (data) =>
            handleGroupItemChange("item_removed", data)
        );

        // 5. Trạng thái giỏ hàng NHÓM thay đổi (khóa, mở khóa, hoàn tất)
        newSocket.on("cart_state_changed", (data) => {
            console.log("Socket: cart_state_changed", data);
            switch (data.newState) {
                case "locking":
                    toast.warn("Chủ nhóm đã khóa giỏ hàng!");
                    refreshCart();
                    break;
                case "active":
                    toast.info("Giỏ hàng đã được mở khóa.");
                    refreshCart();
                    break;
                case "placed":
                    toast.success("Đơn hàng nhóm đã được đặt thành công!");
                    refreshCart(); // Xóa giỏ hàng đã hoàn tất
                    refreshOrder(); // Thêm đơn hàng mới vào danh sách
                    // Tự động chuyển đến trang chi tiết đơn hàng
                    if (data.orderId) {
                        router.push(`/orders/detail-order/${data.orderId}`);
                    }
                    break;
            }
        });

        // 6. Giỏ hàng NHÓM bị chủ nhóm giải tán (từ deleteGroupCart)
        newSocket.on("cart_dissolved", (data) => {
            console.log("Socket: cart_dissolved", data);
            toast.error("Giỏ hàng nhóm đã bị chủ nhóm giải tán.");
            refreshCart();
            router.push("/"); // Đẩy về trang chủ
        });

        // 7. Đặt hàng CÁ NHÂN thành công (từ completeCart)
        newSocket.on("newOrderNotification", (data) => {
            console.log("Socket: newOrderNotification (private cart)", data);
            // Sự kiện này cũng kích hoạt 'newNotification'
            // nhưng chúng ta cần làm mới giỏ hàng và đơn hàng
            if (data.userId === user._id) {
                refreshCart();
                refreshOrder();
                // Không cần toast, vì newNotification đã làm
            }
        });

        return () => {
            // Dọn dẹp tất cả listener
            newSocket.off("connect");
            newSocket.off("getAllNotifications");
            newSocket.off("newNotification");
            newSocket.off("cartUpdated");
            newSocket.off("participant_joined");
            newSocket.off("participant_left");
            newSocket.off("item_added");
            newSocket.off("item_updated");
            newSocket.off("item_removed");
            newSocket.off("cart_state_changed");
            newSocket.off("cart_dissolved");
            newSocket.off("newOrderNotification");
            newSocket.disconnect();
        };
    }, [user, refreshCart, refreshOrder, router]); 
    return (
        <SocketContext.Provider
            value={{ socket, notifications, setNotifications }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
