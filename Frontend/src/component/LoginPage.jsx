import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import regImage from "../assets/uk.png";

const LoginPage = () => {
  const [step, setStep] = useState("login");

  const [data, setData] = useState({
    utkarshId: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-linear-to-br from-[#010103] via-[#39363f] to-[#0b0618] text-white overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${regImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20">
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Home</span>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.35)]">

          <h1 className="text-4xl font-black italic text-[#8B5CF6] uppercase text-center mb-2">
            UTKARSH'26
          </h1>

          {step === "login" && (
            <>
              <p className="text-gray-300 text-center mb-8">
                Sign in to your account
              </p>

              <input
                name="utkarshId"
                placeholder="Enter you email or Utkarsh ID"
                onChange={handleChange}
                className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full mb-2 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <div
                className="text-sm text-purple-300 cursor-pointer text-right mb-6 hover:underline"
                onClick={() => setStep("forgot")}
              >
                Forgot Password?
              </div>

              <button
                className="w-full bg-[#8B5CF6] py-4 font-black italic tracking-widest uppercase"
                style={{ fontFamily: "Milonga, cursive" }}
              >
                SIGN IN
              </button>
            </>
          )}

          {step === "forgot" && (
            <>
              <p className="text-gray-300 text-center mb-8">
                Recover your account
              </p>

              <input
                name="email"
                placeholder="Registered Email"
                onChange={handleChange}
                className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <input
                name="utkarshId"
                placeholder="Utkarsh ID"
                onChange={handleChange}
                className="w-full mb-6 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <button
                onClick={() => setStep("otp")}
                className="w-full bg-[#8B5CF6] py-4 font-black italic tracking-widest uppercase"
              >
                SEND OTP
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-gray-300 text-center mb-8">
                Enter OTP sent to your email
              </p>

              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
                className="w-full mb-6 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <button
                onClick={() => setStep("reset")}
                className="w-full bg-[#8B5CF6] py-4 font-black italic tracking-widest uppercase"
              >
                VERIFY OTP
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <p className="text-gray-300 text-center mb-8">
                Create new password
              </p>

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handleChange}
                className="w-full mb-4 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full mb-6 bg-black/60 border border-gray-700 p-3 rounded-md"
              />

              <button
                onClick={() => setStep("login")}
                className="w-full bg-[#8B5CF6] py-4 font-black italic tracking-widest uppercase"
              >
                RESET PASSWORD
              </button>
            </>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Milonga&display=swap');
        h1 { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
};

export default LoginPage;
