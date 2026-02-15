import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import BackgroundGlow from "../BackgroundGlow";

const LoginPage = () => {
  const { login, requestPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [step, setStep] = useState("login"); // login | forgot | otp | reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccess("");

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login({
        identifier: formData.identifier,
        password: formData.password,
      });
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      console.error("Login failed", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.identifier.trim()) {
      setError("Please enter your Email or UK ID");
      return;
    }

    try {
      setLoading(true);
      const response = await requestPassword({
        identifier: formData.identifier,
      });
      console.log("Forgot password response:", response);

      if (response.success) {
        setSuccess(
          response.message ||
            "OTP sent to your registered email. Please check your inbox."
        );
        setStep("otp");
      }
    } catch (err) {
      console.error("Forgot password failed", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.code.trim()) {
      setError("Please enter OTP");
      return;
    }

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({
        identifier: formData.identifier,
        code: formData.code,
        newPassword: formData.newPassword,
      });

      console.log("Reset password response:", response);

      setFormData({
        identifier: "",
        password: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password reset successful! Please login with your new password.");
      setStep("login");
    } catch (err) {
      console.error("Reset password failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please check OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    switch (step) {
      case "login":
        return handleLoginSubmit(e);
      case "forgot":
        return handleForgotPassword(e);
      case "otp":
      case "reset":
        return handleResetPassword(e);
      default:
        e.preventDefault();
    }
  };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundGlow />
      </div>

      {/* Home Button */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20 hover:text-purple-300 transition-colors text-white/80 hover:text-white"
        onClick={handleBackToHome}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="tracking-widest font-semibold">Home</span>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl flex justify-center">
          {/* Top Left Image */}
        

          {/* Card */}
          <div
            className={`
              relative w-full rounded-xl
              lg:px-12 md:px-8 px-4 py-6
              bg-gradient-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90
              backdrop-blur-md border border-white/20
              shadow-[0_10px_40px_rgba(0,0,0,0.8)]
              transition-all duration-700
              ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#e4e1ff]">
                {step === "login" && "Welcome Back"}
                {step === "forgot" && "Forgot Password"}
                {(step === "otp" || step === "reset") && "Reset Password"}
              </h1>
              <p className="text-sm md:text-base text-[#c9c3ff] mt-2">
                {step === "login" && "Sign in to your account"}
                {step === "forgot" && "Enter your email to receive OTP"}
                {step === "otp" && "Enter the OTP sent to your email"}
                {step === "reset" && "Create a new password"}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* LOGIN STEP */}
              {step === "login" && (
                <div className="space-y-4">
                  <Input
                    label="Email, Mobile or Utkarsh ID"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email, mobile or ID..."
                    disabled={loading}
                  />

                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password..."
                    disabled={loading}
                  />

                  <div className="flex justify-between items-center pt-2">
                    <div
                      className="text-sm text-[#c9c3ff] cursor-pointer hover:text-white hover:underline transition-colors"
                      onClick={() => {
                        setStep("forgot");
                        setError("");
                        setSuccess("");
                      }}
                    >
                      Forgot Password?
                    </div>

                    <div
                      className="text-sm text-[#c9c3ff] cursor-pointer hover:text-white hover:underline transition-colors"
                      onClick={() => {
                        navigate("/register");
                        setError("");
                        setSuccess("");
                      }}
                    >
                      Create Account
                    </div>
                  </div>
                </div>
              )}

              {/* FORGOT PASSWORD STEP */}
              {step === "forgot" && (
                <div className="space-y-4">
                  <Input
                    label="Email or UK ID"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email or UK ID..."
                    disabled={loading}
                  />
                </div>
              )}

              {/* OTP STEP */}
              {step === "otp" && (
                <div className="space-y-4">
                  <Input
                    label="OTP Code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP..."
                    disabled={loading}
                    maxLength="6"
                  />

                  <div
                    className="text-sm text-[#c9c3ff] text-right cursor-pointer hover:text-white hover:underline transition-colors"
                    onClick={() => {
                      setStep("reset");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Next: Set New Password →
                  </div>
                </div>
              )}

              {/* RESET PASSWORD STEP */}
              {step === "reset" && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#3a3763]/50 border border-white/20 rounded-md text-[#c9c3ff] text-sm">
                    OTP: {formData.code}
                  </div>

                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password..."
                    disabled={loading}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password..."
                    disabled={loading}
                  />
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* SUCCESS MESSAGE */}
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-md text-green-200 text-sm">
                  {success}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2 rounded-md 
                           bg-[#6c63ff] text-white text-sm font-semibold
                           hover:bg-[#5b54e6] transition disabled:opacity-60"
              >
                {loading
                  ? step === "login"
                    ? "SIGNING IN..."
                    : step === "forgot"
                      ? "SENDING OTP..."
                      : "RESETTING..."
                  : step === "login"
                    ? "SIGN IN"
                    : step === "forgot"
                      ? "SEND OTP"
                      : "RESET PASSWORD"}
              </button>

              {/* BACK BUTTONS */}
              {(step === "forgot" || step === "otp" || step === "reset") && (
                <div className="mt-4">
                  <div
                    className="text-sm text-center text-[#c9c3ff] cursor-pointer hover:text-white hover:underline transition-colors"
                    onClick={() => {
                      if (step === "forgot") setStep("login");
                      if (step === "otp") setStep("forgot");
                      if (step === "reset") setStep("otp");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    {step === "forgot" ? "Back to Login" : "Back"}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

/* Input Component */
const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled,
  maxLength,
}) => (
  <div>
    <label className="text-xs text-white block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      maxLength={maxLength}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded text-sm
                 bg-[#3a3763]/90 border border-white/40
                 text-white placeholder:text-white/60
                 focus:outline-none focus:border-white/60
                 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default LoginPage;