import React, { useEffect, useState } from "react";
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
    <div className="h-screen relative overflow-hidden flex flex-col">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundGlow />
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">

        <div className="relative w-full max-w-4xl flex justify-center">

          {/* Top Left Image */}
          <img
            src={Food1}
            alt="Food Stall 1"
            className="hidden md:block absolute top-0 left-0 
                       -translate-x-1/2 -translate-y-1/2
                       w-20 md:w-28 lg:w-40 xl:w-48 
                       object-contain drop-shadow-xl z-10"
          />

          {/* Bottom Right Image */}
          <img
            src={Food2}
            alt="Food Stall 2"
            className="hidden md:block absolute bottom-0 right-0 
                       translate-x-1/2 translate-y-1/2
                       w-20 md:w-28 lg:w-40 xl:w-48 
                       object-contain drop-shadow-xl z-10"
          />

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
                Food Stall Form
              </h1>
              <p className="text-sm md:text-base text-[#c9c3ff] mt-2">
                Business Details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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
                  label="Food Items"
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
                className="w-full mt-4 py-2 rounded-md 
                           bg-[#6c63ff] text-white text-sm font-semibold
                           hover:bg-[#5b54e6] transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Monument Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <MonumentBottom />
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#2b255f] to-[#1b1738] 
                          border border-white/20 rounded-lg 
                          px-6 py-5 text-center text-white w-full max-w-xs">
            <h2 className="text-base font-semibold mb-2">
              Registration Successful
            </h2>
            <p className="text-xs text-white/80 mb-4">
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

/* Input Component */
const Input = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-white block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded text-sm
                 bg-[#3a3763]/90 border border-white/40
                 text-white placeholder:text-white/60
                 focus:outline-none focus:border-white/60"
    />
  </div>
);

/* Select Component */
const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-xs text-white block mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-3 py-2 rounded text-sm
                 bg-[#3a3763]/90 border border-white/40
                 text-white focus:outline-none focus:border-white/60"
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
