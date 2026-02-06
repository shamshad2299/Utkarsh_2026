import React, { useState } from "react";
import {
  Briefcase,
  Mail,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import sponBg from "../assets/spon.png";

const SponsorshipForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // fake API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <>
      {/* BACKGROUND */}
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${sponBg})`,
        }}
      >
        {/* MAIN GLASS CARD */}
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.15)] p-10 text-white">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-wide">
              UTKARSH 2026
            </h2>
            <p className="text-gray-300 mt-2 text-lg">
              Sponsorship Form
            </p>
          </div>

          {/* INNER FORM BOX */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/15 rounded-2xl p-8 space-y-10"
          >
            {/* BUSINESS DETAILS */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-yellow-400">
                Business Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Name of Business"
                  icon={<Briefcase />}
                />
                <FloatingInput
                  label="Email ID"
                  type="email"
                  icon={<Mail />}
                />
                <FloatingInput
                  label="Type of Business / Market Segment"
                  icon={<Briefcase />}
                />
                <FloatingInput
                  label="Owner / Contact Person Name"
                  icon={<User />}
                />
                <FloatingInput
                  label="Phone Number"
                  icon={<Phone />}
                />
                <FloatingInput
                  label="Permanent Address"
                  icon={<MapPin />}
                />
              </div>
            </div>

            {/* SPONSORSHIP CATEGORY */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-yellow-400">
                Sponsorship Category
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <SponsorCard
                  title="Associate Sponsor"
                  price="₹5,00,000"
                />
                <SponsorCard
                  title="Event Sponsor"
                  price="₹2,00,000"
                />
                <SponsorCard
                  title="Other"
                  price="₹50,000"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="text-center pt-4">
              <button
                disabled={loading}
                className="px-14 py-3 rounded-full bg-linear-to-r from-yellow-400 to-yellow-300 
                text-black font-semibold text-lg flex items-center justify-center gap-3 mx-auto
                hover:scale-105 transition disabled:opacity-70"
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

      {/* SUCCESS POPUP */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-8 max-w-md text-center text-white shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">
              Request Submitted Successfully 🎉
            </h3>
            <p className="text-gray-200 mb-6">
              Thank you for your interest in <b>UTKARSH 2026</b>.<br />
              Our team will contact you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* 🔹 FLOATING INPUT (FIXED LABEL BEHAVIOUR) */
const FloatingInput = ({ label, type = "text", icon }) => (
  <div className="relative">
    <input
      type={type}
      required
      placeholder=" "
      className="peer w-full bg-black/30 border border-white/20 rounded-xl px-12 py-4
      text-white placeholder-transparent
      focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
    />

    {/* ICON */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
    peer-focus:text-yellow-400 peer-not-placeholder-shown:text-yellow-400">
      {icon}
    </div>

    {/* FLOATING LABEL (FIXED) */}
    <label
      className="absolute left-12 top-4 text-gray-400 transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400
      peer-not-placeholder-shown:top-1
      peer-not-placeholder-shown:text-xs
      peer-not-placeholder-shown:text-yellow-400"
    >
      {label}
    </label>
  </div>
);

/* 🔹 SPONSOR CARD */
const SponsorCard = ({ title, price }) => (
  <label className="cursor-pointer">
    <input type="radio" name="sponsor" required className="hidden peer" />
    <div
      className="h-full rounded-2xl border border-white/20 bg-black/30 p-6 text-center
      peer-checked:border-yellow-400 peer-checked:shadow-[0_0_30px_rgba(255,193,7,0.4)]
      hover:bg-black/40 transition"
    >
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-yellow-400 text-xl font-bold mt-2">{price}</p>
    </div>
  </label>
);

export default SponsorshipForm;
