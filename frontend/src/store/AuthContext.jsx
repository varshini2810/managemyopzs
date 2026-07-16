import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshSession: async () => {},
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("opz_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await api.get("/auth/me");
      const payload = res.data?.data || res.data;
      if (payload) {
        setUser(payload);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      localStorage.removeItem("opz_token");
      localStorage.removeItem("opz_refresh_token");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const login = async (email, password, portalType) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        portalType,
      });
      const payload = res.data?.data || res.data;
      if (payload?.accessToken) {
        localStorage.setItem("opz_token", payload.accessToken);
        localStorage.setItem("opz_refresh_token", payload.refreshToken);
        await fetchUser();
        /*  Reload full profile + permissions  */ return {
          success: true,
          user: payload.user,
        };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      return { success: false, error: msg };
    }
  };
  const logout = () => {
    localStorage.removeItem("opz_token");
    localStorage.removeItem("opz_refresh_token");
    localStorage.removeItem("adminSelectedTenant");
    setUser(null);
    window.location.href = "/";
  };
  const refreshSession = async () => {
    await fetchUser();
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshSession }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
