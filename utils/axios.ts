import axios from "axios";

// ✅ Always use environment variable
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting token refresh...");

        await instance.post("/auth/refresh");

        console.log("✅ Token refreshed successfully");

        return instance(originalRequest);
      } catch (refreshError) {
        console.warn("❌ Refresh failed — redirecting to login");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
