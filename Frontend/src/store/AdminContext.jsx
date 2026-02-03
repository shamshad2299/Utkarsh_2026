import { createContext, useContext, useState } from "react";
import { adminLogin, adminRegister } from "../api/adminAxios";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = useState(
    () => JSON.parse(localStorage.getItem("admin")) || null
  );
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem("adminToken") || null
  );
  const [loading, setLoading] = useState(false);

  //admin registrations 
const register = async (payload) => {
  try {
    setLoading(true);
    const { data } = await adminRegister(payload);
    return data;
  } finally {
    setLoading(false);
  }
};


//admin login
  const login = async (payload) => {
    setLoading(true);
    const { data } = await adminLogin(payload);

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    setAdmin(data.admin);
    setAdminToken(data.token);
    setLoading(false);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setAdminToken(null);
  };

  return (
    <AdminContext.Provider
      value={{ admin, adminToken, loading, login, logout, register }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};
