import React from "react";
import footGrid from "../assets/foot.svg";

import m1 from "../assets/monument-1.svg";
import m2 from "../assets/monument-2.svg";
import m3 from "../assets/monument-3.svg";
import m4 from "../assets/monument-4.svg";
import m5 from "../assets/monument-5.svg";
import m6 from "../assets/monument-6.svg";

const FooterSection = () => {
  const monuments = [m1,m5, m2, m3, m4, m5,m2,m6];

  return (
    <footer className="relative w-full min-h-screen overflow-x-hidden text-gray-300 flex flex-col">

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${footGrid})` }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-[#1a0b3d]/80" />

      {/* 🔹 TOP CONTENT (FULL WIDTH, WITH PADDING) */}
      <div className="relative z-10 w-full px-16 lg:px-24 pt-24 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div>
          <h4 className="text-white font-semibold text-2xl mb-6">Pages</h4>
          <ul className="space-y-3 text-lg">
            <li>Home</li>
            <li>About</li>
            <li>Events</li>
            <li>Team</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-2xl mb-6">Catalog</h4>
          <ul className="space-y-3 text-lg">
            <li>Brochure</li>
            <li>Scheduler</li>
            <li>Rule Book</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            BBD <span className="text-blue-400">GROUP</span>
          </h3>
          <p className="text-lg mb-1">+91-2225066345</p>
          <p className="text-lg">hello@logoipsum.com</p>
        </div>

        <div className="md:text-right">
          <p className="text-lg">Ayodhya Road, Lucknow,</p>
          <p className="text-lg">Uttar Pradesh – 226028</p>
          <p className="mt-6 underline cursor-pointer text-lg">
            Campus Map<br />Download Map
          </p>
        </div>
      </div>

      {/* 🔹 MONUMENT STRIP (EDGE TO EDGE, 6 ALWAYS VISIBLE) */}
      <div className="relative z-10 mt-auto pb-28 w-full">
        <div className="flex flex-nowrap items-end justify-between w-full opacity-90 pointer-events-none">
          {monuments.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Monument ${idx + 1}`}
              className="h-32 md:h-40 lg:h-48 object-contain shrink-0"
            />
          ))}
        </div>
      </div>

      {/* 🔹 BIG EVENT TEXT */}
      <div className="relative z-10 text-center pb-12">
        <h1
          className="text-[12vw] md:text-[9vw] font-extrabold tracking-widest text-white/30 select-none"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          # UTKARSH 2026
        </h1>
      </div>
    </footer>
  );
};

export default FooterSection;
