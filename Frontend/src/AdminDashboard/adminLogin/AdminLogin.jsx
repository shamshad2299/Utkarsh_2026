import { useState } from "react";
import { useAdmin } from "../../store/AdminContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { login, loading } = useAdmin();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form);

      if (res.admin.adminStatus !== "active") {
        setError(res.message);
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded px-3 py-2 text-red-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border-2 rounded px-3 py-2 border-amber-700 text-red-600"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
