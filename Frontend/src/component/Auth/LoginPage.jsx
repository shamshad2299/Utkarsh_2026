import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const LoginPage = () => {
  const { login, requestPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check for messages from registration (auto-verified users)
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        type: "success",
        message: location.state.message
      });
      
      // Pre-fill email if provided
      if (location.state?.email) {
        setFormData(prev => ({ ...prev, identifier: location.state.email }));
      }
      
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccess("");
    setNotification(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNotification(null);

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await login({
        identifier: formData.identifier,
        password: formData.password,
      });
      
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 1000);
      
    } catch (err) {
      console.error("Login error:", err.response?.data);
      
      // Check if error is due to unverified email
      if (err.response?.data?.message?.toLowerCase().includes("verify") || 
          err.response?.data?.message?.toLowerCase().includes("verified")) {
        
        // Extract email from identifier if it's an email
        const email = formData.identifier.includes('@') 
          ? formData.identifier 
          : null;
        
        setError("Please verify your email before logging in.");
        
        // Don't auto-redirect, let user click the link
      } else {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNotification(null);

    if (!formData.identifier.trim()) {
      setError("Please enter your Email or UK ID");
      return;
    }

    try {
      setLoading(true);
      const response = await requestPassword({ identifier: formData.identifier });

      if (response.success) {
        setSuccess("OTP sent to your registered email. Please check your inbox.");
        setStep("otp");
      }
    } catch (err) {
      // Check if error is due to unverified email
      if (err.response?.data?.message?.toLowerCase().includes("verify") || 
          err.response?.data?.message?.toLowerCase().includes("verified")) {
        
        const email = formData.identifier.includes('@') 
          ? formData.identifier 
          : null;
        
        setError("Please verify your email first.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNotification(null);

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
      // Check if error is due to unverified email
      if (err.response?.data?.message?.toLowerCase().includes("verify") || 
          err.response?.data?.message?.toLowerCase().includes("verified")) {
        
        const email = formData.identifier.includes('@') 
          ? formData.identifier 
          : null;
        
        setError("Please verify your email first.");
      } else {
        setError(err.response?.data?.message || "Failed to reset password. Please check OTP and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    let email = formData.identifier;
    
    if (!email || !email.includes('@')) {
      const lastRegisteredEmail = localStorage.getItem("lastRegisteredEmail");
      if (lastRegisteredEmail) {
        email = lastRegisteredEmail;
      }
    }
    
    navigate("/verify", { 
      state: { 
        email: email,
        fromLogin: true 
      } 
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    switch (step) {
      case "login": return handleLoginSubmit(e);
      case "forgot": return handleForgotPassword(e);
      case "otp":
      case "reset": return handleResetPassword(e);
      default: e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#010103] via-[#241f4a] to-[#0b0618]">
      {/* Home Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white z-10 transition-colors cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="tracking-widest font-semibold">Home</span>
      </button>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="w-full rounded-xl bg-[#241f4a] bg-opacity-90 border border-white/20 shadow-lg p-6 md:p-8">
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

            {/* Auto-verified Success Notification */}
            {notification && notification.type === "success" && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-200 font-medium">Registration Successful!</p>
                    <p className="text-xs text-green-300 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            )}

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

                  {/* Verification Prompt for Unverified Users */}
                  {error && error.includes("verify") && (
                    <div className="mt-2 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-yellow-200 font-medium">Email Not Verified</p>
                          <p className="text-xs text-yellow-300 mt-1">{error}</p>
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            className="mt-3 text-sm text-[#6c63ff] hover:text-[#8b7eff] underline transition-colors"
                          >
                            Verify Email Address →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("forgot");
                        setError("");
                        setSuccess("");
                        setNotification(null);
                      }}
                      className="text-sm text-[#c9c3ff] hover:text-white hover:underline transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/register");
                        setError("");
                        setSuccess("");
                        setNotification(null);
                      }}
                      className="text-sm text-[#c9c3ff] hover:text-white hover:underline transition-colors cursor-pointer"
                    >
                      Create Account
                    </button>
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

                  <button
                    type="button"
                    onClick={() => {
                      setStep("reset");
                      setError("");
                      setSuccess("");
                      setNotification(null);
                    }}
                    className="text-sm text-[#c9c3ff] text-right w-full hover:text-white hover:underline transition-colors"
                  >
                    Next: Set New Password →
                  </button>
                </div>
              )}

              {/* RESET PASSWORD STEP */}
              {step === "reset" && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#3a3763] border border-white/20 rounded-md text-[#c9c3ff] text-sm">
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

              {/* Regular Error Message */}
              {error && !error.includes("verify") && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-md text-green-200 text-sm">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (error && error.includes("verify"))}
                className="w-full mt-4 py-2.5 rounded-md bg-[#6c63ff] text-white text-sm font-semibold hover:bg-[#5b54e6] transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {step === "login" ? "SIGNING IN..." : step === "forgot" ? "SENDING OTP..." : "RESETTING..."}
                  </span>
                ) : (
                  step === "login" ? "SIGN IN" : step === "forgot" ? "SEND OTP" : "RESET PASSWORD"
                )}
              </button>

              {/* Back Buttons */}
              {(step === "forgot" || step === "otp" || step === "reset") && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (step === "forgot") setStep("login");
                      if (step === "otp") setStep("forgot");
                      if (step === "reset") setStep("otp");
                      setError("");
                      setSuccess("");
                      setNotification(null);
                    }}
                    className="text-sm text-center w-full text-[#c9c3ff] hover:text-white hover:underline transition-colors"
                  >
                    {step === "forgot" ? "Back to Login" : "Back"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Input Component
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
    <label className="text-xs text-white/80 block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      maxLength={maxLength}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#3a3763] border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-[#6c63ff] disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default LoginPage;