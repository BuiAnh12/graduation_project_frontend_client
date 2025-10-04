"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { useLocation } from "@/context/locationContext";
import { provinces } from "@/utils/constants";
import { getClosestProvince } from "@/utils/functions";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/619/619153.png",
  iconSize: [40, 40],
});

const ChangeView = ({ center, level }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, level);
  }, [center]);
  return null;
};

const Page = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [dragMarkInput, setDragMarkInput] = useState("");
  const [province, setProvince] = useState({ name: "", lat: 200, lon: 200 });
  const [suggestions, setSuggestions] = useState([]);
  const [provinceSuggestions, setProvinceSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 200, lon: 200 });
  const [userLocation, setUserLocation] = useState({ lat: 200, lon: 200 });
  const [zoomLevel, setZoomLevel] = useState(12);
  const [openSelectProvince, setOpenSelectProvince] = useState(false);

  const { setLocation, location } = useLocation();

  const handleChooseLocation = (newLocation) => {
    setLocation(newLocation);
    router.back();
  };

  const fetchSuggestions = useCallback(
    debounce(async (query, province) => {
      if (!query) return;

      // Kiểm tra province trước khi sử dụng tọa độ
      const viewbox = province
        ? `${province.lon - 0.5},${province.lat + 0.5},${province.lon + 0.5},${province.lat - 0.5}`
        : "";

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}
          &format=json&addressdetails=1&countrycodes=VN&accept-language=vi${
            viewbox ? `&viewbox=${viewbox}&bounded=1` : ""
          }`;

      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "your-app-name",
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        // Chuyển dữ liệu thành format mong muốn
        const suggestions = data.map((place) => ({
          name: place.display_name,
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
        }));

        setSuggestions(suggestions);
      } catch (error) {
        console.error("Fetch suggestions error:", error);
      }
    }, 2000),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchSuggestions(value, province);
  };

  const handleSearchProvince = (e) => {
    const query = e.target.value;
    setSearchProvince(query);
    const filtered = provinces.filter((province) => province.name.toLowerCase().includes(query.toLowerCase()));
    setProvinceSuggestions(filtered);
  };

  const handleSelectLocation = (place) => {
    if (selectedLocation.lat === place.lat && selectedLocation.lon === place.lon) return;

    setSelectedLocation({ lat: place.lat, lon: place.lon });
    setSearch(place.name);
    setSuggestions([]);
  };

  const handleProvinceChange = (prov) => {
    setProvince(prov);
    setSelectedLocation({ lat: prov.lat, lon: prov.lon });
  };

  const MarkerComponent = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
      const marker = L.marker([lat, lon], { draggable: true }).addTo(map);
      marker.on("dragend", async (event) => {
        const { lat, lng } = event.target.getLatLng();
        setSelectedLocation({ lat, lon: lng });
      });
      return () => marker.remove();
    }, [lat, lon, map]);

    return null;
  };

  const fetchPlaceName = async (lon, lat) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}
        &format=json&addressdetails=1&accept-language=vi`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "your-app-name",
        },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      // Lấy tên địa điểm từ display_name
      setDragMarkInput(data.display_name);
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;

          setUserLocation({ lat: userLat, lon: userLon });

          if (location.lat !== 200) {
            setSelectedLocation({ lat: location.lat, lon: location.lon });
            setProvince(getClosestProvince({ lat: location.lat, lon: location.lon }));
          } else {
            setSelectedLocation({ lat: userLat, lon: userLon });
            setProvince(getClosestProvince({ lat: userLat, lon: userLon }));
          }
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedLocation.lat !== 200) {
      fetchPlaceName(selectedLocation.lon, selectedLocation.lat);
    }
  }, [selectedLocation]);

  const MapZoomHandler = () => {
    const map = useMap();
    useEffect(() => {
      const handleZoomEnd = () => {
        setZoomLevel(map.getZoom());
      };

      map.on("zoomend", handleZoomEnd);

      return () => {
        map.off("zoomend", handleZoomEnd);
      };
    }, [map]);

    return null;
  };

  const timeoutRef = useRef(null);

  // Custom hook để bắt sự kiện trên bản đồ
  const MapEvents = () => {
    useMapEvents({
      mousedown: (event) => {
        timeoutRef.current = setTimeout(() => {
          const { lat, lng } = event.latlng;
          setSelectedLocation({ lat, lon: lng });
        }, 500); // Nhấn giữ 0.5s để đặt ghim
      },
      mouseup: () => {
        clearTimeout(timeoutRef.current); // Hủy nếu không đủ 500ms
      },
      mousemove: () => {
        clearTimeout(timeoutRef.current); // Hủy nếu di chuột đi chỗ khác
      },
    });

    return null;
  };

  return (
    <>
      {province.lat !== 200 && selectedLocation.lat !== 200 && userLocation.lat !== 200 && (
        <div className='pt-[85px] pb-[140px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9]'>
          <Heading title='Thêm địa chỉ' />
          <div className='hidden md:block'>
            <Header page='account' />
          </div>

          {!openSelectProvince ? (
            <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:rounded-[10px] md:shadow-md md:p-[20px]'>
              <div className='fixed top-0 right-0 left-0 z-10 flex items-center gap-2 bg-white h-[85px] px-4 md:static'>
                <div
                  onClick={() => {
                    router.back();
                  }}
                  className='relative w-[30px] pt-[30px] cursor-pointer'
                >
                  <Image src='/assets/arrow_left_long.png' alt='' layout='fill' objectFit='contain' />
                </div>

                <div className='relative flex-1'>
                  <input
                    type='text'
                    value={search}
                    onChange={handleSearchChange}
                    placeholder='Nhập địa điểm'
                    className='w-full bg-gray-200 text-lg p-2 rounded-lg'
                  />
                  {suggestions.length > 0 && (
                    <ul className='absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md z-50 max-h-60 overflow-auto shadow-lg'>
                      {suggestions.map((place, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectLocation(place)}
                          className='p-2 hover:bg-gray-200 cursor-pointer'
                        >
                          {place.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div
                  className='flex flex-col items-center gap-[4px]'
                  onClick={() => {
                    setOpenSelectProvince(true);
                    setSearchProvince(province.name);
                  }}
                >
                  <div className='p-[6px] bg-red-600 rounded-full'>
                    <div className='relative w-[15px] pt-[15px]'>
                      <Image src='/assets/star_yellow.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                  </div>
                  <p className='text-[13px] text-[#4a4b4d] font-semibold'>{province.name}</p>
                </div>
              </div>

              {/* Map component */}
              <div className='w-full h-[500px] mt-4 relative z-0'>
                {typeof window !== "undefined" && (
                  <MapContainer
                    key={`${selectedLocation.lat}-${selectedLocation.lon}`}
                    center={[selectedLocation.lat, selectedLocation.lon]}
                    zoom={zoomLevel}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <ChangeView center={[selectedLocation.lat, selectedLocation.lon]} level={zoomLevel} />
                    <MapZoomHandler />
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <MapEvents />

                    <MarkerComponent lat={selectedLocation.lat} lon={selectedLocation.lon} />
                    {/* Marker cố định tại vị trí hiện tại */}
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lon]}
                        icon={homeIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedLocation({ lat: userLocation.lat, lon: userLocation.lon });
                          },
                        }}
                      >
                        <Popup>Vị trí hiện tại</Popup>
                      </Marker>
                    )}

                    <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                      <Popup>{dragMarkInput}</Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>

              <div className='fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] py-[15px] z-[100]'>
                <div
                  className='flex items-center justify-center lg:w-[60%] md:w-[80%] md:mx-auto rounded-[8px] bg-[#fc6011] text-[#fff] py-[15px] px-[20px] w-full cursor-pointer shadow-md hover:shadow-lg'
                  onClick={() => {
                    handleChooseLocation({
                      address: dragMarkInput,
                      lat: selectedLocation.lat,
                      lon: selectedLocation.lon,
                    });
                  }}
                >
                  <span className='text-[#fff] text-[20px] font-semibold'>Chọn địa điểm này</span>
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:rounded-[10px] md:shadow-md md:p-[20px]'>
              <div className='fixed top-0 right-0 left-0 z-10 flex items-center gap-2 bg-white h-[85px] px-4 md:static'>
                <div
                  className='relative w-[30px] pt-[30px]'
                  onClick={() => {
                    setOpenSelectProvince(false);
                    setProvinceSuggestions([]);
                  }}
                >
                  <Image src='/assets/arrow_left_long.png' alt='' layout='fill' objectFit='contain' />
                </div>

                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='Nhập tỉnh'
                    value={searchProvince}
                    onChange={handleSearchProvince}
                    className='w-full bg-gray-200 text-lg p-2 rounded-lg'
                  />
                  {provinceSuggestions.length > 0 && (
                    <ul className='absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md z-50 max-h-60 overflow-auto shadow-lg'>
                      {provinceSuggestions.map((prov) => (
                        <li
                          key={prov.name}
                          onClick={() => {
                            setOpenSelectProvince(false);
                            handleProvinceChange(prov);
                            setProvinceSuggestions([]);
                          }}
                          className='p-2 hover:bg-gray-200 cursor-pointer'
                        >
                          {prov.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className='flex flex-col items-center gap-[4px]'>
                  <div className='p-[6px] bg-red-600 rounded-full'>
                    <div className='relative w-[15px] pt-[15px]'>
                      <Image src='/assets/star_yellow.png' alt='' layout='fill' objectFit='contain' />
                    </div>
                  </div>
                  <p className='text-[13px] text-[#4a4b4d] font-semibold'>{province.name}</p>
                </div>
              </div>

              <div className='w-full h-full md:h-[500px] mt-4 relative z-0 overflow-scroll'>
                {provinces.map((prov) => (
                  <div
                    key={prov.name}
                    onClick={() => {
                      setOpenSelectProvince(false);
                      handleProvinceChange(prov);
                      setProvinceSuggestions([]);
                    }}
                    className={`py-[15px] px-[20px] cursor-pointer ${
                      prov.name === province.name ? "bg-[#a3a3a3a3]" : "bg-[#fff]"
                    }`}
                    style={{ borderBottom: "1px solid #e0e0e0a3" }}
                  >
                    <span className='text-[#4a4b4d] font-bold'>{prov.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
