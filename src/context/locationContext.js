"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const pathname = usePathname();
  const [location, setLocation] = useState({ address: "", lat: 200, lon: 200 });

  useEffect(() => {
    if (
      !(
        pathname.startsWith("/account/location/add-location") ||
        pathname.startsWith("/account/location/edit-location") ||
        pathname.startsWith("/account/location/choose-location")
      )
    ) {
      setLocation({ address: "", lat: 200, lon: 200 });
    }
  }, [pathname]);

  return <LocationContext.Provider value={{ location, setLocation }}>{children}</LocationContext.Provider>;
};

export const useLocation = () => useContext(LocationContext);
