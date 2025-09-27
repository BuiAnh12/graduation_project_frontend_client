import { config, instance } from "@/utils/axiosConfig";

const register = async (userData) => {
  const response = await instance.post(`/auth/register`, userData);
  if (response.data) {
    return response.data;
  }
};

const login = async (userData) => {
  const response = await instance.post("/auth/login", userData);
  const data = response.data.data
  if (data) {
    localStorage.setItem("userId", JSON.stringify(data._id));
    localStorage.setItem("token", JSON.stringify(data.token));
    return data;
  }
};


// const logout = async () => {
//   const response = await instance.get(`/auth/logout`);
//   if (response.data) {
//     localStorage.removeItem("userId");
//     localStorage.removeItem("token");
//     return response.data;
//   }
// };

const logout = async () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
};

const refreshAccessToken = async () => {
  const response = await instance.get(`/auth/refresh`);
  const data = response.data.data
  if (data) {
    return data;
  }
};


export const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
};
