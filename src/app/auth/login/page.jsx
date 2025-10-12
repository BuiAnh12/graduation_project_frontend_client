"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { authService } from "@/api/authService";
import ErrorCode from "@/constants/ErrorCode";

const page = () => {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    password: yup.string().required("Vui lòng nhập mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const res = await authService.login(values);
        console.log(res)
        if (res.success == false) {
          const errorCode = res.errorCode
          toast.error("Đăng nhập thất bại")
        }
        else {
          router.push("/home");
          toast.success("Đăng nhập thành công!");
          formik.resetForm();
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <div className='bg-[#fff] md:bg-[#f9f9f9] md:pt-[110px] '>
      <Heading title='Đăng nhập' description='' keywords='' />
      <div className='hidden md:block'>
        <Header />
      </div>
      <div className='bg-[#fff] lg:w-[60%] md:w-[90%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
        <div className='flex flex-col items-center justify-between py-[30px] h-screen md:h-full'>
          <div className='flex flex-col items-center w-full'>
            <h3 className='text-[#4A4B4D] text-[30px] font-bold pb-[20px]'>Đăng nhập</h3>
            <Image src='/assets/logo_app.png' alt='' height={150} width={150} className='mb-[10px]' />

            <form onSubmit={formik.handleSubmit} className='flex flex-col items-center w-full'>
              <div className='w-[90%] my-[10px]'>
                <div
                  className={`relative flex items-center bg-[#f5f5f5] text-[#636464] rounded-[12px] gap-[8px] border border-solid overflow-hidden ${
                    formik.touched.email && formik.errors.email ? "border-red-500" : "border-[#7a7a7a]"
                  }`}
                >
                  <div className='relative w-[25px] h-[25px] ml-[20px]'>
                    <Image src='/assets/email.png' alt='' layout='fill' loading='lazy' className='' />
                  </div>
                  <input
                    type='email'
                    name='email'
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    placeholder='Nhập email của bạn'
                    className='bg-[#f5f5f5] text-[18px] py-[20px] pr-[20px] pl-[10px] w-full'
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className='text-red-500 text-sm mt-[5px] ml-[20px]'>{formik.errors.email}</div>
                ) : null}
              </div>

              <div className='w-[90%] my-[10px]'>
                <div
                  className={`relative flex items-center bg-[#f5f5f5] text-[#636464] rounded-[12px] gap-[8px] border border-solid overflow-hidden ${
                    formik.touched.password && formik.errors.password ? "border-red-500" : "border-[#7a7a7a]"
                  }`}
                >
                  <div className='relative w-[25px] h-[25px] ml-[20px]'>
                    <Image src='/assets/lock.png' alt='' layout='fill' loading='lazy' className='' />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    name='password'
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    placeholder='Nhập mật khẩu của bạn'
                    className='bg-[#f5f5f5] text-[18px] py-[20px] pr-[20px] pl-[10px] w-full'
                  />
                  {showPass ? (
                    <Image
                      src='/assets/eye_show.png'
                      alt=''
                      width={25}
                      height={25}
                      className='absolute top-[50%] right-[5%] translate-y-[-50%] cursor-pointer'
                      onClick={() => setShowPass(!showPass)}
                    />
                  ) : (
                    <Image
                      src='/assets/eye_hide.png'
                      alt=''
                      width={25}
                      height={25}
                      className='absolute top-[50%] right-[5%] translate-y-[-50%] cursor-pointer'
                      onClick={() => setShowPass(!showPass)}
                    />
                  )}
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className='text-red-500 text-sm mt-[5px] ml-[20px]'>{formik.errors.password}</div>
                ) : null}
              </div>

              <button
                type='submit'
                name='submitBtn'
                className={`text-center text-[#fff] font-semibold w-[90%] p-[20px] rounded-full my-[10px] shadow-md hover:shadow-lg ${
                  formik.isValid && formik.dirty ? "bg-[#fc2111] cursor-pointer" : "bg-[#f5854d] cursor-not-allowed"
                }`}
              >
                Đăng nhập
              </button>
            </form>

            <Link href='/auth/forgot-password' className='text-[#636464] font-semibold my-[10px] cursor-pointer'>
              Quên mật khẩu?
            </Link>

            {/* <div className='relative bg-[#636464] h-[1px] w-[90%] mb-[20px] mt-[30px]'>
              <span className='absolute right-[45%] top-[-10px] text-[#636464] font-medium bg-[#fff]'>Hoặc</span>
            </div> */}

            <div className='login-google__button w-[90%] rounded-full my-[10px] overflow-hidden cursor-pointer shadow-md hover:shadow-lg'>
              {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    const token = credentialResponse.credential;

                    if (!token) {
                      toast.error("Không lấy được token từ Google");
                      return;
                    }

                    try {
                      const res = await authService.loginWithGoogle({ token });
                      toast.success("Đăng nhập Google thành công!");
                      router.push("/");
                    } catch (error) {
                      toast.error(error.response.data.message);
                    }
                  }}
                  onError={() => {
                    toast.error("Google login thất bại");
                  }}
                  shape='pill'
                  width='100%'
                />
              </GoogleOAuthProvider> */}
            </div>
          </div>

          <p className='text-[#636464] font-semibold mt-[20px]'>
            Chưa có tài khoản?{" "}
            <Link href='/auth/register' className='text-[#fc2111] cursor-pointer'>
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
