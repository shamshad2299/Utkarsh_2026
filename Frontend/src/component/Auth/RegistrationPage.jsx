import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
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
  const [generatedUserId, setGeneratedUserId] = useState("");

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

      if (response.success) {
        setGeneratedUserId(response.data?.userId || "VSVT26001");
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
        // Navigate to login after successful registration
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#010103] via-[#241f4a] to-[#0b0618]">
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

      {/* Guidelines Modal - Simple */}
      {showGuidelines && (
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
                onClick={() => setShowGuidelines(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleGuidelineAgree}
                disabled={!guidelinesRead}
                className="px-4 py-2 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5b54e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
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