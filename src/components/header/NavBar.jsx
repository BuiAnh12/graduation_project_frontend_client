"use client";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { useFavorite } from "@/context/favoriteContext";
import { useOrder } from "@/context/orderContext";
import { useSocket } from "@/context/socketContext";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const NavBar = ({ page }) => {
  const { user } = useAuth();
  const { notifications } = useSocket();
  const { favorite } = useFavorite();
  const { cart } = useCart();
  const { order } = useOrder();

  const currentOrders = useMemo(() => order?.filter((o) => o.status !== "done"), [order]);

  const NAV_ITEMS = [
    {
      id: "cart",
      label: "Giỏ hàng",
      href: "/carts",
      icon: "/assets/cart.png",
      activeIcon: "/assets/cart_active.png",
      badge: cart?.length,
    },
    {
      id: "orders",
      label: "Đơn hàng",
      href: "/orders",
      icon: "/assets/ic_order.png",
      activeIcon: "/assets/ic_order_active.png",
      badge: currentOrders?.length,
    },
    {
      id: "notifications",
      label: "Thông báo",
      href: "/notifications",
      icon: "/assets/notification.png",
      activeIcon: "/assets/notification_active.png",
      badge: notifications.filter((n) => n.status === "unread").length,
      desktopOnly: true,
    },
    {
      id: "favorite",
      label: "Yêu thích",
      href: "/favorite",
      icon: "/assets/favorite.png",
      activeIcon: "/assets/favorite-active.png",
      badge: favorite?.stores?.length,
    },
    {
      id: "account",
      label: "Tài khoản",
      href: "/account",
      icon: "/assets/account.png",
      activeIcon: "/assets/account_active.png",
    },
  ];

  if (!user)
    return (
      <div className="fixed bottom-0 z-[99] flex items-center justify-center gap-4 w-full h-[75px] bg-white shadow-[0_-5px_25px_rgba(0,0,0,0.1)] md:bg-transparent md:shadow-none md:relative">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          Đăng ký
        </Link>
      </div>
    );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[99] flex items-center justify-between px-8 bg-white shadow-[0_-5px_25px_rgba(0,0,0,0.1)] md:relative md:bg-transparent md:shadow-none md:gap-6">
      <div className="flex items-center gap-6 w-full justify-between md:justify-normal py-4">
        {NAV_ITEMS.map((item) => {
          if (item.desktopOnly && window.innerWidth < 768) return null;

          const isActive = page === item.id;
          const badgeCount = item.badge ?? 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative group flex flex-col items-center gap-1"
            >
              <Image
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <p
                className={`text-xs ${
                  isActive ? "text-primary font-medium" : "text-gray-600"
                } group-hover:text-primary`}
              >
                {item.label}
              </p>

              {badgeCount > 0 && (
                <div className="absolute -top-1 left-8 w-[24px] h-[24px] text-center rounded-full bg-primary text-red text-[12px] flex items-center justify-center border border-red">
                  {badgeCount}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Floating Home Button */}
      <Link
        href="/home"
        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-[15px] rounded-full md:hidden shadow-md"
      >
        <Image
          src="/assets/tab_home.png"
          alt="Home"
          width={70}
          height={70}
          className={`p-5 rounded-full transition-all ${
            page === "home" ? "bg-primary" : "bg-gray-300"
          }`}
        />
      </Link>
    </nav>
  );
};

export default NavBar;
