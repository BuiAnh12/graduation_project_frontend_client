"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/authContext";
import { uploadService } from "@/api/uploadService";
import { userService } from "@/api/userService";

const page = () => {
  const { notifications } = useSocket();

  const [avatarFile, setAvatarFile] = useState(null);

  const { user, fetchUser } = useAuth();

  const handleUploadAvatar = async () => {
    if (avatarFile) {
      try {
        const formData = new FormData();
        for (let i = 0; i < avatarFile?.length; i++) {
          formData.append("file", avatarFile[i]);
        }
        await uploadService.uploadAvatar(formData);
        setAvatarFile(null);

        await fetchUser(user?._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (avatarFile) {
      handleUploadAvatar();
    }
  }, [avatarFile]);

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên!"),
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    phonenumber: yup.string().required("Vui lòng nhập số điện thoại!"),
    gender: yup.string().required("Vui lòng chọn giới tính!"),
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phonenumber: user?.phonenumber || "",
      gender: user?.gender || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await userService.updateUser(values);
        toast.success("Cập nhật thành công!");
        await fetchUser(user?._id);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className='pt-[30px] pb-[100px] px-[20px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]'>
      <Heading title='Thông tin cá nhân' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='account' />
      </div>

      <div className='flex items-center justify-between md:hidden'>
        <h3 className='text-[#4A4B4D] text-[28px] font-bold'>Thông tin cá nhân</h3>
        <Link href='/notifications' className='relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]'>
          <Image src='/assets/notification.png' alt='' layout='fill' objectFit='contain' />

          {notifications.filter((noti) => noti.status === "unread").length > 0 && (
            <div className='absolute top-[-6px] right-[-6px] w-[21px] h-[21px] text-center rounded-full bg-[#fc6011] border-solid border-[1px] border-white flex items-center justify-center'>
              <span className='text-[11px] text-white'>
                {notifications.filter((noti) => noti.status === "unread").length}
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden md:p-[20px]'>
        <div className='flex flex-col items-center mt-[20px]'>
          <div className='relative w-[110px] pt-[110px] mt-[20px] '>
            <Image
              src={
                user?.avatarImage?.url ||
                "https://res.cloudinary.com/datnguyen240/image/upload/v1722168751/avatars/avatar_pnncdk.png"
              }
              alt=''
              layout='fill'
              objectFit='fill'
              className='object-cover rounded-full'
            />
            <Dropzone
              maxFiles={1}
              accept={{ "image/*": [] }}
              onDrop={(acceptedFiles) =>
                setAvatarFile(
                  acceptedFiles.map((file) =>
                    Object.assign(file, {
                      preview: URL.createObjectURL(file),
                    })
                  )
                )
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section className='w-full'>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Image
                      src='/assets/camera.png'
                      alt=''
                      width={40}
                      height={40}
                      className='absolute bottom-[-4px] right-[-4px] object-contain z-10 p-[6px] rounded-full bg-[#f5f5f5] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'
                    />
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className='py-[10px]'>
            <span className='text-[#fc6011] text-[14px] font-bold'>Chỉnh sửa thông tin</span>
          </div>
          <h3 className='text-[#4A4B4D] text-[26px] font-bold pb-[10px] text-center'>Xin chào {user?.name}</h3>
        </div>

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-[20px] md:gap-[10px]'>
          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Họ và tên</span>
            <input
              type='text'
              name='name'
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              placeholder='Nhập tên'
              className='bg-[#f5f5f5] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
              value={formik.values.name}
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <div className='text-red-500 text-sm'>{formik.errors.name}</div>
          ) : null}

          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Email</span>
            <input
              type='email'
              name='email'
              placeholder='Nhập email của bạn'
              value={formik.values.email}
              className='bg-[#f5f5f5] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
            />
          </div>

          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Số điện thoại</span>
            <input
              type='text'
              name='phonenumber'
              onChange={formik.handleChange("phonenumber")}
              onBlur={formik.handleBlur("phonenumber")}
              placeholder='Nhập số điện thoại'
              value={formik.values.phonenumber}
              className='bg-[#f5f5f5] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
            />
          </div>
          {formik.touched.phonenumber && formik.errors.phonenumber ? (
            <div className='text-red-500 text-sm'>{formik.errors.phonenumber}</div>
          ) : null}

          <div className='w-full my-[10px] flex gap-[2px] flex-col justify-between'>
            <div className='flex gap-[10px] flex-row'>
              <label
                className={`flex items-center justify-between flex-1 p-[12px] rounded-[6px] border border-solid text-subColor ${
                  formik.touched.gender && formik.errors.gender !== undefined ? "border-red-500" : "border-[#7a7a7a]"
                }`}
                htmlFor='female'
              >
                Nữ
                <input
                  type='radio'
                  name='gender'
                  id='female'
                  value='female'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.gender === "female"}
                />
              </label>

              <label
                className={`flex items-center justify-between flex-1 p-[12px] rounded-[6px] border border-solid border-borderColor text-subColor ${
                  formik.touched.gender && formik.errors.gender !== undefined ? "border-red-500" : "border-[#7a7a7a]"
                }`}
                htmlFor='male'
                onChange={formik.handleChange("gender")}
                onBlur={formik.handleBlur("gender")}
              >
                Nam
                <input
                  type='radio'
                  name='gender'
                  id='male'
                  value='male'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.gender === "male"}
                />
              </label>

              <label
                className={`flex items-center justify-between flex-1 p-[12px] rounded-[6px] border border-solid border-borderColor text-subColor ${
                  formik.touched.gender && formik.errors.gender !== undefined ? "border-red-500" : "border-[#7a7a7a]"
                }`}
                htmlFor='other'
                onChange={formik.handleChange("gender")}
                onBlur={formik.handleBlur("gender")}
              >
                Khác
                <input
                  type='radio'
                  name='gender'
                  id='other'
                  value='other'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.gender === "other"}
                />
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender ? (
              <div className='text-red-500 text-sm'>{formik.errors.gender}</div>
            ) : null}
          </div>

          <button
            type='submit'
            className={`text-center text-[#fff] font-semibold w-full p-[20px] rounded-full my-[10px] shadow-md hover:shadow-lg ${
              formik.isValid && formik.dirty ? "bg-[#fc6011] cursor-pointer" : "bg-[#f5854d] cursor-not-allowed"
            }`}
          >
            Lưu
          </button>
        </form>
      </div>

      <div className='block md:hidden'>
        <NavBar page='account' />
      </div>
    </div>
  );
};

export default page;
