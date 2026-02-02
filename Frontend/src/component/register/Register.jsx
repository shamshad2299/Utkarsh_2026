import { useState } from "react";
import { useAuth } from "../../store/ContextStore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    mobile_no: "",
    city: "",
    gender: "",
    college: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const hanldeNavigate = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);
      setSuccess("🎉 Registration successful. Please login.");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-3xl bg-amber-50  backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and get started 🚀
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-600 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-8 md:flex-row flex-col">
            <div className="flex-1">
              <Input name="name" label="Full Name" onChange={handleChange} />
            </div>

            <div className="flex-1">
              <Input
                name="email"
                type="email"
                label="Email Address"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-8 md:flex-row flex-col">
            <div className="flex-1">
              <Input
                name="password"
                type="password"
                label="Password"
                onChange={handleChange}
              />
            </div>

            <div className="flex-1">
              <Input
                name="mobile_no"
                label="Mobile Number"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-8 md:flex-row flex-col justify-between">
            {/* City */}
            <div className="flex-1">
              <Input name="city" label="City" onChange={handleChange} />
            </div>

            {/* Gender */}
           <div className="flex-1">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border-2 text-amber-700 text-sm font-bold"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
           </div>
          </div>

          {/* College */}
          <Input name="college" label="College" onChange={handleChange} />

          {/* Course */}
          <Input name="course" label="Course" onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg text-white font-semibold
              bg-linear-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={hanldeNavigate}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

/* 🔹 Reusable Input Component */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      required
      placeholder={label}
      className="w-full rounded-lg border-gray-300
      border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 text-green-500"
    />
  </div>
);
