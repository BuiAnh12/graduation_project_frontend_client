"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserAuth from "./useUserAuth";

export default function Protected({ children }) {
  const router = useRouter();
  const isAuthenticated = useUserAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) return null;

  return children;
}
