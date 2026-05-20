import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const { data, status } = response;
    if (status === 200) {
      return data;
    }
    ElMessage.error(data.message || "Request failed");
    return Promise.reject(data);
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      // switch (status) {
      //   case 401:
      //     ElMessage.error("Unauthorized, please login");
      //     break;
      //   case 403:
      //     ElMessage.error("Forbidden, no permission");
      //     break;
      //   case 404:
      //     ElMessage.error("Resource not found");
      //     break;
      //   case 500:
      //     ElMessage.error("Server error");
      //     break;
      //   default:
      //     ElMessage.error(data.message || "Request failed");
      // }
    } else {
      // ElMessage.error("Network error");
    }
    return Promise.reject(error);
  }
);

export default request;
