"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { useStoreLocation } from "@/context/storeLocationContext";
import { locationService } from "@/api/locationService";

const page = () => {
  const router = useRouter();
  const { id: storeId } = useParams();

  const { storeLocation, setStoreLocation } = useStoreLocation();

  const [name, setName] = useState(storeLocation.name || "");
  const [address, setAddress] = useState(storeLocation.address || "");
  const [contactName, setContactName] = useState(storeLocation.contactName || "");
  const [contactPhonenumber, setContactPhonenumber] = useState(storeLocation.contactPhonenumber || "");
  const [detailAddress, setDetailAddress] = useState(storeLocation.detailAddress || "");
  const [note, setNote] = useState(storeLocation.note || "");
  const [addSuccess, setAddSuccess] = useState(false);

  const addToLocation = async () => {
    if (!name) {
      toast.error("Vui lòng nhập tên!");
    } else {
      try {
        await locationService.addLocation({
          name,
          address,
          location: {
            type: "Point",
            coordinates: [storeLocation?.lon ?? 200, storeLocation?.lat ?? 200],
          },
          detailAddress,
          note,
          contactName,
          contactPhonenumber,
          type: "familiar",
        });
        setAddSuccess(true);
        toast.success("Thêm địa chỉ thành công");
      } catch (error) {
        setAddSuccess(false);
      }
    }
  };

  return (
    <div className='pt-[85px] pb-[90px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]'>
      <Heading title='Thêm chi tiết địa chỉ' />
      <div className='hidden md:block'>
        <Header page='account' />
      </div>

      <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden md:p-[20px]'>
        <div
          className='fixed top-0 right-0 left-0 z-10 flex items-center gap-[40px] bg-[#fff] h-[85px] px-[10px] md:static'
          style={{ borderBottom: "6px solid #e0e0e0a3" }}
        >
          <Link href={`/store/${storeId}/cart`} className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'>
            <Image src='/assets/arrow_left_long.png' alt='' layout='fill' objectFit='contain' />
          </Link>
          <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Thêm chi tiết địa chỉ</h3>
        </div>

        <form>
          <div
            className='relative flex items-center bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px] gap-[8px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex absolute top-[10px] left-[10px]'>
              <span className='text-[14px] text-red-500 md:text-[12px]'>*</span>
              <span className='text-[14px] md:text-[12px] text-[#000]'>Tên</span>
            </div>
            <input
              type='text'
              name=''
              id=''
              placeholder=''
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='bg-transparent text-[18px] md:text-[14px]'
            />
          </div>

          <div
            className='relative flex items-center justify-between gap-[10px] bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex-1 line-clamp-1'>
              <div className='flex absolute top-[10px] left-[10px]'>
                <span className='text-[14px] text-red-500 md:text-[12px]'>*</span>
                <span className='text-[14px] md:text-[12px] text-[#000]'>Địa chỉ</span>
              </div>
              <input
                type='text'
                name=''
                id=''
                placeholder=''
                readOnly
                value={address}
                className='bg-transparent text-[18px] md:text-[14px] w-full'
              />
            </div>
          </div>

          <div
            className='relative flex items-center bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px] gap-[8px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex absolute top-[10px] left-[10px]'>
              <span className='text-[14px] md:text-[12px] text-[#000]'>Địa chỉ chi tiết</span>
            </div>
            <input
              type='text'
              name=''
              id=''
              onChange={(e) => setDetailAddress(e.target.value)}
              value={detailAddress}
              placeholder='Vd: tên toàn nhà / địa chỉ gần đó'
              className='bg-transparent text-[18px] md:text-[14px] w-full'
            />
          </div>

          <div
            className='relative flex items-center bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px] gap-[8px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex absolute top-[10px] left-[10px]'>
              <span className='text-[14px] md:text-[12px] text-[#000]'>Ghi chú cho tài xế</span>
            </div>
            <input
              type='text'
              name=''
              id=''
              onChange={(e) => setNote(e.target.value)}
              value={note}
              placeholder='Chỉ dẫn chi tiết địa chỉ cho tài xế'
              className='bg-transparent text-[18px] md:text-[14px] w-full'
            />
          </div>

          <div
            className='relative flex items-center bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px] gap-[8px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex absolute top-[10px] left-[10px]'>
              <span className='text-[14px] text-red-500 md:text-[12px]'>*</span>
              <span className='text-[14px] md:text-[12px] text-[#000]'>Tên người nhận</span>
            </div>
            <input
              type='text'
              name='contactName'
              id=''
              placeholder=''
              onChange={(e) => setContactName(e.target.value)}
              value={contactName}
              className='bg-transparent text-[18px] md:text-[14px] w-full'
            />
          </div>

          <div
            className='relative flex items-center bg-[#fff] text-[#636464] w-full px-[10px] pt-[28px] pb-[12px] gap-[8px]'
            style={{ borderBottom: "1px solid #e0e0e0a3" }}
          >
            <div className='flex absolute top-[10px] left-[10px]'>
              <span className='text-[14px] text-red-500 md:text-[12px]'>*</span>
              <span className='text-[14px] md:text-[12px] text-[#000]'>Số điện thoại liên lạc</span>
            </div>
            <input
              type='text'
              name='contactPhonenumber'
              id=''
              placeholder=''
              onChange={(e) => setContactPhonenumber(e.target.value)}
              value={contactPhonenumber}
              className='bg-transparent text-[18px] md:text-[14px] w-full'
            />
          </div>

          <div className='flex items-center justify-between gap-[10px] p-[20px]'>
            <div className='flex flex-col'>
              <span className='text-[18px] text-[#4a4b4d] font-bold'>Thêm vào Địa chỉ đã lưu</span>
              <span className='text-[15px] text-[#a4a5a8]'>Lưu nơi này cho các đơn đặt hàng cho tương lai</span>
            </div>

            <div className='relative w-[25px] pt-[25px] cursor-pointer' onClick={addToLocation}>
              <Image
                src={`/assets/favorite${addSuccess ? "-active" : ""}.png`}
                alt=''
                layout='fill'
                objectFit='contain'
              />
            </div>
          </div>
        </form>
      </div>

      <div className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[10px] py-[15px] z-[100] flex items-center gap-[10px]'>
        <button
          onClick={() => {
            setStoreLocation({
              address,
              contactName,
              contactPhonenumber,
              detailAddress,
              name,
              note,
              lat: storeLocation.lat,
              lon: storeLocation.lon,
            });
            router.push(`/store/${storeId}/cart`);
          }}
          className='flex items-center justify-center lg:w-[60%] md:w-[80%] md:mx-auto rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[10px] w-full shadow-md hover:shadow-lg'
        >
          <span className='text-[#fff] text-[20px] font-semibold'>Lưu</span>
        </button>
      </div>
    </div>
  );
};

export default page;
