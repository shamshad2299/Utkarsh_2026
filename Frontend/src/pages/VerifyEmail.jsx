// src/pages/VerifyEmail.jsx
import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ArrowLeft, Mail, Check, X, Copy } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationOTP } = useAuth();

  const email = location.state?.email || "";
  const userDataFromState = location.state?.userData || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(true);

  // States for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [redirectTimer, setRedirectTimer] = useState(10);

  // If no email in state, redirect to register
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Redirect timer for success popup
  useEffect(() => {
    let interval = null;
    if (showSuccessPopup && redirectTimer > 0) {
      interval = setInterval(() => {
        setRedirectTimer((prev) => prev - 1);
      }, 1000);
    } else if (redirectTimer === 0) {
      handleClosePopup();
    }
    return () => clearInterval(interval);
  }, [showSuccessPopup, redirectTimer]);

  const handleOtpChange = useCallback((element, index) => {
    if (isNaN(element.value)) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  }, []);

  const handleVerify = useCallback(async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await verifyEmail({
        email,
        otp: otpString,
      });

      setMessage("Email verified successfully!");
      setUserData({
        name: userDataFromState.name || "User",
        email: email,
        utkarshId:  userDataFromState.userId || "not found",
        college: userDataFromState.college || "Not specified",
        course: userDataFromState.course || "Not specified",
        registrationDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });

      // Show success popup after short delay
      setTimeout(() => {
        setShowSuccessPopup(true);
        setRedirectTimer(10);
      }, 1000);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }, [email, otp, userDataFromState, verifyEmail]);

  const handleResendOTP = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resendVerificationOTP({ email });
      setTimer(600);
      setIsActive(true);
      setMessage("New OTP sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }, [email, resendVerificationOTP]);

  const handleBackToRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleClosePopup = useCallback(() => {
    setShowSuccessPopup(false);
    navigate("/login");
  }, [navigate]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }, []);

  // Memoize the formatted time
  const formattedTime = useMemo(() => formatTime(timer), [timer, formatTime]);

  // Memoize OTP inputs to prevent unnecessary re-renders
  const otpInputs = useMemo(() => {
    return otp.map((data, index) => (
      <input
        key={index}
        type="text"
        maxLength="1"
        value={data}
        onChange={(e) => handleOtpChange(e.target, index)}
        onFocus={(e) => e.target.select()}
        className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold bg-[#3a3763] border border-white/40 text-white rounded-lg focus:outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20"
        disabled={loading || !isActive}
        aria-label={`OTP digit ${index + 1}`}
      />
    ));
  }, [otp, loading, isActive, handleOtpChange]);

  const isVerifyDisabled = useMemo(() => 
    loading || otp.join("").length !== 6 || !isActive, 
  [loading, otp, isActive]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#010103] via-[#241f4a] to-[#0b0618]">
      {/* Back Button */}
      <button
        onClick={handleBackToRegister}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white z-10 transition-colors cursor-pointer"
        aria-label="Back to Register"
      >
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Back to Register</span>
      </button>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-16 md:py-20">
        <div className="relative w-full max-w-md">
          {/* Verification Card */}
          <div className="w-full rounded-2xl bg-[#241f4a] bg-opacity-90 border border-white/20 shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-[#6c63ff]/20 rounded-full flex items-center justify-center mb-4">
                <Mail size={32} className="text-[#6c63ff]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#e4e1ff]">
                Verify Your Email
              </h2>
              <p className="text-sm text-[#c9c3ff] mt-2">
                We've sent a verification code to
              </p>
              <p className="text-[#6c63ff] font-medium mt-1 break-all">
                {email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <div className="flex justify-center gap-2 md:gap-3">
                {otpInputs}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-white/60">
                  Time remaining:{" "}
                  <span
                    className={
                      timer < 60 ? "text-red-400 font-medium" : "text-[#6c63ff]"
                    }
                  >
                    {formattedTime}
                  </span>
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                  {error}
                </div>
              )}
              {message && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">
                  {message}
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleVerify}
                  disabled={isVerifyDisabled}
                  className="w-full py-3 rounded-lg bg-[#6c63ff] text-white font-semibold hover:bg-[#5b54e6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Verify Email"
                >
                  {loading ? "VERIFYING..." : "VERIFY EMAIL"}
                </button>

                {!isActive ? (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full py-3 rounded-lg border-2 border-[#6c63ff] text-[#6c63ff] font-semibold hover:bg-[#6c63ff] hover:text-white transition disabled:opacity-50"
                    aria-label="Resend OTP"
                  >
                    RESEND OTP
                  </button>
                ) : (
                  <p className="text-center text-sm text-white/40">
                    Didn't receive code? You can resend after timer expires
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && userData && (
        <SuccessPopup
          userData={userData}
          timer={redirectTimer}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

// Memoized Timer Display Component
const TimerDisplay = memo(({ timer }) => (
  <div className="text-center mb-4">
    <p className="text-sm text-[#c9c3ff]">
      Redirecting to login in{" "}
      <span className="text-[#6c63ff] font-bold text-lg">{timer}</span>{" "}
      seconds
    </p>
  </div>
));

TimerDisplay.displayName = 'TimerDisplay';

// Memoized User Info Card Component
const UserInfoCard = memo(({ userData }) => (
  <div className="bg-gradient-to-br from-[#3a3763] to-[#2b255f] rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 border border-[#6c63ff]">
    <div className="text-center mb-2 sm:mb-4">
      <span className="text-[10px] sm:text-xs font-semibold text-[#6c63ff] uppercase tracking-wider">
        Your Unique Utkarsh ID
      </span>
    </div>

    <div className="bg-[#1a1740] rounded-lg p-3 sm:p-4 border border-[#6c63ff]/30">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
        <span className="text-xs sm:text-sm text-[#c9c3ff]">ID:</span>
        <span className="text-base sm:text-xl font-mono font-bold text-[#6c63ff] break-all text-center sm:text-left">
          {userData.utkarshId}
        </span>
      </div>

      <div className="border-t border-[#6c63ff]/30 pt-3 sm:pt-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="bg-[#2b255f]/50 p-2 rounded-lg">
            <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">
              Name
            </span>
            <p className="font-semibold text-white truncate">
              {userData.name}
            </p>
          </div>
          <div className="bg-[#2b255f]/50 p-2 rounded-lg">
            <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">
              College
            </span>
            <p className="font-semibold text-white truncate">
              {userData.college}
            </p>
          </div>
          <div className="bg-[#2b255f]/50 p-2 rounded-lg">
            <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">
              Course
            </span>
            <p className="font-semibold text-white truncate">
              {userData.course}
            </p>
          </div>
          <div className="bg-[#2b255f]/50 p-2 rounded-lg">
            <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">
              Date
            </span>
            <p className="font-semibold text-white text-[10px] sm:text-xs">
              {userData.registrationDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

UserInfoCard.displayName = 'UserInfoCard';

// Memoized Action Buttons Component
const ActionButtons = memo(({ onCopy, onClose, copied }) => (
  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
    <button
      onClick={onCopy}
      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer border-2 border-[#6c63ff] text-[#6c63ff] rounded-lg font-semibold hover:bg-[#6c63ff] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
      aria-label={copied ? "Copied!" : "Copy ID"}
    >
      {copied ? (
        <>
          <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Copy ID</span>
        </>
      )}
    </button>
    <button
      onClick={onClose}
      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#6c63ff] to-[#4a42b0] text-white rounded-lg font-semibold cursor-pointer hover:from-[#5b54e6] hover:to-[#3f3899] transition-all duration-200 text-xs sm:text-sm"
      aria-label="Login Now"
    >
      Login Now
    </button>
  </div>
));

ActionButtons.displayName = 'ActionButtons';

// Success Popup Component - Memoized
const SuccessPopup = memo(({ userData, timer, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(userData.utkarshId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [userData.utkarshId]);

  // Memoize static content that doesn't change
  const staticContent = useMemo(() => (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer text-white/60 hover:text-white transition-colors z-10 bg-black/20 rounded-full p-1"
        aria-label="Close"
      >
        <X size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Check size={32} className="sm:w-10 sm:h-10 text-white" />
      </div>

      {/* Congratulations Text */}
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[#e4e1ff] mb-1 sm:mb-2 px-2">
        Registration Successful! 🎉
      </h2>
      <p className="text-center text-[#c9c3ff] text-xs sm:text-sm mb-4 sm:mb-6 px-2">
        Your Utkarsh ID has been generated
      </p>
    </>
  ), [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[95%] sm:max-w-md bg-gradient-to-br from-[#6c63ff] to-[#4a42b0] rounded-2xl shadow-2xl p-[2px] animate-slideUp">
        <div className="bg-[#241f4a] rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {staticContent}

          {/* Timer Message - Only this updates with timer */}
          <TimerDisplay timer={timer} />

          {/* User Info Card - Only updates if userData changes */}
          <UserInfoCard userData={userData} />

          {/* Action Buttons - Only updates if copied state changes */}
          <ActionButtons 
            onCopy={handleCopyId} 
            onClose={onClose} 
            copied={copied} 
          />

          {/* Note */}
          <p className="text-[10px] sm:text-xs text-center text-[#c9c3ff] mt-3 sm:mt-4">
            Please save your Utkarsh ID for future reference
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        @media (min-width: 480px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
});

SuccessPopup.displayName = 'SuccessPopup';

export default VerifyEmail;