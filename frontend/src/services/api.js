import axios from "axios";
import toast from "react-hot-toast";
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
}); // Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("opz_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userTenantId = payload.tenantId;
        const adminSelectedTenant = localStorage.getItem("adminSelectedTenant");
        
        if (adminSelectedTenant && adminSelectedTenant !== "PLATFORM") {
          config.headers["X-Tenant-ID"] = adminSelectedTenant;
        } else if (userTenantId && userTenantId !== "null") {
          config.headers["X-Tenant-ID"] = userTenantId;
        }
      } catch (e) {
        console.error("Failed to parse token payload", e);
      }
    } else {
      const adminSelectedTenant = localStorage.getItem("adminSelectedTenant");
      if (adminSelectedTenant && adminSelectedTenant !== "PLATFORM") {
        config.headers["X-Tenant-ID"] = adminSelectedTenant;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
); // Response interceptor — handle 401, token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("opz_refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post("/api/auth/refresh", { refreshToken });
          const newToken = res.data.accessToken || res.data.data?.accessToken;
          localStorage.setItem("opz_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("opz_token");
          localStorage.removeItem("opz_refresh_token");
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login/user";
          }
        }
      } else {
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login/user";
        }
      }
    }
    return Promise.reject(error);
  },
);
export default api; // ─── Helper to extract error message ───────────────────────────
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return "An unexpected error occurred";
};
