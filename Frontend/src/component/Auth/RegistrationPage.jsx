import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [show, setShow] = useState(false);

  const guidelinesRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setShowSuccessModal(false);
        setShowGuidelines(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    if (showGuidelines && guidelinesRef.current) {
      const el = guidelinesRef.current;
      if (el.scrollHeight > el.clientHeight) {
        setNeedsScroll(true);
        setGuidelinesRead(false);
      } else {
        setNeedsScroll(false);
        setGuidelinesRead(true);
      }
    }
  }, [showGuidelines]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
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

    if (
      !name ||
      !email ||
      !mobile_no ||
      !city ||
      !gender ||
      !college ||
      !course ||
      !password ||
      !confirmPassword
    ) {
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
      const response = await register({
        name,
        email: email.toLowerCase(),
        mobile_no,
        city,
        gender: gender.toLowerCase(),
        college,
        course,
        password,
        confirmPassword,
      });

      console.log("Registration response:", response);

      if (response.success) {
        setSuccess("Registration successful!");
        setGeneratedUserId(response.data?.userId || "");
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
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
      }
    } catch (err) {
      console.error("Registration failed", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuidelinesScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setGuidelinesRead(true);
    }
  };

  const handleGuidelineAgree = () => {
    if (needsScroll && !guidelinesRead) {
      alert("Please scroll till the end to accept guidelines");
      return;
    }
    setFormData((p) => ({ ...p, agreed: true }));
    setShowGuidelines(false);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLoginRedirect = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#010103] via-[#241f4a] to-[#0b0618]">
      {/* Home Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white z-20 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Home</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16 md:py-20">
        <div className="relative w-full max-w-4xl">
          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
            transition={{ duration: 0.7 }}
            className="w-full rounded-2xl bg-gradient-to-br from-[#241f4a]/95 via-[#2b255f]/95 to-[#1b1738]/95 backdrop-blur-md border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 md:p-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#e4e1ff]">
                {title}
              </h1>
              <p className="text-base text-[#c9c3ff] milonga mt-1">
                {subtitle}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <X size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && !showSuccessModal && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2">
                <CheckCircle size={16} className="flex-shrink-0" />
                <span>{success}</span>
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
                  pattern="[0-9]*"
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
                    className="w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763]/90 border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff]"
                    disabled={loading}
                    required
                  >
                    <option value="" className="bg-[#2b255f] text-white">Select Gender</option>
                    <option value="Male" className="bg-[#2b255f] text-white">Male</option>
                    <option value="Female" className="bg-[#2b255f] text-white">Female</option>
                    <option value="Other" className="bg-[#2b255f] text-white">Other</option>
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
                <div className="space-y-1">
                  <label className="text-xs text-white/80">Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className="w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763]/90 border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff] pl-10"
                      disabled={loading}
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

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs text-white/80">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763]/90 border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff] pl-10"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
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
                  className="px-8 py-3 rounded-lg bg-[#6c63ff] text-white text-sm font-semibold hover:bg-[#5b54e6] transition disabled:opacity-60 flex items-center justify-center gap-2 mx-auto min-w-[200px]"
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
          </motion.div>
        </div>
      </div>

      {/* Rules & Guidelines Modal */}
      <AnimatePresence>
        {showGuidelines && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#241f4a] to-[#1b1738] rounded-2xl p-6 max-w-2xl w-full border border-white/20"
            >
              <h2 className="text-xl font-semibold text-[#e4e1ff] mb-4">
                Rules & Guidelines
              </h2>

              <div
                ref={guidelinesRef}
                onScroll={needsScroll ? handleGuidelinesScroll : undefined}
                className="max-h-[50vh] overflow-y-auto text-sm text-white/80 space-y-4 pr-2"
              >
                <p>
                  1. The registration portal for all the events is provided on the
                  UTKARSH-2026 website. Participants must register online for the
                  category they wish to participate in.
                </p>

                <p>
                  2. Interested colleges or institutions are requested to confirm their
                  participation team list through email, latest by FEBRUARY 21, 2026.
                </p>

                <p>
                  3. The participating teams must report at BBDEG Campus, Lucknow for
                  in-person registration on FEBRUARY 22, 2026 from 12:30 PM to 06:00 PM
                  at the Registration Help Desks set up on campus.
                </p>

                <p>
                  4. The remaining instructions will be given to the participants at
                  the Registration Help Desk.
                </p>

                <p>
                  5. All teams are mandatorily required to carry the following documents.
                  Failing to do so may result in denial of registration:
                </p>

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
                <span className="text-sm text-white/80">I have read till the end</span>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGuidelineAgree}
                  disabled={needsScroll && !guidelinesRead}
                  className="px-4 py-2 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5b54e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  I Agree
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#241f4a] to-[#1b1738] rounded-2xl p-6 text-center max-w-sm w-full border border-white/20"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-semibold text-[#e4e1ff] mb-1">
                Registration Successful!
              </h2>
              <p className="text-sm text-white/80 mb-4">
                Your account has been created successfully
              </p>
              
              <div className="mb-4 p-3 bg-[#3a3763]/50 rounded-lg border border-white/20">
                <p className="text-xs text-white/80 mb-1">Your Utkarsh ID is:</p>
                <p className="text-xl font-bold text-[#6c63ff] tracking-wider">
                  {generatedUserId || "VSVT26001"}
                </p>
              </div>

              <p className="text-xs text-white/60 mb-4">
                Please save your Utkarsh ID. You'll need it to login.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-2 rounded-lg bg-[#6c63ff] text-white font-semibold hover:bg-[#5b54e6] transition-all text-sm"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  pattern,
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
        pattern={pattern}
        disabled={disabled}
        className={`w-full px-3 py-3 rounded-lg text-sm bg-[#3a3763]/90 border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-[#6c63ff] ${
          icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  </div>
);

export default RegistrationPage;