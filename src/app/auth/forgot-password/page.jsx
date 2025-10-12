"use client";
import Image from "next/image";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { authService } from "@/api/authService";
import { useForgotPassEmail } from "@/context/forgotPassEmailContext";

const page = () => {
  const router = useRouter();

  const { setEmail } = useForgotPassEmail();

  const schema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await authService.forgotPassword(values);
        setEmail(values.email);
        formik.resetForm();
        toast.success("Gửi thành công!");
        router.push("/auth/confirm-otp");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <div className='bg-[#fff] md:bg-[#f9f9f9] md:pt-[110px]'>
      <Heading title='Quên mật khẩu' description='' keywords='' />
      <div className='hidden md:block'>
        <Header />
      </div>
      <div className='bg-[#fff] lg:w-[60%] md:w-[90%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden md:h-full'>
        <div className='flex flex-col items-center justify-between py-[30px] h-screen'>
          <div className='flex flex-col items-center w-full'>
            <h3 className='text-[#4A4B4D] text-[30px] font-bold pb-[20px]'>Quên mật khẩu</h3>
            <Image src='/assets/logo_app.png' alt='' height={150} width={150} className='mb-[10px]' />

            <div className='text-[#636464] text-center my-[20px]'>
              <span>Vui lòng nhập email của bạn</span> <br />
              <span>vào ô bên dưới để có thể tạo mật khẩu mới</span> <br />
            </div>

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

              <button
                type='submit'
                className={`text-center text-[#fff] font-semibold w-[90%] p-[20px] rounded-full my-[10px] shadow-md hover:shadow-lg ${
                  formik.isValid && formik.dirty ? "bg-[#fc6011] cursor-pointer" : "bg-[#f5854d] cursor-not-allowed"
                }`}
              >
                Gửi
              </button>
            </form>
          </div>

          <p className='text-[#636464] font-semibold mt-[30px] mb-[10px]'>
            Đã có tài khoản{" "}
            <Link href='/auth/login' className='text-[#fc6011] cursor-pointer'>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
