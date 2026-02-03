import React from "react";
import aboutImage from "../assets/about.svg";

const AboutUs = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white px-6">
      
      {/* BASE DARK BACKGROUND */}
      <div className="absolute inset-0 bg-[#050214]" />

      {/* GRID BACKGROUND (SAME AS EVENTS SECTION) */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* CONTENT (ABOUT IMAGE) */}
      <div className="relative z-10 flex items-center justify-center w-full">
        <img
          src={aboutImage}
          alt="About Us"
          className="max-w-[90%] md:max-w-[70%] lg:max-w-[60%]"
        />
      </div>
    </section>
  );
};

export default AboutUs;
