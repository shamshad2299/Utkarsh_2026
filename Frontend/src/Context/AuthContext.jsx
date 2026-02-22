// src/Context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ===== USER AUTH =====
  const register = async (payload) => {
    const { data } = await api.post("/v1/auth/register", payload);
    return data;
  };

  const login = async (payload) => {
    try {
      setLoading(true);
      const { data } = await api.post("/v1/auth/login", payload);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // Email verification methods
  const verifyEmail = async (payload) => {
    const { data } = await api.post("/v1/auth/verify-email", payload);
    return data;
  };

  const resendVerificationOTP = async (payload) => {
    const { data } = await api.post("/v1/auth/resend-otp", payload);
    return data;
  };

  const requestPassword = async (payload) => {
    const { data } = await api.post("/v1/auth/request-pass-reset-otp", payload);
    return data;
  };

  const resetPassword = (payload) =>
    api.post("/v1/auth/reset-password", payload);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ===== VERIFY USER ON APP LOAD =====
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setInitialLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const { data } = await api.get("/v1/auth/me");
        setUser(data.user);
      } catch {
        console.log("verify failed");
      } finally {
        setInitialLoading(false);
      }
    };

    verifyUser();
  }, []);

  // ===== ADMIN AUTH =====
  const adminRegister = (payload) =>
    api.post("/admin/auth/register", payload);

  const adminLogin = async (payload) => {
    try {
      setLoading(true);
      const { data } = await api.post("/admin/auth/login", payload);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.admin));
      setUser(data.admin);

      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        verifyEmail,
        resendVerificationOTP,
        requestPassword,
        resetPassword,
        adminRegister,
        adminLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};