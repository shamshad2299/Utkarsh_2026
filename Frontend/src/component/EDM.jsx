import React from "react";
import edmImage from "../assets/edm.png";

const EdmPage = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white px-6">
      
      {/* BASE DARK BACKGROUND */}
      <div className="absolute inset-0 bg-[#050214]" />

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* CONTENT (IMAGE SAME POSITION) */}
      <div className="relative z-10 flex items-center justify-center w-full">
        <img
          src={edmImage}
          alt="EDM"
          className="max-w-full md:max-w-[75%] lg:max-w-[65%]"
        />
      </div>
    </section>
  );
};

export default EdmPage;
