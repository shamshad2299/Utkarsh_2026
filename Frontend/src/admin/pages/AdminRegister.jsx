import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/auth/register", form);
      console.log(res)
      alert("Admin registered successfully");
      navigate("/admin")
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg space-y-5 text-black"
>
  <h2 className="text-2xl font-bold text-center text-gray-800">
    Admin Register
  </h2>

  <input
    name="name"
    onChange={handleChange}
    placeholder="Username"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

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
    Register
  </button>
</form>

  );
};

export default AdminRegister;
