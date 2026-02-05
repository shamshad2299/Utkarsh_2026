import { useState } from "react";
import { useAuth } from "../../store/ContextStore";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, requestPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const [forgotData, setForgotData] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const handleForgotChange = (e) => {
    setForgotData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendOtp = async () => {
    if (!forgotData.identifier) return;

    try {
      setForgotLoading(true);
      setForgotMsg("");

      const res = await requestPassword({
        identifier: forgotData.identifier,
      });

      setForgotMsg(res.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      setForgotMsg(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetPwd = async () => {
    const { identifier, otp, newPassword, confirmPassword } = forgotData;

    if (!otp || !newPassword || !confirmPassword) {
      return setForgotMsg("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setForgotMsg("Passwords do not match");
    }

    try {
      setForgotLoading(true);
      setForgotMsg("");

      await resetPassword({
        identifier,
        code: otp,
        newPassword,
      });

      setForgotMsg("🎉 Password reset successful");

      setTimeout(() => {
        setShowForgot(false);
        setStep(1);
      }, 1500);
    } catch (err) {
      setForgotMsg(err?.response?.data?.message || "Reset failed");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">Login to continue</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email / Mobile / User ID"
            name="identifier"
            placeholder="Enter your email, mobile or user ID"
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <div className="flex justify-between items-center text-sm">
            <span
              onClick={() => setShowForgot(true)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg text-white font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to={"/"} className="text-indigo-600 hover:underline cursor-pointer">
            Register
          </Link>
        </p>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => {
                setShowForgot(false);
                setStep(1);
                setForgotMsg("");
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Forgot Password
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {step === 1
                ? "Enter Email / User ID to receive OTP"
                : "Enter OTP and set new password"}
            </p>

            {forgotMsg && (
              <div className="mb-3 text-sm text-indigo-600">{forgotMsg}</div>
            )}

            {step === 1 && (
              <>
                <input
                  name="identifier"
                  placeholder="Email or User ID"
                  value={forgotData.identifier}
                  onChange={handleForgotChange}
                  className="w-full border-2 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 border-gray-200 text-fuchsia-900 font-bold"
                />

                <button
                  onClick={sendOtp}
                  disabled={forgotLoading}
                  className="w-full py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  name="otp"
                  placeholder="Enter OTP"
                  value={forgotData.otp}
                  onChange={handleForgotChange}
                  className="w-full border-2 rounded-lg px-3 py-2 mb-3 text-fuchsia-900 font-bold"
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  className="w-full border-2 rounded-lg px-3 py-2 mb-3 text-fuchsia-900 font-bold"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  className="w-full border-2 rounded-lg px-3 py-2 mb-4 text-fuchsia-900 font-bold"
                />

                <button
                  onClick={resetPwd}
                  disabled={forgotLoading}
                  className="w-full py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      required
      placeholder={label}
      className="w-full rounded-lg border-gray-300 border-2 text-amber-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
    />
  </div>
);
