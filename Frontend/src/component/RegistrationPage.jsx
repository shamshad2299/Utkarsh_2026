import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import regImage from "../assets/reg.png";

const RegistrationPage = ({
  title = "UTKARSH'26",
  subtitle = "Create account to get your Utkarsh ID",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    mobile: "",
    college: "",
    course: "",
    city: "",
    password: "",
    agreed: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [utkarshId, setUtkarshId] = useState("");

  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const guidelinesRef = useRef(null);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setShowSuccess(false);
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
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const sendOtp = () => {
    if (!formData.mobile) return alert("Enter mobile number first");
    const o = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(o);
    setOtpSent(true);
    alert("Demo OTP: " + o);
  };

  const verifyOtp = () => {
    otp === generatedOtp
      ? (setVerified(true), alert("OTP Verified"))
      : alert("Invalid OTP");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!verified) return alert("Verify OTP first");
    if (!formData.agreed) return alert("Accept Rules & Guidelines");
    setUtkarshId(`VKVS26${Math.floor(1000 + Math.random() * 9000)}`);
    setShowSuccess(true);
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

  const inputClass = `
    w-full mt-2 p-3 rounded-xl outline-none
    bg-white/5 backdrop-blur-md
    border border-white/20
    text-white placeholder:text-gray-400
    focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]
    transition
  `;

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row bg-linear-to-br from-[#4a4a71] via-[#39363f] to-[#0b0618]">
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={20} /> Home
      </div>

      <div className="flex items-center justify-center w-full">
        <img src={regImage} alt="visual" className="max-w-[95%] scale-110 opacity-95" />
      </div>

      <div className="w-full md:w-1/2 flex justify-center px-6 py-16">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20">
          <h1 className="text-4xl font-black italic text-[#000000]">{title}</h1>
          <p className="text-gray-300 mb-8">{subtitle}</p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["fullName", "email", "college", "city"].map((f) => (
                <div key={f}>
                  <label className="capitalize">{f}</label>
                  <input name={f} onChange={handleChange} className={inputClass} />
                </div>
              ))}

              {/* ✅ GENDER FIXED */}
              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className={`${inputClass} text-white`}
                >
                  <option value="" className="text-black bg-white">
                    Select
                  </option>
                  <option className="text-black bg-white">Male</option>
                  <option className="text-black bg-white">Female</option>
                  <option className="text-black bg-white">Other</option>
                </select>
              </div>

              <div>
                <label>Course</label>
                <input name="course" onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label>Mobile</label>
                <div className="flex gap-2 mt-2">
                  <input name="mobile" onChange={handleChange} className={inputClass} />
                  <button type="button" onClick={sendOtp} className="px-4 bg-[#8B5CF6] rounded-xl">
                    Get OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label>OTP</label>
                  <div className="flex gap-2 mt-2">
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} className={inputClass} />
                    <button type="button" onClick={verifyOtp} className="px-4 bg-green-600 rounded-xl">
                      Verify
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3 text-sm text-gray-300">
              <input type="checkbox" checked={formData.agreed} disabled className="accent-[#8B5CF6]" />
              <span>
                I agree to{" "}
                <span
                  onClick={() => setShowGuidelines(true)}
                  className="underline cursor-pointer text-[#8B5CF6]"
                >
                  Rules & Guidelines
                </span>
              </span>
            </div>

            <button
              onClick={handleRegister}
              className="w-full py-4 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] font-black italic tracking-widest"
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showGuidelines && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <motion.div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-black text-[#8B5CF6] mb-4">
                Rules & Guidelines
              </h2>

              <div
                ref={guidelinesRef}
                onScroll={needsScroll ? handleGuidelinesScroll : undefined}
                className="h-[45vh] overflow-y-auto text-sm text-gray-300 space-y-4 pr-2"
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
                <input type="checkbox" onChange={handleGuidelineAgree} className="accent-[#8B5CF6]" />
                <span>I have read & agree to the Rules & Guidelines</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center">
              <h2 className="text-3xl font-black text-green-400">
                Registration Successful 🎉
              </h2>
              <p className="mt-4">Your Utkarsh ID</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{utkarshId}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationPage;
