import React, { useState, useEffect } from "react";
import { Briefcase, Mail, User, Phone, MapPin, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { publicService } from "../api/axios";
import BackgroundGlow from "./BackgroundGlow";
import MonumentBottom from "./MonumentBottom";

const SponsorshipForm = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    businessType: "",
    ownerName: "",
    phoneNumber: "",
    permanentAddress: "",
    sponsorshipCategory: "",
    amount: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategorySelect = (category, amount) => {
    handleChange("sponsorshipCategory", category);
    handleChange("amount", amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        businessName: formData.businessName.trim(),
        email: formData.email.trim().toLowerCase(),
        businessType: formData.businessType.trim(),
        ownerName: formData.ownerName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        permanentAddress: formData.permanentAddress.trim(),
        sponsorshipCategory: formData.sponsorshipCategory,
        amount: Number(formData.amount),
      };

      await publicService.createSponsorship(payload);
      setSuccess(true);

      setFormData({
        businessName: "",
        email: "",
        businessType: "",
        ownerName: "",
        phoneNumber: "",
        permanentAddress: "",
        sponsorshipCategory: "",
        amount: "",
      });
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to submit sponsorship request"
      );
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
        
        {/* Card Container with Images */}
        <div className="relative w-full max-w-md lg:max-w-4xl">
          {/* Card */}
          <div
            className={`
              w-full rounded-xl xl:px-12 lg:px-10 md:px-6 px-4 py-5
              bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90
              backdrop-blur-md border border-white/20
              shadow-[0_10px_40px_rgba(0,0,0,0.8)]
              transition-all duration-700
              ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <div className="text-center mb-4">
              <h1 className="text-3xl font-semibold text-[#e4e1ff]">
                UTKARSH 2026
              </h1>
              <p className="text-lg text-[#c9c3ff] milonga mt-2">
                Sponsorship Form
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BUSINESS DETAILS */}
              <div>
                <h3 className="text-sm font-semibold text-[#e4e1ff] mb-3">
                  Business Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-8">
                  <Input
                    label="Name of Business"
                    icon={<Briefcase size={16} />}
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    placeholder="Enter business name..."
                  />

                  <Input
                    label="Email ID"
                    type="email"
                    icon={<Mail size={16} />}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email address..."
                  />

                  <Input
                    label="Type of Business / Market Segment"
                    icon={<Briefcase size={16} />}
                    value={formData.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    placeholder="Enter business type..."
                  />

                  <Input
                    label="Owner / Contact Person Name"
                    icon={<User size={16} />}
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    placeholder="Enter owner name..."
                  />

                  <Input
                    label="Phone Number"
                    icon={<Phone size={16} />}
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number..."
                  />

                  <Input
                    label="Permanent Address"
                    icon={<MapPin size={16} />}
                    value={formData.permanentAddress}
                    onChange={(e) => handleChange("permanentAddress", e.target.value)}
                    placeholder="Enter permanent address..."
                  />
                </div>
              </div>

              {/* SPONSOR CATEGORY */}
              <div>
                <h3 className="text-sm font-semibold text-[#e4e1ff] mb-3">
                  Sponsorship Category
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <SponsorCard
                    title="powered_by"
                    label="Powered By Sponsor"
                    price="₹4,00,000"
                    active={formData.sponsorshipCategory === "powered_by"}
                    onClick={() => handleCategorySelect("powered_by", 400000)}
                  />

                  <SponsorCard
                    title="co_powered_by"
                    label="Co-Powered By"
                    price="₹2,00,000"
                    active={formData.sponsorshipCategory === "co_powered_by"}
                    onClick={() => handleCategorySelect("co_powered_by", 200000)}
                  />

                  <SponsorCard
                    title="associate"
                    label="Associate Sponsor"
                    price="₹1,00,000"
                    active={formData.sponsorshipCategory === "associate"}
                    onClick={() => handleCategorySelect("associate", 100000)}
                  />

                  <SponsorCard
                    title="other"
                    label="Other"
                    price="₹50,000"
                    active={formData.sponsorshipCategory === "other"}
                    onClick={() => handleCategorySelect("other", 50000)}
                  />
                </div>

                {!formData.sponsorshipCategory && (
                  <p className="text-xs text-red-300 mt-2">
                    Please select a sponsorship category.
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={loading || !formData.sponsorshipCategory}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-md bg-[#6c63ff] text-white text-sm font-semibold
                           hover:bg-[#5b54e6] transition disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Sponsorship Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-linear-to-br from-[#2b255f] to-[#1b1738] border border-white/20 rounded-lg px-6 py-4 text-center text-white w-full max-w-xs">
            <h2 className="text-base font-semibold mb-1">
              Request Submitted Successfully 🎉
            </h2>
            <p className="text-xs text-white/80 mb-3">
              Thank you for your interest in <b>UTKARSH 2026</b>.
              <br />
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

/* Reusable Input Component with Icon */
const Input = ({
  label,
  type = "text",
  icon,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-0.5">
    <label className="text-xs text-white poppin">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className={`w-full px-3 py-3 rounded text-xs bg-[#3a3763]/90 border border-white/40
                   text-white placeholder:text-white/60 focus:outline-none focus:border-white/60
                   ${icon ? 'pl-10' : 'pl-3'}`}
      />
    </div>
  </div>
);

/* Sponsor Card Component */
const SponsorCard = ({ title, label, price, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full rounded-lg p-3 text-center transition-all
      ${active 
        ? 'bg-[#6c63ff] border border-[#6c63ff] shadow-[0_0_20px_rgba(108,99,255,0.5)]' 
        : 'bg-[#3a3763]/90 border border-white/20 hover:bg-[#4a4575]'
      }
    `}
  >
    <h4 className="text-xs font-semibold text-white mb-1">
      {label}
    </h4>

    <p className="text-sm font-bold text-white">
      {price}
    </p>

    <p className="text-[10px] text-white/60 mt-1">
      Value: {title.replace(/_/g, ' ')}
    </p>
  </button>
);

export default SponsorshipForm;