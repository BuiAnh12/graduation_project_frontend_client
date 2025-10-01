"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { provinces } from "../../utils/constants";
import { getClosestProvince } from "../../utils/functions";
import MobileHeader from "./MobileHeader";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";
import { useProvince } from "@/context/provinceContext";

const Header = ({ page }) => {
  const [province, setProvince] = useState({ name: "", lat: 200, lon: 200 });
  const [openSelectProvince, setOpenSelectProvince] = useState(false);

  const { setCurrentLocation, currentLocation } = useProvince();

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
          (error) => console.error("Lỗi khi lấy vị trí:", error)
        );
      }
    }
  }, []);

  return (
    <header className='fixed top-0 right-0 left-0 z-[99] bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-300'>
      {/* Mobile Header */}
      <div className='pt-[10px] md:pt-[30px] h-fit md:h-[180px] md:hidden'>
        <MobileHeader />
        <div className='px-[20px] mt-2'>
          <SearchBar />
        </div>
      </div>

      {/* Desktop Header */}
      <div className='w-[90%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between'>
          {/* Logo + Search */}
          <div className='flex items-center gap-6 md:w-[45%] lg:w-[40%]'>
            <Link href='/home' className='relative w-[60px] h-[60px] flex-shrink-0'>
              <Image
                src='/assets/logo_app.png'
                layout='fill'
                objectFit='contain'
                alt='Logo'
                className='hover:scale-105 transition-transform'
              />
            </Link>

            <div className='flex-1 max-w-[400px]'>
              <SearchBar />
            </div>
          </div>

          {/* Right Side */}
          <div className='flex items-center'>
            <NavBar page={page} />

            {/* Province Selector */}
            <div className='relative ml-4'>
              <button
                className='flex items-center gap-2 p-2 bg-gradient-to-r from-[#fc6011] to-[#ff8533] rounded-full text-white font-medium shadow-md hover:shadow-lg transition'
                onClick={() => setOpenSelectProvince(!openSelectProvince)}
              >
                <Image src='/assets/star_yellow.png' alt='Location' width={18} height={18} className='drop-shadow-md' />
                <span className='text-sm whitespace-nowrap'>{province.name || "Chọn tỉnh"}</span>
              </button>

              {openSelectProvince && (
                <div className='absolute top-[60px] right-0 z-[100] h-[350px] w-[220px] bg-white rounded-lg overflow-y-auto shadow-xl border border-gray-200 animate-fadeIn'>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
