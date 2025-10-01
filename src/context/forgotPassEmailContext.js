"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ForgotPassEmailContext = createContext();

export const ForgotPassEmailProvider = ({ children }) => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedEmail = localStorage.getItem("forgotPassEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (email) {
      localStorage.setItem("forgotPassEmail", email);
    } else {
      localStorage.removeItem("forgotPassEmail");
    }
  }, [email, isClient]);

  useEffect(() => {
    if (isClient && !["/auth/confirm-otp", "/auth/reset-password"].includes(pathname)) {
      setEmail("");
    }
  }, [pathname, isClient]);

  return <ForgotPassEmailContext.Provider value={{ email, setEmail }}>{children}</ForgotPassEmailContext.Provider>;
};

export const useForgotPassEmail = () => useContext(ForgotPassEmailContext);
