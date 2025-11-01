"use client";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSocket } from "@/context/socketContext";
import { authService } from "@/api/authService";

const InputField = ({ label, name, placeholder, formik, type = "text", showPass, setShowPass }) => (
  <div className="relative flex flex-col">
    <label
      htmlFor={name}
      className="absolute top-[10px] left-[20px] text-[13px] text-gray-500 pointer-events-none"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type === "password" && showPass ? "text" : type}
      onChange={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
      placeholder={placeholder}
      value={formik.values[name]}
      className="bg-[#f5f5f5] text-[17px] w-full px-[20px] pt-[28px] pb-[12px] rounded-[10px] focus:ring-2 focus:ring-[#e50914]/30 focus:outline-none transition"
    />
    {type === "password" && (
      <Image
        src={showPass ? "/assets/eye_show.png" : "/assets/eye_hide.png"}
        alt="toggle password"
        width={25}
        height={25}
        className="absolute top-[50%] right-[20px] translate-y-[-50%] cursor-pointer"
        onClick={() => setShowPass(!showPass)}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-sm mt-[5px] ml-[5px]">{formik.errors[name]}</div>
    )}
  </div>
);

const ChangePasswordPage = () => {
  const { notifications } = useSocket();
  const [showPass, setShowPass] = useState(false);

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Vui lòng nhập mật khẩu cũ!"),
    newPassword: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự!").required("Vui lòng nhập mật khẩu mới!"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Mật khẩu nhập lại không khớp!")
      .required("Vui lòng nhập lại mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await authService.changePassword(values);
        // // toast.success("Cập nhật thành công!");
        formik.resetForm();
      } catch (error) {
        // // toast.error(error.response?.data?.message || "Cập nhật thất bại!");
        console.error(error);
      }
    },
  });

  return (
    <div className="pt-[30px] pb-[100px] px-[20px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]">
      <Heading title="Đổi mật khẩu" description="" keywords="" />
      <div className="hidden md:block">
        <Header page="account" />
      </div>

      <div className="flex items-center justify-between md:hidden">
        <h3 className="text-[#4A4B4D] text-[28px] font-bold">Đổi mật khẩu</h3>
        <Link href="/notifications" className="relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]">
          <Image src="/assets/notification.png" alt="" layout="fill" objectFit="contain" />
          {notifications.filter((noti) => noti.status === "unread").length > 0 && (
            <div className="absolute top-[-6px] right-[-6px] w-[21px] h-[21px] text-center rounded-full bg-[#fc2111] border-solid border-[1px] border-white flex items-center justify-center">
              <span className="text-[11px] text-white">
                {notifications.filter((noti) => noti.status === "unread").length}
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden md:p-[20px]">
        <div className="flex flex-col items-center mt-[20px]">
          <h3 className="text-[#4A4B4D] text-[26px] font-bold pb-[10px] hidden md:block">Đổi mật khẩu</h3>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[20px] md:gap-[10px] bg-transparent">
          <InputField
            label="Mật khẩu cũ"
            name="oldPassword"
            placeholder="Nhập mật khẩu cũ của bạn"
            formik={formik}
            type="password"
            showPass={showPass}
            setShowPass={setShowPass}
          />

          <InputField
            label="Mật khẩu mới"
            name="newPassword"
            placeholder="Nhập mật khẩu mới"
            formik={formik}
            type="password"
            showPass={showPass}
            setShowPass={setShowPass}
          />

          <InputField
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            formik={formik}
            type="password"
            showPass={showPass}
            setShowPass={setShowPass}
          />

          <button
            type="submit"
            className={`mt-4 text-center font-semibold w-full py-[14px] rounded-full shadow-md transition-all ${
              formik.isValid && formik.dirty ? "bg-gradient-to-r from-[#e50914] to-[#ff4040] text-white hover:shadow-lg active:scale-[0.98]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Lưu
          </button>
        </form>
      </div>

      <div className="block md:hidden">
        <NavBar page="account" />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
