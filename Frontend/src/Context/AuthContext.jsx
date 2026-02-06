import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);

  // ===== USER AUTH =====
  const register = async (payload) => {
    const { data } = await api.post("/v1/auth/register", payload);
    return data;
  };

  const login = async (payload) => {
    setLoading(true);
    const { data } = await api.post("/v1/auth/login", payload);
  

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    setLoading(false);
    return data;
  };

  const requestPassword = async (payload) =>{
    const res = await api.post("/v1/auth/request-password", payload);
    return res.data;
  
}

  const resetPassword = (payload) =>
    api.post("/v1/auth/reset-password", payload);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // ===== ADMIN AUTH =====
  const adminRegister = (payload) =>
    api.post("/admin/auth/register", payload);

  const adminLogin = async (payload) => {
    const { data } = await api.post("/admin/auth/login", payload);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.admin));
    setUser(data.admin);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
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

// custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
