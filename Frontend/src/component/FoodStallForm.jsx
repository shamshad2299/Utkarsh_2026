import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { publicService } from "../api/axios";
import BackgroundGlow from "./BackgroundGlow";
import MonumentBottom from "./MonumentBottom";
import Food1 from "../assets/Food_stall1.png";
import Food2 from "../assets/Food_stall2.png";

const FoodStallForm = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    foodItems: "",
    ownerName: "",
    phoneNumber: "",
    permanentAddress: "",
    numberOfStalls: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicService.createFoodStall(formData);
      setSuccess(true);
      setFormData({
        businessName: "",
        email: "",
        foodItems: "",
        ownerName: "",
        phoneNumber: "",
        permanentAddress: "",
        numberOfStalls: "",
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Food stall request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh)] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BackgroundGlow />
      </div>

      <div className="absolute inset-x-0 bo sm:bottom-0 lg:-bottom-15 -bottom-20">
        <MonumentBottom />
      </div>

      {/* Content */}
      <div className="relative z-10 flex md:mt-10 justify-center px-4 py-6">
        {/* Home */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-2 text-white cursor-pointer hover:opacity-80 z-20"
        >
          <Home size={16} />
          <span className="text-xs tracking-wider">Home</span>
        </div>

        {/* Card Container with Images */}
        <div className="relative w-full max-w-md lg:max-w-2xl">
          {/* Top Left Image */}
          <div className="absolute max-md:hidden md:-top-15 md:-left-15  lg:-top-22 lg:-left-20 z-10">
            <img
              src={Food1}
              alt="Food Stall 1"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-50 lg:h-50 object-contain drop-shadow-lg"
            />
          </div>

          {/* Bottom Right Image */}
          <div className="absolute max-md:hidden  md:-bottom-10 md:-right-20 lg:-bottom-10 lg:-right-35 z-10">
            <img
              src={Food2}
              alt="Food Stall 2"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-50 lg:h-50 object-contain drop-shadow-lg"
            />
          </div>

          {/* Card - Wider on large screens */}
          <div
            className={`
              w-full rounded-xl px-12 py-5
              bg-gradient-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90
              backdrop-blur-md border border-white/20
              shadow-[0_10px_40px_rgba(0,0,0,0.8)]
              transition-all duration-700
              ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <div className="text-center mb-4">
              <h1 className="text-3xl font-semibold text-[#e4e1ff]">
                Food Stall Form
              </h1>
              <p className="text-lg text-[#c9c3ff] milonga mt-2">
                Business Details
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-8">
                <Input
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name..."
                />
                <Input
                  label="Email ID"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address..."
                />
                <Input
                  label="Food Items You Will Serve"
                  name="foodItems"
                  value={formData.foodItems}
                  onChange={handleChange}
                  placeholder="Enter food items..."
                />
                <Input
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name..."
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number..."
                />
                <Input
                  label="Permanent Address"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter permanent address..."
                />

                <div className="sm:col-span-2">
                  <Select
                    label="Number of Stalls"
                    name="numberOfStalls"
                    value={formData.numberOfStalls}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "Select number of stalls" },
                      { value: "1", label: "1 Stall" },
                      { value: "2", label: "2 Stalls" },
                      { value: "3", label: "More than 2" },
                    ]}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-3 py-2 rounded-md bg-[#6c63ff] text-white text-sm font-semibold
                           hover:bg-[#5b54e6] transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#2b255f] to-[#1b1738] border border-white/20 rounded-lg px-6 py-4 text-center text-white w-full max-w-xs">
            <h2 className="text-base font-semibold mb-1">
              Registration Successful
            </h2>
            <p className="text-xs text-white/80 mb-3">
              Our team will contact you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-4 py-1.5 rounded-md bg-[#6c63ff] hover:bg-[#5b54e6] text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Reusable Input Component with DARKER BORDER */
const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-0.5">
    <label className="text-xs text-white poppin">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-3 py-3 rounded text-xs bg-[#3a3763]/90 border border-white/40
                 text-white placeholder:text-white focus:outline-none focus:border-white/60 mt-2 "
    />
  </div>
);

/* Reusable Select Component with DARKER BORDER */
const Select = ({ label, name, value, onChange, options }) => (
  <div className="w-full space-y-0.5 mt-1">
    <label className="text-xs text-[#e5e3ff] block poppin">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="
        block w-full
        px-3 py-3
        rounded text-xs
        bg-[#3a3763]/90
        border border-white/40
        text-white
        focus:outline-none focus:border-white/60
        appearance-none
      "
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-[#3a3763] text-white"
        >
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default FoodStallForm;
