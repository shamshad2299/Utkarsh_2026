import React, { useState } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, X, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const RegistrationPage = ({
  title = "UTKARSH'26",
  subtitle = "Create account to get your Utkarsh ID",
}) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    city: "",
    gender: "",
    college: "",
    course: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  const {
    name,
    email,
    mobile_no,
    city,
    gender,
    college,
    course,
    password,
    confirmPassword,
    agreed,
  } = formData;

  if (!name || !email || !mobile_no || !city || !gender || !college || !course || !password || !confirmPassword) {
    setError("All required fields must be provided");
    return;
  }

  if (!agreed) {
    setError("Please accept Rules & Guidelines");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    
    // Make API call to register
    const response = await register({
      name,
      email: email.toLowerCase(),
      mobile_no,
      city,
      gender: gender.toLowerCase(),
      college,
      course,
      password,
    });
    // Navigate to verify email page with complete user data
    navigate("/verify", {
      state: {
        email: email.toLowerCase(),
        userData: {
          name: name,
          college: college,
          course: course,
          email: email.toLowerCase(),
          userId :response?.data?.userId,
        }
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGuidelineAgree = () => {
    setFormData((p) => ({ ...p, agreed: true }));
    setShowGuidelines(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#010103] via-[#241f4a] to-[#0b0618]">
      {/* Home Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white z-10 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Home</span>
      </button>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-16 md:py-20">
        <div className="relative w-full max-w-4xl">
          {/* Registration Card */}
          <div className="w-full rounded-2xl bg-[#241f4a] bg-opacity-90 border border-white/20 shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#e4e1ff]">
                {title}
              </h1>
              <p className="text-base text-[#c9c3ff] mt-1">
                {subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Name */}
                <Input
                  label="Full Name"
                  icon={<User size={16} />}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                />

                {/* Email */}
                <Input
                  label="Email"
                  type="email"
                  icon={<Mail size={16} />}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />

                {/* Mobile Number */}
                <Input
                  label="Mobile Number"
                  icon={<Phone size={16} />}
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile"
                  maxLength="10"
                  disabled={loading}
                  required
                />

                {/* City */}
                <Input
                  label="City"
                  icon={<MapPin size={16} />}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  disabled={loading}
                  required
                />

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs text-white/80">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763] border border-white/40 text-white focus:outline-none focus:border-[#6c63ff]"
                    disabled={loading}
                    required
                  >
                    <option value="" className="bg-[#2b255f]">Select Gender</option>
                    <option value="Male" className="bg-[#2b255f]">Male</option>
                    <option value="Female" className="bg-[#2b255f]">Female</option>
                    <option value="Other" className="bg-[#2b255f]">Other</option>
                  </select>
                </div>

                {/* College */}
                <Input
                  label="College"
                  icon={<MapPin size={16} />}
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  disabled={loading}
                  required
                />

                {/* Course */}
                <Input
                  label="Course"
                  icon={<User size={16} />}
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Enter your course"
                  disabled={loading}
                  required
                />

                {/* Password */}
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  disabled={loading}
                />

                {/* Confirm Password */}
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                  disabled={loading}
                />
              </div>

              {/* Rules & Guidelines Checkbox */}
              <div className="flex items-start gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="mt-1 accent-[#6c63ff]"
                  disabled={loading}
                />
                <span>
                  I agree to{" "}
                  <span
                    onClick={() => !loading && setShowGuidelines(true)}
                    className="underline cursor-pointer text-[#6c63ff] hover:text-[#8b7eff] transition-colors"
                  >
                    Rules & Guidelines
                  </span>
                </span>
              </div>

              {/* Register Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-lg bg-[#6c63ff] text-white text-sm font-semibold hover:bg-[#5b54e6] transition disabled:opacity-60 flex items-center justify-center gap-2 mx-auto min-w-[200px] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      REGISTERING...
                    </>
                  ) : (
                    "REGISTER"
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center text-white/80 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#6c63ff] cursor-pointer hover:text-[#8b7eff] hover:underline transition-colors"
                >
                  Login here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Guidelines Modal */}
      {showGuidelines && (
        <GuidelinesModal
          guidelinesRead={guidelinesRead}
          setGuidelinesRead={setGuidelinesRead}
          onClose={() => setShowGuidelines(false)}
          onAgree={handleGuidelineAgree}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && userData && (
        <SuccessPopup
          userData={userData}
          onClose={() => {
            setShowSuccessPopup(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
};

// Success Popup Component - Fully Responsive
const SuccessPopup = ({ userData, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(userData.utkarshId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[95%] sm:max-w-md bg-gradient-to-br from-[#6c63ff] to-[#4a42b0] rounded-2xl shadow-2xl p-[2px] animate-slideUp">
        <div className="bg-[#241f4a] rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer text-white/60 hover:text-white transition-colors z-10 bg-black/20 rounded-full p-1"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Congratulations Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#e4e1ff] mb-1 sm:mb-2 px-2">
            Registration Successful! 🎉
          </h2>
          <p className="text-center text-[#c9c3ff] text-xs sm:text-sm mb-4 sm:mb-6 px-2">
            Your Utkarsh ID has been generated
          </p>

          {/* Utkarsh ID Card */}
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
                    <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">Name</span>
                    <p className="font-semibold text-white truncate">{userData.name}</p>
                  </div>
                  <div className="bg-[#2b255f]/50 p-2 rounded-lg">
                    <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">College</span>
                    <p className="font-semibold text-white truncate">{userData.college || "Not specified"}</p>
                  </div>
                  <div className="bg-[#2b255f]/50 p-2 rounded-lg">
                    <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">Course</span>
                    <p className="font-semibold text-white truncate">{userData.course || "Not specified"}</p>
                  </div>
                  <div className="bg-[#2b255f]/50 p-2 rounded-lg">
                    <span className="text-[#c9c3ff] block text-[10px] sm:text-xs">Date</span>
                    <p className="font-semibold text-white text-[10px] sm:text-xs">{userData.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleCopyId}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer border-2 border-[#6c63ff] text-[#6c63ff] rounded-lg font-semibold hover:bg-[#6c63ff] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
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
              onClick={handleClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#6c63ff] to-[#4a42b0] text-white rounded-lg font-semibold cursor-pointer hover:from-[#5b54e6] hover:to-[#3f3899] transition-all duration-200 text-xs sm:text-sm"
            >
              Continue to Login
            </button>
          </div>

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
        
        /* Custom breakpoint for extra small devices */
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
};

// Guidelines Modal Component
const GuidelinesModal = ({ guidelinesRead, setGuidelinesRead, onClose, onAgree }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-8">
    <div className="bg-[#241f4a] rounded-2xl p-6 max-w-2xl w-full border border-white/20">
      <h2 className="text-xl font-semibold text-[#e4e1ff] mb-4">
        Rules & Guidelines
      </h2>

      <div className="max-h-[50vh] overflow-y-auto text-sm text-white/80 space-y-4 pr-2">
        <p>1. The registration portal for all the events is provided on the UTKARSH-2026 website. Participants must register online for the category they wish to participate in.</p>
        <p>2. Interested colleges or institutions are requested to confirm their participation team list through email, latest by FEBRUARY 21, 2026.</p>
        <p>3. The participating teams must report at BBDEG Campus, Lucknow for in-person registration on FEBRUARY 22, 2026 from 12:30 PM to 06:00 PM at the Registration Help Desks set up on campus.</p>
        <p>4. The remaining instructions will be given to the participants at the Registration Help Desk.</p>
        <p>5. All teams are mandatorily required to carry the following documents. Failing to do so may result in denial of registration:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Authority Letter issued by the Director/Principal/Dean of the respective Institute/College/Faculty with the name of all participants.</li>
          <li>Institute/College Identity Cards & Copy of Aadhar Card and Two passport size recent colored photographs. The registration fee is Rs. 200/- for external students per participants.</li>
          <li>Fooding & lodging charges (if opted for): Rs. 1000/- per participants for external students for entire event.</li>
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={guidelinesRead}
          onChange={() => setGuidelinesRead(!guidelinesRead)}
          className="accent-[#6c63ff]"
        />
        <span className="text-sm text-white/80">I have read the guidelines</span>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onAgree}
          disabled={!guidelinesRead}
          className="px-4 py-2 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5b54e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
        >
          I Agree
        </button>
      </div>
    </div>
  </div>
);

// Reusable Input Component
const Input = ({
  label,
  type = "text",
  icon,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  maxLength,
}) => (
  <div className="space-y-1">
    <label className="text-xs text-white/80">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763] border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff] ${
          icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  </div>
);

// Password Input Component
const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
  disabled,
}) => (
  <div className="space-y-1">
    <label className="text-xs text-white/80">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
        <Lock size={16} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763] border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff] pl-10"
        disabled={disabled}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default RegistrationPage;