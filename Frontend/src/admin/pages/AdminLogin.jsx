import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Email and password are required");
    return;
  }

  try {
    const res = await api.post("/admin/auth/login", form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("LOGIN RESPONSE:", res.data);


    const { accessToken, admin } = res.data;

    if (!accessToken || !admin) {
      throw new Error("Invalid login response");
    }

    // 🔐 Store access token
    localStorage.setItem("adminAccessToken", accessToken);
    localStorage.setItem("admin", JSON.stringify(admin));

    // 🚀 Navigate only after everything is safe
    navigate("/admin/dashboard", { replace: true });

  } catch (err) {
    console.error("Admin login error:", err);

    const message =
      err.response?.data?.message ||
      err.message ||
      "Login failed. Please try again.";

    alert(message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5 text-black"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h2>

        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
