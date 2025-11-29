import { useEffect, useState } from "react";
import { storeService } from "@/api/storeService";
import { useProvince } from "@/context/provinceContext";

export const useStoreSearch = (query) => {
  const { currentLocation } = useProvince();

  const [loading, setLoading] = useState(false);
  // Initialize as null or object structure to prevent "undefined" access errors initially
  const [allStore, setAllStore] = useState({ data: [], total: 0 }); 
  const [ratingStore, setRatingStore] = useState({ data: [], total: 0 });
  const [standoutStore, setStandoutStore] = useState({ data: [], total: 0 });
  const [error, setError] = useState(null);

  const lat = currentLocation.lat === 200 ? 10.762622 : currentLocation.lat;
  const lon = currentLocation.lon === 200 ? 106.660172 : currentLocation.lon;

  useEffect(() => {
    if (!currentLocation || currentLocation.lat === undefined) return;

    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        const [all, rating, standout] = await Promise.all([
          storeService.getAllStore({ ...query, lat, lon }),
          storeService.getAllStore({ sort: "rating", lat, lon }),
          storeService.getAllStore({ sort: "standout", lat, lon }),
        ]);

        setAllStore(all.data);
        setRatingStore(rating.data);
        setStandoutStore(standout.data);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        setError(err);
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