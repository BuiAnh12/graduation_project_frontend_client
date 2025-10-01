"use client";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { ForgotPassEmailProvider } from "@/context/forgotPassEmailContext";
import { ProvinceProvider } from "@/context/provinceContext";
import { OrderProvider } from "@/context/orderContext";
import { FavoriteProvider } from "@/context/favoriteContext";
import { SocketProvider } from "@/context/socketContext";
import { AuthProvider, useAuth } from "@/context/authContext";
import { ThreeDot } from "react-loading-indicators";
import { StoreLocationProvider } from "@/context/storeLocationContext";
import { LocationProvider } from "@/context/locationContext";
import { VoucherProvider } from "@/context/voucherContext";
import { CartProvider } from "@/context/cartContext";

function AppProviders({ children }) {
    const { loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <ThreeDot color='#fc6011' size='medium' text='' textColor='' />
            </div>
        );
    }

    return children;
}

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                <HelmetProvider>
                    <ForgotPassEmailProvider>
                        <AuthProvider>
                            <SocketProvider>
                                <StoreLocationProvider>
                                    <LocationProvider>
                                        <ProvinceProvider>
                                            <CartProvider>
                                                <OrderProvider>
                                                    <FavoriteProvider>
                                                        <VoucherProvider>
                                                            <AppProviders>
                                                                {children}
                                                                <ToastContainer
                                                                    position='top-right'
                                                                    autoClose={5000}
                                                                    hideProgressBar={false}
                                                                    newestOnTop={false}
                                                                    closeOnClick
                                                                    rtl={false}
                                                                    pauseOnFocusLoss
                                                                    draggable
                                                                    pauseOnHover
                                                                    theme='light'
                                                                />
                                                            </AppProviders>
                                                        </VoucherProvider>
                                                    </FavoriteProvider>
                                                </OrderProvider>
                                            </CartProvider>
                                        </ProvinceProvider>
                                    </LocationProvider>
                                </StoreLocationProvider>
                            </SocketProvider>
                        </AuthProvider>
                    </ForgotPassEmailProvider>
                </HelmetProvider>
            </body>
        </html>
    );
}
