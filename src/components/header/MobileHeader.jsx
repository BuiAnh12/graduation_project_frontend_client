import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { provinces } from "@/utils/constants";
import { getClosestProvince } from "@/utils/functions";
import { useSocket } from "@/context/socketContext";
import { useProvince } from "@/context/provinceContext";

const MobileHeader = ({ page }) => {
  const [province, setProvince] = useState({ name: "", lat: 200, lon: 200 });
  const [openSelectProvince, setOpenSelectProvince] = useState(false);

  const { setCurrentLocation, currentLocation } = useProvince();

  const { notifications } = useSocket();

  const { user } = useAuth();

  const handleProvinceChange = (prov) => {
    setProvince(prov);
    setCurrentLocation({ lat: prov.lat, lon: prov.lon });
  };

  useEffect(() => {
    if (currentLocation.lat !== 200) {
      setProvince(getClosestProvince({ lat: currentLocation.lat, lon: currentLocation.lon }));
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const userLat = pos.coords.latitude;
            const userLon = pos.coords.longitude;

            setProvince(getClosestProvince({ lat: userLat, lon: userLon }));
          },
          (error) => {
            console.error("Lỗi khi lấy vị trí:", error);
          }
        );
      }
    }
  }, []);

  return (
    <div className='px-[20px] flex items-center justify-between md:hidden'>
      <Link href='/home' className='relative w-[60px] pt-[60px] h-[60px]'>
        <Image src='/assets/logo_app.png' layout='fill' objectFit='contain' alt='' />
      </Link>
      <div className='flex items-center gap-[15px]'>
        <div className='relative'>
          <button
            className='flex items-center gap-2 p-2 bg-gradient-to-r from-[#fc6011] to-[#ff8533] rounded-full text-white font-medium shadow-md hover:shadow-lg transition'
            onClick={() => setOpenSelectProvince(!openSelectProvince)}
          >
            <Image src='/assets/star_yellow.png' alt='Location' width={18} height={18} className='drop-shadow-md' />
            <span className='text-sm whitespace-nowrap'>{province.name || "Chọn tỉnh"}</span>
          </button>

          {openSelectProvince && (
            <div className='absolute top-[60px] right-[-50px] z-[100] h-[350px] w-[220px] bg-white rounded-lg overflow-y-auto shadow-xl border border-gray-200 animate-fadeIn'>
              {provinces.map((prov) => (
                <div
                  key={prov.name}
                  onClick={() => {
                    setOpenSelectProvince(false);
                    handleProvinceChange(prov);
                  }}
                  className={`py-3 px-4 cursor-pointer hover:bg-[#fc6011]/10 ${
                    prov.name === province.name ? "bg-[#fc6011]/20 font-bold text-[#fc6011]" : "text-gray-700"
                  }`}
                >
                  {prov.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {user && (
          <>
            <Link href='/notifications' className='relative group flex flex-col items-center gap-[1px]'>
              <Image
                src='/assets/notification.png'
                alt=''
                width={24}
                height={24}
                className={`group-hover:hidden  ${page == "notifications" ? "!hidden" : ""}`}
              />
              <Image
                src='/assets/notification_active.png'
                alt=''
                width={24}
                height={24}
                className={`hidden group-hover:block ${page == "notifications" ? "!block" : ""}`}
              />
              <p
                className={`text-[12px] group-hover:text-[#fc6011] ${
                  page == "notifications" ? "text-[#fc6011]" : "text-[#4A4B4D]"
                }`}
              >
                Thông báo
              </p>

              {notifications.filter((noti) => noti.status === "unread").length > 0 && (
                <div className='absolute top-[-6px] right-[6px] w-[21px] h-[21px] text-center rounded-full bg-[#fc6011] border-solid border-[1px] border-white flex items-center justify-center'>
                  <span className='text-[11px] text-white'>
                    {notifications.filter((noti) => noti.status === "unread").length}
                  </span>
                </div>
              )}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
