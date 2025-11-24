"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { authService } from "@/api/authService";
import { useAuth } from "@/context/authContext";

const LoginPage = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const { fetchUser } = useAuth();
  const searchParams = useSearchParams();
  const schema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    password: yup.string().required("Vui lòng nhập mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const res = await authService.login(values);
        console.log(res)
        if (!res.success) {

        } else {
          // // toast.success("Đăng nhập thành công!");
          // localStorage.setItem("userId", JSON.stringify(res.data._id));
          await fetchUser(res.data._id);
          formik.resetForm();
          const redirectUrl = searchParams.get("redirect");

          if (redirectUrl) {
            // If redirect exists (e.g., /join-cart/token123), go there
            router.push(redirectUrl);
          } else {
            // Default behavior
            router.push("/home");
          }
          
        }
      } catch (error) {
        // toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-100 flex flex-col items-center">
      <Heading title="Đăng nhập" />

      {/* Desktop Header */}
      <div className="hidden md:block w-full">
        <Header />
      </div>
      <div className="bg-transparent w-full max-w-lg md:w-[500px] md:mt-12 rounded-xl p-6 md:p-10 mt-40"></div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md md:w-[500px] mt-8 md:mt-12 rounded-xl shadow-lg p-6 md:p-10">
        <div className="flex flex-col items-center mb-6">
          <Image src="/assets/logo_app.jpg" alt="Logo" width={120} height={120} className="mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Đăng nhập</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative flex items-center">
            <div className="absolute left-3 w-6 h-6">
              <Image src="/assets/email.png" alt="Email" width={24} height={24} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 w-full p-3 rounded-lg border ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          {/* Password Input */}
          <div className="relative flex items-center">
            <div className="absolute left-3 w-6 h-6">
              <Image src="/assets/lock.png" alt="Password" width={24} height={24} />
            </div>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 pr-10 w-full p-3 rounded-lg border ${
                formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              <Image
                src={showPass ? "/assets/eye_show.png" : "/assets/eye_hide.png"}
                alt="Toggle Password"
                width={24}
                height={24}
              />
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              formik.isValid && formik.dirty ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-300 cursor-not-allowed"
            }`}
          >
            Đăng nhập
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-right mt-2">
          <Link href="/auth/forgot-password" className="text-orange-500 hover:underline text-sm">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Google Login Placeholder */}
        {/* <div className="w-full mt-6">
          <div className="w-full bg-red-500 text-white py-3 rounded-lg text-center cursor-not-allowed">
            Đăng nhập với Google (coming soon)
          </div>
        </div> */}

        {/* Register Link */}
        <p className="text-center text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="text-orange-500 font-semibold hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
