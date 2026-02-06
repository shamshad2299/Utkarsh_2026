import React, { useState, useEffect } from "react";
import {
  Store,
  Mail,
  Utensils,
  User,
  Phone,
  MapPin,
  Layers,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import foodBg from "../assets/food.png";

const FoodStallForm = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShow(true), 120);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${foodBg})`,
        }}
      >
      
        <div 
          className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20 hover:text-yellow-400 transition-colors"
          onClick={handleBackToHome}
        >
          <Home size={20} />
          <span className="tracking-widest font-semibold">Home</span>
        </div>

    
        <div
          className={`
            relative w-full max-w-3xl rounded-3xl p-10
             via-[#39363f] backdrop-blur-2xl
            border border-white/20
            shadow-[0_0_80px_rgba(139,92,246,0.45)]
            transition-all duration-700
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          `}
        >
          
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-[#4a4a71] to-purple-700/40 blur-2xl -z-10" />

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-wide text-white">
              Food Stall Registration
            </h1>
            <p className="text-white/70 mt-2">
              UTKARSH&apos;26 · Virasat Se Vikas Tak
            </p>
          </div>

        
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/15 rounded-2xl p-8 space-y-8"
          >
      
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-6">
                Business Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput label="Business Name" icon={<Store />} />
                <FloatingInput label="Email ID" type="email" icon={<Mail />} />
                <FloatingInput
                  label="Food Items You Will Serve"
                  icon={<Utensils />}
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

            
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                Stall Requirement
              </h3>

              <div className="relative">
                <select
                  required
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-12 py-4 text-white
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Number of Stalls</option>
                  <option value="1">One Stall</option>
                  <option value="2">Two Stalls</option>
                  <option value="other">More than Two</option>
                </select>

                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

        
            <div className="text-center pt-4">
              <button
                disabled={loading}
                className="px-14 py-4 rounded-full bg-linear-to-r from-yellow-400 to-yellow-300
                text-black font-bold tracking-wide text-lg flex items-center justify-center gap-3 mx-auto
                hover:scale-105 transition disabled:opacity-70
                shadow-[0_10px_35px_rgba(255,193,7,0.6)]"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="backdrop-blur-xl bg-white/15 border border-yellow-400/40 rounded-3xl p-8 max-w-md text-center text-white shadow-[0_20px_60px_rgba(255,193,7,0.6)] animate-scaleIn">
            <h2 className="text-2xl font-extrabold mb-2">
              Registration Successful 🎉
            </h2>
            <p className="text-white/80 mb-6">
              Our team will contact you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

  
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
};


const FloatingInput = ({ label, type = "text", icon }) => (
  <div className="relative">
    <input
      type={type}
      required
      placeholder=" "
      className="
        peer w-full bg-black/30 border border-white/20 rounded-xl px-12 py-4
        text-white placeholder-transparent
        focus:outline-none focus:ring-2 focus:ring-yellow-400 transition
      "
    />

    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
      peer-focus:text-yellow-400">
      {icon}
    </div>

    <label
      className="
        absolute left-12 top-4 text-gray-400 transition-all
        peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400
        peer-not-placeholder-shown:top-1
        peer-not-placeholder-shown:text-xs
        peer-not-placeholder-shown:text-yellow-300
      "
    >
      {label}
    </label>
  </div>
);

export default FoodStallForm;