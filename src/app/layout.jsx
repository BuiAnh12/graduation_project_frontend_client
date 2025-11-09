"use client";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { ThreeDot } from "react-loading-indicators";

// Contexts
import { ForgotPassEmailProvider } from "@/context/forgotPassEmailContext";
import { ProvinceProvider } from "@/context/provinceContext";
import { OrderProvider } from "@/context/orderContext";
import { FavoriteProvider } from "@/context/favoriteContext";
import { SocketProvider } from "@/context/socketContext";
import { AuthProvider, useAuth } from "@/context/authContext";
import { StoreLocationProvider } from "@/context/storeLocationContext";
import { LocationProvider } from "@/context/locationContext";
import { VoucherProvider } from "@/context/voucherContext";
import { CartProvider } from "@/context/cartContext";
import { ReferenceProvider } from "@/context/referenceContext";

// Optional: theme switcher (multi-site ready)
function ThemeWrapper({ children }) {
    // could dynamically detect theme later (red, green, etc.)
    return <div data-theme="red">{children}</div>;
}

function AppProviders({ children }) {
    const { loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[var(--background)] text-[var(--brand)]">
                <ThreeDot color="var(--brand)" size="medium" />
            </div>
        );
    }

    return children;
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] antialiased">
                <HelmetProvider>
                    <ForgotPassEmailProvider>
                        <AuthProvider>
                            <StoreLocationProvider>
                                <LocationProvider>
                                    <ProvinceProvider>
                                        <CartProvider>
                                            <OrderProvider>
                                                <FavoriteProvider>
                                                    <VoucherProvider>
                                                        <ReferenceProvider>
                                                            <SocketProvider>
                                                                <ThemeWrapper>
                                                                    <AppProviders>
                                                                        {
                                                                            children
                                                                        }

                                                                        <ToastContainer
                                                                            position="top-right"
                                                                            autoClose={
                                                                                4000
                                                                            }
                                                                            hideProgressBar={
                                                                                false
                                                                            }
                                                                            newestOnTop={
                                                                                false
                                                                            }
                                                                            closeOnClick
                                                                            pauseOnFocusLoss
                                                                            draggable
                                                                            pauseOnHover
                                                                            theme="light"
                                                                        />
                                                                    </AppProviders>
                                                                </ThemeWrapper>
                                                            </SocketProvider>
                                                        </ReferenceProvider>
                                                    </VoucherProvider>
                                                </FavoriteProvider>
                                            </OrderProvider>
                                        </CartProvider>
                                    </ProvinceProvider>
                                </LocationProvider>
                            </StoreLocationProvider>
                        </AuthProvider>
                    </ForgotPassEmailProvider>
                </HelmetProvider>
            </body>
        </html>
    );
}
