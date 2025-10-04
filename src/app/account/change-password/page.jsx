"use client";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSocket } from "@/context/socketContext";
import { authService } from "@/api/authService";

const page = () => {
  const { notifications } = useSocket();

  const [showPass, setShowPass] = useState(false);

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Vui lòng nhập mật khẩu cũ!"),
    newPassword: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự!").required("Vui lòng nhập mật khẩu!"),
    confirmPassword: yup
      .string()
      .min(6, "Nhập lại mật khẩu phải có ít nhất 6 ký tự!")
      .oneOf([yup.ref("newPassword"), null], "Mật khẩu nhập lại không khớp!")
      .required("Vui lòng nhập lại mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await authService.changePassword(values);
        toast.success("Cập nhật thành công!");
        formik.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className='pt-[30px] pb-[100px] px-[20px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]'>
      <Heading title='Đổi mật khẩu' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='account' />
      </div>

      <div className='flex items-center justify-between md:hidden'>
        <h3 className='text-[#4A4B4D] text-[28px] font-bold'>Đổi mật khẩu</h3>
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
          <h3 className='text-[#4A4B4D] text-[26px] font-bold pb-[10px] hidden md:block'>Đổi mật khẩu</h3>
        </div>

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-[20px] md:gap-[10px] bg-transparent'>
          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Mật khẩu cũ</span>
            <input
              type={showPass ? "text" : "password"}
              value={formik.values.oldPassword}
              onChange={formik.handleChange("oldPassword")}
              onBlur={formik.handleBlur("oldPassword")}
              placeholder='Nhập mật khẩu cũ của bạn'
              className='bg-[#e8e9e9] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
            />
            {showPass ? (
              <Image
                src='/assets/eye_show.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <Image
                src='/assets/eye_hide.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
          {formik.touched.oldPassword && formik.errors.oldPassword ? (
            <div className='text-red-500 text-sm mt-[5px] ml-[20px]'>{formik.errors.oldPassword}</div>
          ) : null}

          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Mật khẩu mới</span>
            <input
              type={showPass ? "text" : "password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange("newPassword")}
              onBlur={formik.handleBlur("newPassword")}
              placeholder='Nhập mật khẩu của bạn'
              className='bg-[#e8e9e9] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
            />
            {showPass ? (
              <Image
                src='/assets/eye_show.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <Image
                src='/assets/eye_hide.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className='text-red-500 text-sm mt-[5px] ml-[20px]'>{formik.errors.newPassword}</div>
          ) : null}

          <div className='relative flex items-center bg-[#f5f5f5] text-[#636464] w-full rounded-[12px] gap-[8px] overflow-hidden'>
            <span className='absolute top-[12px] left-[20px] text-[13px] md:text-[11px]'>Nhập lại mật khẩu</span>
            <input
              type={showPass ? "text" : "password"}
              name='confirmPassword'
              value={formik.values.confirmPassword}
              onChange={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              placeholder='Nhập lại mật khẩu'
              className='bg-[#e8e9e9] text-[18px] w-full px-[20px] pt-[28px] pb-[12px]'
            />
            {showPass ? (
              <Image
                src='/assets/eye_show.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <Image
                src='/assets/eye_hide.png'
                alt=''
                width={25}
                height={25}
                className='absolute top-[50%] right-[25px] translate-y-[-50%]'
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className='text-red-500 text-sm mt-[5px] ml-[20px]'>{formik.errors.confirmPassword}</div>
          ) : null}

          <button
            type='submit'
            className={`text-center text-[#fff] font-semibold w-full p-[20px] rounded-full my-[10px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] ${
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
