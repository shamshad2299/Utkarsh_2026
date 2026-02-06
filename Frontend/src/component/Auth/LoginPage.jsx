import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import regImage from "../../assets/uk.png";
import { useAuth } from "../../Context/AuthContext";

const LoginPage = () => {
  const { login, register, requestPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("login"); // login | register | forgot | otp | reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Login fields
    identifier: "",
    password: "",
    // Forgot password fields
    code: "", // OTP code
    newPassword: "",
    confirmPassword: "",
  });

  /* -------------------- handlers -------------------- */

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
          "Login failed. Please check your credentials.",
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
        identifier: formData.identifier
      });
      console.log("Forgot password response:", response);

      if (response.success) {
        setSuccess(response.message || "OTP sent to your registered email. Please check your inbox.");
        setStep("otp");
      }
    } catch (err) {
      console.error("Forgot password failed", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // OTP verification and password reset in one step
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
      // Send all required data to reset-password endpoint
      const response = await resetPassword({
        identifier: formData.identifier,
        code: formData.code,
        newPassword: formData.newPassword
      });

      console.log("Reset password response:", response);

      // Success - go back to login
      setFormData({
        identifier: "",
        password: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess(
        "Password reset successful! Please login with your new password.",
      );
      setStep("login");
    } catch (err) {
      console.error("Reset password failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please check OTP and try again.",
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
        return handleResetPassword(e);
      case "reset":
        return handleResetPassword(e);
      default:
        e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-linear-to-br from-[#010103] via-[#39363f] to-[#0b0618] text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${regImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20 hover:text-purple-300 transition-colors"
        onClick={handleBackToHome}
      >
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Home</span>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.35)]">
          <h1 className="sm:text-4xl text-2xl font-black italic text-[#8B5CF6] uppercase text-center mb-2">
            UTKARSH'26
          </h1>

          <form onSubmit={handleFormSubmit}>
            {/* STEP 1: LOGIN */}
            {step === "login" && (
              <>
                <p className="text-gray-300 text-center mb-8">
                  Sign in to your account
                </p>

                <input
                  name="identifier"
                  placeholder="Email, Mobile or Utkarsh ID"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                  disabled={loading}
                  autoComplete="username"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-2 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                  disabled={loading}
                  autoComplete="current-password"
                />

                <div className="flex justify-between items-center mb-6">
                  <div
                    className="text-sm text-purple-300 cursor-pointer hover:underline hover:text-purple-200 transition-colors"
                    onClick={() => {
                      setStep("forgot");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Forgot Password?
                  </div>
                  
                  <div
                    className="text-sm text-purple-300 cursor-pointer hover:underline hover:text-purple-200 transition-colors"
                    onClick={() => {
                      navigate("/register")
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Create Account
                  </div>
                </div>
              </>
            )}
            {/* STEP 3: FORGOT PASSWORD - Request OTP */}
            {step === "forgot" && (
              <>
                <p className="text-gray-300 text-center mb-8">
                  Recover your account
                </p>

                <input
                  name="identifier"
                  type="text"
                  placeholder="Enter your Email or UK ID"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full mb-6 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                  disabled={loading}
                  autoComplete="email"
                />
              </>
            )}

            {/* STEP 4: OTP + NEW PASSWORD (combined) */}
            {(step === "otp" || step === "reset") && (
              <>
                <p className="text-gray-300 text-center mb-8">
                  {step === "otp" 
                    ? "Enter OTP sent to your email" 
                    : "Create new password"
                  }
                </p>

                {step === "otp" && (
                  <>
                    <input
                      name="code"
                      placeholder="Enter 6-digit OTP"
                      value={formData.code}
                      onChange={handleChange}
                      className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                      disabled={loading}
                      maxLength="6"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                    />
                    
                    <div
                      className="text-sm text-purple-300 text-right mb-4 cursor-pointer hover:underline hover:text-purple-200 transition-colors"
                      onClick={() => {
                        setStep("reset");
                        setError("");
                        setSuccess("");
                      }}
                    >
                      Next: Set New Password →
                    </div>
                  </>
                )}

                {step === "reset" && (
                  <>
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-md text-purple-200 text-sm">
                      OTP: {formData.code}
                    </div>

                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                      disabled={loading}
                      autoComplete="new-password"
                    />

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full mb-6 bg-black/60 border border-gray-700 p-3 rounded-md text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </>
                )}
              </>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-md text-green-200 text-sm">
                {success}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#8B5CF6] to-[#7C4DFF] py-4 font-black italic tracking-widest uppercase text-white hover:from-[#7C4DFF] hover:to-[#6D3DFF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-md shadow-lg hover:shadow-purple-500/30"
            >
              {loading
                ? step === "login"
                  ? "SIGNING IN..."
                  : step === "register"
                    ? "REGISTERING..."
                    : step === "forgot"
                      ? "SENDING OTP..."
                      : "RESETTING PASSWORD..."
                : step === "login"
                  ? "SIGN IN"
                  : step === "register"
                    ? "REGISTER"
                    : step === "forgot"
                      ? "SEND OTP"
                      : "RESET PASSWORD"}
            </button>

            {/* BACK BUTTONS */}
            {(step === "register" || step === "forgot" || step === "otp" || step === "reset") && (
              <div className="mt-4">
                <div
                  className="text-sm text-center text-purple-300 cursor-pointer hover:text-purple-200 hover:underline transition-colors"
                  onClick={() => {
                    if (step === "register") setStep("login");
                    if (step === "forgot") setStep("login");
                    if (step === "otp") setStep("forgot");
                    if (step === "reset") setStep("otp");
                    setError("");
                    setSuccess("");
                  }}
                >
                  {step === "register" || step === "forgot" ? "Back to Login" : "Back"}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Milonga&display=swap');
        h1 { 
          font-family: 'Orbitron', sans-serif; 
          text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;