import React from "react";
import edmImage from "../assets/edm.png";

const EdmPage = () => {
  return (
    <section className="relative w-full pt-6 pb-10 sm:pt-10 sm:pb-16 flex items-center justify-center overflow-hidden text-white px-6">
      
      {/* BASE BG */}
      <div className="absolute inset-0 bg-[#080131]" />

      {/* GRID BG */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* IMAGE */}
      <div className="relative z-10 flex items-center justify-center w-full">
        <img
          src={edmImage}
          alt="EDM"
          className="w-full max-w-[1100px] md:max-w-[900px] lg:max-w-[850px]"
        />
      </div>
    </section>
  );
};

export default EdmPage;
