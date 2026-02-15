import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting token refresh...");

        await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        console.log("✅ Token refreshed successfully");

        return instance(originalRequest);
      } catch (refreshError) {
        console.warn("❌ Refresh failed — redirecting to login");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
