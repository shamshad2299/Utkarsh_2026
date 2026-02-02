import React, { useState } from "react";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import regImage from "../assets/reg.png";

const RegistrationPage = ({
  title = "UTKARSH'26",
  subtitle = "Create account to get your Utkarsh ID"
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
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="
      min-h-screen
      text-white
      overflow-x-hidden
      flex
      flex-col
      md:flex-row
      bg-linear-to-br
      from-[#010103]
      via-[#39363f]
      to-[#0b0618]
    ">

      {/* HOME */}
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer z-20">
        <ArrowLeft size={20} />
        <span className="tracking-widest font-semibold">Home</span>
      </div>

      {/* LEFT VISUAL (NOT A BLOCK, JUST CONTENT) */}
      <div className="relative flex items-center justify-center w-full overflow-visible">

        <img
          src={regImage}
          alt="Utkarsh Visual"
         className="
  max-w-95%
  md:max-w-95%
  scale-110
  opacity-95
  drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]
  select-none
"
        />
      </div>

      {/* RIGHT FORM (FLOATING CARD STYLE) */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="
          w-full
          max-w-xl
          bg-black/20
          backdrop-blur-xl
          rounded-2xl
          p-8
          shadow-[0_0_60px_rgba(139,92,246,0.25)]
        ">
          <h1 className="
            text-4xl
            md:text-5xl
            font-black
            italic
            tracking-tight
            text-[#8B5CF6]
            uppercase
            mb-2
          ">
            {title}
          </h1>

          <p className="text-gray-300 mb-8">
            {subtitle}
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["Full Name", "fullName", "Full Name"],
                ["Email ID", "email", "example@email.com"],
                ["College Name", "college", "College Name"],
                ["City Name", "city", "City Name"]
              ].map(([label, name, placeholder]) => (
                <div key={name}>
                  <label className="text-sm font-semibold">{label}</label>
                  <input
                    name={name}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className="
                      w-full mt-2
                      bg-black/60
                      border border-gray-700
                      p-3 rounded-md
                      outline-none
                      focus:border-[#8B5CF6]
                    "
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-semibold">Gender</label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className="
                    w-full mt-2
                    bg-black/60
                    border border-gray-700
                    p-3 rounded-md
                    outline-none
                    focus:border-[#8B5CF6]
                  "
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Mobile No</label>
                <input
                  name="mobile"
                  placeholder="8052269388"
                  onChange={handleChange}
                  className="
                    w-full mt-2
                    bg-black/60
                    border border-gray-700
                    p-3 rounded-md
                    outline-none
                    focus:border-[#8B5CF6]
                  "
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Course</label>
                <input
                  name="course"
                  placeholder="e.g. BBA, B.Tech"
                  onChange={handleChange}
                  className="
                    w-full mt-2
                    bg-black/60
                    border border-gray-700
                    p-3 rounded-md
                    outline-none
                    focus:border-[#8B5CF6]
                  "
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="
                    w-full mt-2
                    bg-black/60
                    border border-gray-700
                    p-3 rounded-md
                    outline-none
                    focus:border-[#8B5CF6]
                  "
                />
              </div>
            </div>

            <div className="flex gap-3 text-sm text-gray-300">
              <input type="checkbox" name="agreed" onChange={handleChange} />
              <p>I agree to all Rules & Guidelines for UTKARSH’26</p>
            </div>

            <button
              className="
                w-full mt-4
                bg-[#8B5CF6]
                hover:bg-[#7C3AED]
                py-4
                font-black
                italic
                tracking-widest
                uppercase
                transition
                shadow-[0_0_25px_rgba(139,92,246,0.6)]
              "
              style={{ fontFamily: "Milonga, cursive" }}
            >
              REGISTER
            </button>

            <p className="mt-4 text-sm text-gray-300 text-center">
              Already have an account?{" "}
              <span className="text-[#A78BFA] cursor-pointer hover:underline">
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>

      <div className="
        fixed bottom-6 right-6
        w-12 h-12
        rounded-full
        border border-gray-600
        bg-black/40
        flex items-center justify-center
      ">
        <ChevronLeft size={18} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Milonga&display=swap');
        h1 { font-family: 'Orbitron', sans-serif; }
        input::placeholder { color: #6b7280; }
      `}</style>
    </div>
  );
};

export default RegistrationPage;
