"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { authService } from "@/api/authService";
import { useAuth } from "@/context/authContext";

const page = () => {
  const { user, setUser, setUserId } = useAuth();

  const confirmLogout = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      background: "#fff",
      color: "#333",
    });

    if (result.isConfirmed) {
      try {
        await authService.logout();
        setUserId(null);
        setUser(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="pt-[30px] pb-[100px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f7f7f7] min-h-screen">
      <Heading title="Tài khoản" description="" keywords="" />

      {/* Header */}
      <div className="hidden md:block">
        <Header page="account" />
      </div>
      <MobileHeader />

      {/* Account Content */}
      <div className="bg-white lg:w-[70%] md:w-[80%] mx-auto rounded-[12px] md:shadow-[0_4px_15px_rgba(0,0,0,0.1)] overflow-hidden px-5 pb-6 md:pb-10 mt-4">
        {/* Profile section */}
        <Link
          href="/account/profile"
          className="flex items-center gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <div className="relative w-[60px] h-[60px] flex-shrink-0">
            <Image
              src={
                user?.avatarImage?.url ||
                "/assets/avatar_default.png"
              }
              alt="Avatar"
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex flex-1 justify-between items-center px-2">
            <div>
              <p className="text-[20px] font-semibold text-gray-800">{user?.name}</p>
              <p className="text-[15px] text-gray-500">{user?.phonenumber}</p>
            </div>
            <Image
              src="/assets/arrow_right.png"
              alt="arrow"
              width={18}
              height={18}
              className="opacity-70"
            />
          </div>
        </Link>

        {/* Menu links */}
        <div className="divide-y divide-gray-200 mt-4">
          <MenuItem
            href="/account/location"
            icon="/assets/location.png"
            label="Địa chỉ"
          />
          {!user?.isGoogleLogin && (
            <MenuItem
              href="/account/change-password"
              icon="/assets/lock.png"
              label="Đổi mật khẩu"
            />
          )}
          <MenuItem
            href="/favorite"
            icon="/assets/favorite.png"
            label="Yêu thích"
            className="md:hidden"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={confirmLogout}
          className="mt-6 bg-gradient-to-r from-[#e50914] to-[#ff1f1f] text-white font-semibold w-full py-4 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-transform"
        >
          Đăng Xuất
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="block md:hidden">
        <NavBar page="account" />
      </div>
    </div>
  );
};

export default page;

/* --- Sub Component for MenuItem --- */
const MenuItem = ({ href, icon, label, className = "" }) => (
  <Link
    href={href}
    className={`flex justify-between items-center py-3 px-2 hover:bg-gray-50 transition ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className="relative w-[28px] h-[28px]">
        <Image src={icon} alt={label} fill className="object-contain" />
      </div>
      <span className="text-[18px] font-medium text-gray-700">{label}</span>
    </div>
    <Image
      src="/assets/arrow_right.png"
      alt="arrow"
      width={18}
      height={18}
      className="opacity-70"
    />
  </Link>
);
