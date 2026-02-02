import { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../store/AdminContext";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {register} = useAdmin();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await register(formData);
      console.log(res);

      setMessage(
        "Admin registration submitted. Awaiting approval from super admin."
      );

      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Admin Registration
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Admin access requires approval. You will be notified once approved.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-2 p-2 rounded border-gray-300 text-gray-700 font-bold text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-2 p-2 rounded border-gray-300 text-gray-700 font-bold text-sm"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border-2 p-2 rounded border-gray-300 text-gray-700 font-bold text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Request Admin Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
