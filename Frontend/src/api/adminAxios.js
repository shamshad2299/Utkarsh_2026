import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:7000/api/admin",
});

export const adminRegister = (payload) =>
  adminApi.post("/auth/register", payload);

export const adminLogin = (payload) =>
  adminApi.post("/auth/login", payload);
