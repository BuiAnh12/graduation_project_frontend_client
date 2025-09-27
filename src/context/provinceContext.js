"use client";
import { createContext, useContext, useState } from "react";

const ProvinceContext = createContext();

export const ProvinceProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 200, lon: 200 });

  return (
    <ProvinceContext.Provider value={{ currentLocation, setCurrentLocation }}>{children}</ProvinceContext.Provider>
  );
};

export const useProvince = () => useContext(ProvinceContext);
