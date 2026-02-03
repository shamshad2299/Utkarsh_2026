import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import regImage from "../../assets/reg.png";
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

  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");

  const guidelinesRef = useRef(null);

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
        gender : gender.toLowerCase(),
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

  const inputClass = `
    w-full mt-2 p-3 rounded-xl outline-none
    bg-white/5 backdrop-blur-md
    border border-gray-700
    text-white placeholder:text-gray-400
    focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]
    transition
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row bg-linear-to-br from-[#010103] via-[#39363f] to-[#0b0618] overflow-hidden">
      <div 
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20 hover:text-purple-300 transition-colors"
        onClick={handleBackToHome}
      >
        <ArrowLeft size={20} /> 
        <span className="tracking-widest font-semibold">Home</span>
      </div>

      {/* Left Image Section */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-6">
        <img 
          src={regImage} 
          alt="Utkarsh Registration" 
          className="max-w-full md:max-w-[90%] opacity-90 rounded-2xl shadow-2xl" 
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-10 md:py-16">
        <div className="w-full max-w-xl bg-black/30 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
          <h1 className="text-4xl font-black italic text-[#8B5CF6] text-center">
            {title}
          </h1>
          <p className="text-gray-300 mb-8 text-center">{subtitle}</p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && !showSuccessModal && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-300 mb-1">Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-gray-300 mb-1">Mobile Number *</label>
                <input
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  className={inputClass}
                  maxLength="10"
                  pattern="[0-9]*"
                  disabled={loading}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-300 mb-1">City *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-300 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${inputClass} text-white`}
                  disabled={loading}
                  required
                >
                  <option value="" className="text-black bg-white">Select Gender</option>
                  <option value="Male" className="text-black bg-white">Male</option>
                  <option value="Female" className="text-black bg-white">Female</option>
                  <option value="Other" className="text-black bg-white">Other</option>
                </select>
              </div>

              {/* College */}
              <div>
                <label className="block text-gray-300 mb-1">College *</label>
                <input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-gray-300 mb-1">Course *</label>
                <input
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Enter your course"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Rules & Guidelines Checkbox */}
            <div className="flex gap-3 text-sm text-gray-300 items-start">
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                className="mt-1 accent-[#8B5CF6]"
                disabled={loading}
              />
              <span>
                I agree to{" "}
                <span
                  onClick={() => !loading && setShowGuidelines(true)}
                  className="underline cursor-pointer text-[#8B5CF6] hover:text-purple-400 transition-colors"
                >
                  Rules & Guidelines
                </span>
              </span>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] font-black italic tracking-widest uppercase text-white hover:from-[#7C4DFF] hover:to-[#5B21B6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>

            {/* Login Link */}
            <div className="text-center text-gray-300 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#8B5CF6] cursor-pointer hover:text-purple-400 hover:underline transition-colors"
              >
                Login here
              </span>
            </div>
          </form>
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
              className="bg-black/60 backdrop-blur-2xl rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-white/20"
            >
              <h2 className="text-2xl font-black text-[#8B5CF6] mb-4">
                Rules & Guidelines
              </h2>

              <div
                ref={guidelinesRef}
                onScroll={needsScroll ? handleGuidelinesScroll : undefined}
                className="h-[50vh] overflow-y-auto text-sm text-gray-300 space-y-4 pr-2"
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

                <ul className="list-disc ml-6 space-y-2 text-gray-300">
                  <li>Authority Letter issued by the Director/Principal/Dean of the respective Institute/College/Faculty with the name of all participants.</li>
                  <li>Institute/College Identity Cards & Copy of Aadhar Card and Two passport size recent colored photographs. The registration fee is Rs. 200/- for external students per participants.</li>
                  <li>Fooding & lodging charges (if opted for): Rs. 1000/- per participants for external students for entire event.</li>
                </ul>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={guidelinesRead}
                  onChange={() => setGuidelinesRead(!guidelinesRead)}
                  className="accent-[#8B5CF6]"
                />
                <span className="text-gray-300">I have read till the end</span>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGuidelineAgree}
                  disabled={needsScroll && !guidelinesRead}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white hover:from-[#7C4DFF] hover:to-[#5B21B6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="bg-black/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 text-center max-w-md w-full border border-white/20"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-3xl font-black text-green-400 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-300 mb-6">
                Your account has been created successfully
              </p>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-[#8B5CF6]/20 to-[#6D28D9]/20 rounded-xl border border-purple-500/30">
                <p className="text-gray-300 mb-2">Your Utkarsh ID is:</p>
                <p className="text-3xl font-bold text-[#8B5CF6] tracking-wider">
                  {generatedUserId || "VSVT26001"}
                </p>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Please save your Utkarsh ID. You'll need it to login.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-semibold hover:from-[#7C4DFF] hover:to-[#5B21B6] transition-all"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
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

export default RegistrationPage;