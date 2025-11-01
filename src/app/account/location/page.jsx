"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { locationService } from "@/api/locationService";
import { haversineDistance } from "@/utils/functions";
import { useStoreLocation } from "@/context/storeLocationContext";

const page = () => {
  const router = useRouter();
  const { setStoreLocation, storeId } = useStoreLocation();

  const [currentPosition, setCurrentPosition] = useState(null);
  const [deleteLocationId, setDeleteLocationId] = useState("");
  const [userLocations, setUserLocations] = useState(null);

  const getUserLocations = async () => {
    try {
      const response = await locationService.getUserLocations();
      setUserLocations(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getUserLocations();
  }, []);

  const homeLocation = userLocations?.filter((location) => location.type === "home");
  const companyLocation = userLocations?.filter((location) => location.type === "company");
  const familiarLocations = userLocations?.filter((location) => location.type === "familiar");

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => setCurrentPosition([position.coords.latitude, position.coords.longitude]),
        (error) => console.error("Lỗi lấy vị trí:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else console.error("Trình duyệt không hỗ trợ Geolocation");
  }, []);

  const confirmDeleteLocation = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed && deleteLocationId) {
      try {
        await locationService.deleteLocation(deleteLocationId);
        // toast.success("Xóa địa chỉ thành công!");
        getUserLocations();
        setDeleteLocationId("");
      } catch (error) {
        console.error(error);
      }
    }
    if (result.isDismissed) setDeleteLocationId("");
  };

  useEffect(() => {
    if (deleteLocationId) confirmDeleteLocation();
  }, [deleteLocationId]);

  const renderLocationCard = (location, type) => (
    <div
      key={location._id}
      onClick={() => {
        setStoreLocation({
          address: location.address,
          contactName: location.contactName,
          contactPhonenumber: location.contactPhonenumber,
          detailAddress: location.detailAddress,
          name: location.name,
          note: location.note,
          lat: location.location.coordinates[1],
          lon: location.location.coordinates[0],
        });
        if (storeId) router.push(`/store/${storeId}/cart`);
      }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-md transition cursor-pointer mb-4"
    >
      <div className="flex-shrink-0 p-3 bg-[#fce8e8] rounded-full">
        <div className="relative w-6 h-6">
          <Image
            src={
              type === "home"
                ? "/assets/home_green.png"
                : type === "company"
                ? "/assets/briefcase_green.png"
                : "/assets/favorite-active.png"
            }
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-[#4a4b4d] text-lg font-semibold">{location.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {currentPosition && (
            <>
              <span>
                {haversineDistance(currentPosition, [
                  location.location.coordinates[1],
                  location.location.coordinates[0],
                ]).toFixed(2)}
                km
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </>
          )}
          <span className="line-clamp-1">{location.address}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/account/location/edit-location/${type}/${location._id}`}
          className="relative w-6 h-6"
        >
          <Image src="/assets/editing.png" alt="" layout="fill" objectFit="contain" />
        </Link>

        <div
          onClick={() => setDeleteLocationId(location._id)}
          className="relative w-6 h-6 cursor-pointer"
        >
          <Image src="/assets/trash.png" alt="" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
  );

  const renderAddLocationCard = (type) => (
    <Link
      href={`/account/location/add-location/${type}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-[#fff5f5] border border-[#fc2111] mb-4"
    >
      <div className="flex-shrink-0 p-3 bg-[#ffeaea] rounded-full">
        <div className="relative w-6 h-6">
          <Image
            src={
              type === "home" ? "/assets/add_home.png" : type === "company" ? "/assets/briefcase.png" : "/assets/plus.png"
            }
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="text-[#fc2111] font-semibold text-lg">
          {type === "home" ? "Thêm nhà" : type === "company" ? "Thêm công ty" : "Thêm mới"}
        </h3>
        {type === "familiar" && (
          <span className="text-gray-500 text-sm">Lưu làm địa chỉ thân quen</span>
        )}
      </div>
    </Link>
  );

  return (
    <div className="pt-[85px] px-4 pb-[200px] md:pt-[75px] md:mt-5 md:px-0 bg-[#f9f9f9] min-h-screen">
      <Heading title="Địa chỉ đã lưu" description="" keywords="" />
      <div className="hidden md:block">
        <Header page="account" />
      </div>

      <div className="lg:w-3/5 md:w-4/5 mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-6 mb-6">
          <div
            onClick={() => {
              if (storeId) router.push(`/store/${storeId}/cart`);
              else router.push(`/account`);
            }}
            className="relative w-8 h-8 cursor-pointer"
          >
            <Image src="/assets/arrow_left_long.png" alt="" layout="fill" objectFit="contain" />
          </div>
          <h3 className="text-[#4A4B4D] text-2xl font-bold">Địa chỉ đã lưu</h3>
        </div>

        {/* Home Location */}
        {homeLocation && homeLocation.length > 0
          ? renderLocationCard(homeLocation[0], "home")
          : renderAddLocationCard("home")}

        {/* Company Location */}
        {companyLocation && companyLocation.length > 0
          ? renderLocationCard(companyLocation[0], "company")
          : renderAddLocationCard("company")}

        {/* Familiar Locations */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          {familiarLocations && familiarLocations.length > 0
            ? familiarLocations.map((location) => renderLocationCard(location, "familiar"))
            : null}
          {renderAddLocationCard("familiar")}
        </div>
      </div>
    </div>
  );
};

export default page;
