import { useEffect, useState } from "react";
import { storeService } from "@/api/storeService";
import { toast } from "react-toastify";
import { useProvince } from "@/context/provinceContext";

export const useStoreSearch = (query) => {
  const { currentLocation } = useProvince();

  const [loading, setLoading] = useState(false);
  const [allStore, setAllStore] = useState([]);
  const [ratingStore, setRatingStore] = useState([]);
  const [standoutStore, setStandoutStore] = useState([]);
  const [error, setError] = useState(null);

  const lat = currentLocation.lat === 200 ? 10.762622 : currentLocation.lat;
  const lon = currentLocation.lon === 200 ? 106.660172 : currentLocation.lon;

  useEffect(() => {
    if (!currentLocation || currentLocation.lat === undefined || currentLocation.lon === undefined) return;

    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        const [all, rating, standout] = await Promise.all([
          storeService.getAllStore({ ...query, lat, lon }),
          storeService.getAllStore({ sort: "rating", lat, lon }),
          storeService.getAllStore({ sort: "standout", lat, lon }),
        ]);

        setAllStore(all);
        setRatingStore(rating);
        setStandoutStore(standout);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        setError(err);
        toast.error("Không thể tải dữ liệu cửa hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [query, lat, lon, currentLocation]);

  return {
    loading,
    error,
    allStore,
    ratingStore,
    standoutStore,
  };
};
