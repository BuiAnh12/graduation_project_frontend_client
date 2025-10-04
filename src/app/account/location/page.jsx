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
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentPosition(newLocation);
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation");
    }
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

        toast.success("Xóa địa chỉ thành công!");
        getUserLocations();
        setDeleteLocationId("");
      } catch (error) {
        console.error(error);
      }
    }

    if (result.isDismissed) {
      setDeleteLocationId("");
    }
  };

  useEffect(() => {
    if (deleteLocationId) {
      confirmDeleteLocation();
    }
  }, [deleteLocationId]);

  return (
    <div className='pt-[85px] px-[20px] pb-[200px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]'>
      <Heading title='Địa chỉ đã lưu' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='account' />
      </div>

      <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden md:p-[20px]'>
        <div className='fixed top-0 right-0 left-0 z-10 px-[20px] md:px-[0px] flex items-center gap-[40px] bg-[#fff] h-[85px] md-[0px] md:static'>
          <div
            onClick={() => {
              if (storeId) {
                router.push(`/store/${storeId}/cart`);
              } else {
                router.push(`/account`);
              }
            }}
            className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'
          >
            <Image src='/assets/arrow_left_long.png' alt='' layout='fill' objectFit='contain' />
          </div>
          <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Địa chỉ đã lưu</h3>
        </div>

        <div className=''>
          {homeLocation && homeLocation.length > 0 ? (
            <div
              onClick={() => {
                setStoreLocation({
                  address: homeLocation[0].address,
                  contactName: homeLocation[0].contactName,
                  contactPhonenumber: homeLocation[0].contactPhonenumber,
                  detailAddress: homeLocation[0].detailAddress,
                  name: homeLocation[0].name,
                  note: homeLocation[0].note,
                  lat: homeLocation[0].location.coordinates[1],
                  lon: homeLocation[0].location.coordinates[0],
                });
                if (storeId) {
                  router.push(`/store/${storeId}/cart`);
                }
              }}
              className='flex items-center gap-[15px] mb-[20px] cursor-pointer'
            >
              <div className='p-[8px] bg-[#e0e0e0a3] rounded-full h-fit'>
                <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px]'>
                  <Image src='/assets/home_green.png' alt='' layout='fill' objectFit='contain' />
                </div>
              </div>
              <div className='flex flex-1 items-center justify-between'>
                <div className='flex flex-col mr-[10px]'>
                  <h3 className='text-[#4a4b4d] text-[20px] font-bold'>{homeLocation[0].name}</h3>
                  <div className='flex items-center gap-[4px]'>
                    {currentPosition && (
                      <>
                        <span className='text-[#a4a5a8] text-[15px]'>
                          {haversineDistance(currentPosition, [
                            homeLocation[0].location.coordinates[1],
                            homeLocation[0].location.coordinates[0],
                          ]).toFixed(2)}
                          km
                        </span>
                        <div className='w-[4px] h-[4px] rounded-full bg-[#a4a5a8]'></div>
                      </>
                    )}
                    <span className='text-[#a4a5a8] text-[15px] line-clamp-1'>{homeLocation[0].address}</span>
                  </div>
                </div>
                <div className='flex gap-[15px]'>
                  <Link
                    href={`/account/location/edit-location/home/${homeLocation[0]?._id}`}
                    className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                  >
                    <Image src='/assets/editing.png' alt='' layout='fill' objectFit='contain' />
                  </Link>

                  <div
                    onClick={() => {
                      setDeleteLocationId(homeLocation[0]?._id);
                    }}
                    className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                  >
                    <Image src='/assets/trash.png' alt='' layout='fill' objectFit='contain' />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href='/account/location/add-location/home' className='flex gap-[15px] mb-[20px] cursor-pointer'>
              <div className='p-[8px] bg-[#e0e0e0a3] rounded-full h-fit'>
                <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px] '>
                  <Image src='/assets/add_home.png' alt='' layout='fill' objectFit='contain' />
                </div>
              </div>
              <div className='flex flex-1 items-center justify-between'>
                <div className='flex items-center gap-[8px]'>
                  <h3 className='text-[#0054ff] text-[18px] font-semibold'>Thêm nhà</h3>
                </div>
              </div>
            </Link>
          )}

          {companyLocation && companyLocation.length > 0 ? (
            <div
              onClick={() => {
                setStoreLocation({
                  address: companyLocation[0].address,
                  contactName: companyLocation[0].contactName,
                  contactPhonenumber: companyLocation[0].contactPhonenumber,
                  detailAddress: companyLocation[0].detailAddress,
                  name: companyLocation[0].name,
                  note: companyLocation[0].note,
                  lat: companyLocation[0].location.coordinates[1],
                  lon: companyLocation[0].location.coordinates[0],
                });
                if (storeId) {
                  router.push(`/store/${storeId}/cart`);
                }
              }}
              className='flex items-center gap-[15px] mb-[20px] cursor-pointer'
            >
              <div className='p-[8px] bg-[#e0e0e0a3] rounded-full h-fit'>
                <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px]'>
                  <Image src='/assets/briefcase_green.png' alt='' layout='fill' objectFit='contain' />
                </div>
              </div>
              <div className='flex flex-1 items-center justify-between'>
                <div className='flex flex-col mr-[10px]'>
                  <h3 className='text-[#4a4b4d] text-[20px] font-bold'>{companyLocation[0].name}</h3>
                  <div className='flex items-center gap-[4px]'>
                    {currentPosition && (
                      <>
                        <span className='text-[#a4a5a8] text-[15px]'>
                          {haversineDistance(currentPosition, [
                            companyLocation[0].location.coordinates[1],
                            companyLocation[0].location.coordinates[0],
                          ]).toFixed(2)}
                          km
                        </span>
                        <div className='w-[4px] h-[4px] rounded-full bg-[#a4a5a8]'></div>
                      </>
                    )}
                    <span className='text-[#a4a5a8] text-[15px] line-clamp-1'>{companyLocation[0].address}</span>
                  </div>
                </div>
                <div className='flex gap-[15px]'>
                  <Link
                    href={`/account/location/edit-location/company/${companyLocation[0]._id}`}
                    className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                  >
                    <Image src='/assets/editing.png' alt='' layout='fill' objectFit='contain' />
                  </Link>

                  <div
                    onClick={() => {
                      setDeleteLocationId(companyLocation[0]._id);
                    }}
                    className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                  >
                    <Image src='/assets/trash.png' alt='' layout='fill' objectFit='contain' />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href='/account/location/add-location/company' className='flex gap-[15px] mb-[20px] cursor-pointer'>
              <div className='p-[8px] bg-[#e0e0e0a3] rounded-full'>
                <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px]'>
                  <Image src='/assets/briefcase.png' alt='' layout='fill' objectFit='contain' />
                </div>
              </div>
              <div className='flex flex-1 items-center justify-between'>
                <div className='flex items-center gap-[8px]'>
                  <h3 className='text-[#0054ff] text-[18px] font-semibold'>Thêm công ty</h3>
                </div>
              </div>
            </Link>
          )}

          <div className='pt-[20px]' style={{ borderTop: "6px solid #e0e0e0a3" }}>
            {familiarLocations &&
              familiarLocations.length > 0 &&
              familiarLocations.map((location) => (
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
                    if (storeId) {
                      router.push(`/store/${storeId}/cart`);
                    }
                  }}
                  className='flex items-center gap-[15px] mb-[20px] cursor-pointer'
                >
                  <div className='p-[8px] bg-[#e0e0e0a3] rounded-full h-fit'>
                    <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px]'>
                      <Image src='/assets/favorite-active.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                  </div>
                  <div className='flex flex-1 items-center justify-between'>
                    <div className='flex flex-col mr-[10px]'>
                      <h3 className='text-[#4a4b4d] text-[20px] font-bold'>{location.name}</h3>
                      <div className='flex items-center gap-[4px]'>
                        {currentPosition && (
                          <>
                            <span className='text-[#a4a5a8] text-[15px]'>
                              {haversineDistance(currentPosition, [
                                location.location.coordinates[1],
                                location.location.coordinates[0],
                              ]).toFixed(2)}
                              km
                            </span>
                            <div className='w-[4px] h-[4px] rounded-full bg-[#a4a5a8]'></div>
                          </>
                        )}
                        <span className='text-[#a4a5a8] text-[15px] line-clamp-1'>{location.address}</span>
                      </div>
                    </div>
                    <div className='flex gap-[15px]'>
                      <Link
                        href={`/account/location/edit-location/familiar/${location._id}`}
                        className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                      >
                        <Image src='/assets/editing.png' alt='' layout='fill' objectFit='contain' />
                      </Link>

                      <div
                        onClick={() => {
                          setDeleteLocationId(location._id);
                        }}
                        className='relative w-[25px] pt-[25px] md:w-[20px] md:pt-[20px] cursor-pointer'
                      >
                        <Image src='/assets/trash.png' alt='' layout='fill' objectFit='contain' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            <Link
              href='/account/location/add-location/familiar'
              className='flex items-center gap-[15px] mb-[20px] cursor-pointer'
            >
              <div className='p-[8px] bg-[#e0e0e0a3] rounded-full h-fit'>
                <div className='relative w-[20px] pt-[20px] md:w-[20px] md:pt-[20px]'>
                  <Image src='/assets/plus.png' alt='' layout='fill' objectFit='contain' />
                </div>
              </div>
              <div className='flex flex-1 items-center justify-between'>
                <div className='flex flex-col mr-[10px]'>
                  <h3 className='text-[#0054ff] text-[18px] font-semibold'>Thêm mới</h3>
                  <div className='flex items-center gap-[4px]'>
                    <span className='text-[#a4a5a8] text-[15px]'>Lưu làm địa chỉ thân quen</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
