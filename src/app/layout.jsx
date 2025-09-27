"use client";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "@/context/authContext";
import { ThreeDot } from "react-loading-indicators";

function AppProviders({ children }) {
    const { loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
              <ThreeDot variant="brick-stack" color="#fc6011" size="medium" text="" textColor="" />
            </div>
        );
    }

    return children;
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <HelmetProvider>
                    <AuthProvider>
                        <AppProviders>
                            {children}
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                        </AppProviders>
                    </AuthProvider>
                </HelmetProvider>
            </body>
        </html>
    );
}
