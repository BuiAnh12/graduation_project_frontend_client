import { provinces } from "./constants";

export const getClosestProvince = ({ lat, lon }) => {
  const closestProvince = provinces.reduce((prev, curr) => {
    const prevDistance = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lon - lon, 2));
    const currDistance = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lon - lon, 2));
    return currDistance < prevDistance ? curr : prev;
  });
  return closestProvince;
};

export const haversineDistance = (coords1, coords2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách tính bằng km
};

export const calculateTravelTime = (distance, speed = 40) => {
  return distance / speed; // Thời gian tính theo giờ
};

export const groupStoresByCategory = (stores) => {
  const groupedStores = {};

  stores.forEach((store) => {
    store.systemCategoryId.forEach((category) => {
      const categoryId = category?._id;

      if (!groupedStores[categoryId]) {
        groupedStores[categoryId] = {
          category: category, // category object { _id, name }
          stores: [],
        };
      }

      groupedStores[categoryId].stores.push(store);
    });
  });

  return Object.values(groupedStores);
};


export const groupDishesByCategory = (dishes) => {
    const groupedDishes = {};
  
    dishes.forEach((dish) => {
      // --- FIX 1 ---
      // Lấy toàn bộ đối tượng category.
      // Nếu category là null, gán nó vào một nhóm "Chưa phân loại"
      const category = dish.categories || { _id: "uncategorized", name: "Chưa phân loại" };
  
      // --- FIX 2 ---
      // Lấy ID từ đối tượng category
      const categoryId = category._id;
  
      if (!groupedDishes[categoryId]) {
        groupedDishes[categoryId] = {
          // --- FIX 3 ---
          // Lưu trữ toàn bộ đối tượng để component có thể sử dụng cả _id và name
          category: category,
          dishes: [],
        };
      }
  
      groupedDishes[categoryId].dishes.push(dish);
    });
  
    return Object.values(groupedDishes);
  };