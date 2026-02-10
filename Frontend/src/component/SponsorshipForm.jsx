import React, { useState } from "react";
import { Briefcase, Mail, User, Phone, MapPin } from "lucide-react";
import sponBg from "../assets/spon.png";
import { publicService } from "../api/axios";

const SponsorshipForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${sponBg})`,
          paddingTop: "clamp(110px, 9vw, 170px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
        }}
      >
        <div
          className="w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.15)] text-white"
          style={{
            maxWidth: "clamp(320px, 92vw, 900px)",
            padding: "clamp(18px, 3.2vw, 40px)",
          }}
        >
          <div
            className="text-center"
            style={{ marginBottom: "clamp(26px, 4vw, 48px)" }}
          >
            <h2
              className="font-bold tracking-wide"
              style={{ fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              UTKARSH 2026
            </h2>

            <p
              className="text-gray-300 mt-2"
              style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
            >
              Sponsorship Form
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/15 rounded-2xl space-y-10"
            style={{
              padding: "clamp(16px, 2.6vw, 32px)",
            }}
          >
            {/* BUSINESS DETAILS */}
            <div>
              <h3
                className="font-semibold text-yellow-400"
                style={{
                  fontSize: "clamp(14px, 1.8vw, 18px)",
                  marginBottom: "clamp(16px, 2.5vw, 24px)",
                }}
              >
                Business Details
              </h3>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "clamp(14px, 2vw, 24px)",
                }}
              >
                <FloatingInput
                  label="Name of Business"
                  icon={<Briefcase />}
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                />

                <FloatingInput
                  label="Email ID"
                  type="email"
                  icon={<Mail />}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <FloatingInput
                  label="Type of Business / Market Segment"
                  icon={<Briefcase />}
                  value={formData.businessType}
                  onChange={(e) => handleChange("businessType", e.target.value)}
                />

                <FloatingInput
                  label="Owner / Contact Person Name"
                  icon={<User />}
                  value={formData.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                />

                <FloatingInput
                  label="Phone Number"
                  icon={<Phone />}
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />

                <FloatingInput
                  label="Permanent Address"
                  icon={<MapPin />}
                  value={formData.permanentAddress}
                  onChange={(e) =>
                    handleChange("permanentAddress", e.target.value)
                  }
                />
              </div>
            </div>

            {/* SPONSOR CATEGORY */}
            <div>
              <h3
                className="font-semibold text-yellow-400"
                style={{
                  fontSize: "clamp(14px, 1.8vw, 18px)",
                  marginBottom: "clamp(16px, 2.5vw, 24px)",
                }}
              >
                Sponsorship Category
              </h3>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "clamp(14px, 2vw, 24px)",
                }}
              >
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
                <p
                  className="text-red-300"
                  style={{
                    fontSize: "clamp(12px, 1.4vw, 14px)",
                    marginTop: "clamp(10px, 1.6vw, 16px)",
                  }}
                >
                  Please select a sponsorship category.
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <div className="text-center pt-2">
              <button
                disabled={loading || !formData.sponsorshipCategory}
                className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold flex items-center justify-center gap-3 mx-auto hover:scale-105 transition disabled:opacity-70"
                style={{
                  paddingLeft: "clamp(22px, 4vw, 56px)",
                  paddingRight: "clamp(22px, 4vw, 56px)",
                  paddingTop: "clamp(10px, 1.8vw, 14px)",
                  paddingBottom: "clamp(10px, 1.8vw, 14px)",
                  fontSize: "clamp(14px, 1.9vw, 18px)",
                }}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
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

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div
            className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl text-center text-white shadow-2xl w-full"
            style={{
              maxWidth: "clamp(300px, 92vw, 420px)",
              padding: "clamp(18px, 3vw, 32px)",
            }}
          >
            <h3
              className="font-bold text-yellow-400"
              style={{
                fontSize: "clamp(18px, 2.8vw, 26px)",
                marginBottom: "clamp(10px, 1.5vw, 14px)",
              }}
            >
              Request Submitted Successfully 🎉
            </h3>

            <p
              className="text-gray-200"
              style={{
                fontSize: "clamp(13px, 1.8vw, 16px)",
                marginBottom: "clamp(16px, 2.5vw, 24px)",
              }}
            >
              Thank you for your interest in <b>UTKARSH 2026</b>.
              <br />
              Our team will contact you shortly.
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
              style={{
                paddingLeft: "clamp(18px, 3vw, 32px)",
                paddingRight: "clamp(18px, 3vw, 32px)",
                paddingTop: "clamp(8px, 1.5vw, 10px)",
                paddingBottom: "clamp(8px, 1.5vw, 10px)",
                fontSize: "clamp(13px, 1.8vw, 16px)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const FloatingInput = ({ label, type = "text", icon, value, onChange }) => (
  <div className="relative w-full">
    <input
      type={type}
      required
      placeholder=" "
      value={value}
      onChange={onChange}
      className="peer w-full bg-black/30 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      style={{
        paddingLeft: "clamp(44px, 4vw, 52px)",
        paddingRight: "clamp(14px, 2vw, 18px)",
        paddingTop: "clamp(12px, 2vw, 16px)",
        paddingBottom: "clamp(12px, 2vw, 16px)",
        fontSize: "clamp(14px, 1.8vw, 16px)",
      }}
    />

    <div
      className="absolute text-gray-400 peer-focus:text-yellow-400 peer-not-placeholder-shown:text-yellow-400"
      style={{
        left: "clamp(14px, 1.8vw, 16px)",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      {icon}
    </div>

    <label
      className="absolute text-gray-400 transition-all leading-tight break-words
      peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:text-yellow-400
      peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-yellow-400"
      style={{
        left: "clamp(44px, 4vw, 52px)",
        right: "clamp(10px, 1.4vw, 16px)",
        top: "clamp(12px, 2vw, 16px)",
      }}
    >
      {label}
    </label>
  </div>
);

const SponsorCard = ({ title, label, price, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-full rounded-2xl border text-center transition hover:bg-black/40 ${
      active
        ? "border-yellow-400 bg-black/40 shadow-[0_0_30px_rgba(255,193,7,0.4)]"
        : "border-white/20 bg-black/30"
    }`}
    style={{
      padding: "clamp(16px, 2.4vw, 24px)",
    }}
  >
    <h4
      className="font-semibold"
      style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}
    >
      {label}
    </h4>

    <p
      className="text-yellow-400 font-bold mt-2"
      style={{ fontSize: "clamp(18px, 2.4vw, 22px)" }}
    >
      {price}
    </p>

    <p
      className="text-gray-300 mt-2"
      style={{ fontSize: "clamp(11px, 1.4vw, 12px)" }}
    >
      Value: {title}
    </p>
  </button>
);

export default SponsorshipForm;
