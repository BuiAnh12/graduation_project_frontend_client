"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const ENDPOINT = "http://localhost:5000" || "";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newSocket = io(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id); // ID của socket
    });

    // Đăng ký userId với server
    newSocket.emit("registerUser", user._id);

    // Nhận danh sách thông báo cũ khi kết nối
    newSocket.on("getAllNotifications", (allNotifications) => {
      setNotifications(allNotifications);
    });

    // Nhận thông báo mới
    newSocket.on("newNotification", (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
