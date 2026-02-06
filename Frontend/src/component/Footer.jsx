import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import rulebookPdf from "../assets/rulebook.pdf";
import footGrid from "../assets/foot.svg";
import mapImage from "../assets/mapp.png";

import m1 from "../assets/monument-1.svg";
import m2 from "../assets/monument-2.svg";
import m3 from "../assets/monument-3.svg";
import m4 from "../assets/monument-4.svg";
import m5 from "../assets/monument-5.svg";
import m6 from "../assets/monument-6.svg";

const FooterSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMap, setShowMap] = useState(false);

  const monuments = [m1, m5, m2, m3, m4, m5, m2, m6];

  const scrollOrNavigate = (sectionId) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <>
      <footer className="relative w-full min-h-screen overflow-x-hidden text-gray-300 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${footGrid})` }}
        />

        <div className="absolute inset-0 bg-[#1a0b3d]/80" />

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-24 pt-24 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          <div>
            <h4 className="text-white font-semibold text-2xl mb-6">Pages</h4>

            <ul className="space-y-3 text-base sm:text-lg">
              <li
                onClick={() => scrollOrNavigate("hero")}
                className="cursor-pointer hover:text-white transition"
              >
                Home
              </li>

              <li
                onClick={() => navigate("/about")}
                className="cursor-pointer hover:text-white transition"
              >
                About
              </li>

              <li
                onClick={() => scrollOrNavigate("events")}
                className="cursor-pointer hover:text-white transition"
              >
                Events
              </li>

              <li
                onClick={() => scrollOrNavigate("team")}
                className="cursor-pointer hover:text-white transition"
              >
                Team
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-2xl mb-6">Catalog</h4>

            <ul className="space-y-3 text-base sm:text-lg">
              <li className="cursor-pointer hover:text-white transition">
                Brochure
              </li>

              <li className="cursor-pointer hover:text-white transition">
                Scheduler
              </li>

              <li
                onClick={() => window.open(rulebookPdf, "_blank")}
                className="cursor-pointer hover:text-white transition"
              >
                Rule Book
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              BBD <span className="text-blue-400">GROUP</span>
            </h3>
            <p className="text-base sm:text-lg mb-1">+91-2225066345</p>
            <p className="text-base sm:text-lg">hello@logoipsum.com</p>
          </div>

          <div className="md:text-right">
            <p className="text-base sm:text-lg">Ayodhya Road, Lucknow,</p>
            <p className="text-base sm:text-lg">Uttar Pradesh – 226028</p>

            <p
              onClick={() => setShowMap(true)}
              className="mt-6 underline cursor-pointer text-base sm:text-lg hover:text-white transition"
            >
              Campus Map
              <br />
              View Map
            </p>

            <div className="mt-4 flex md:justify-end">
              <img
                src={mapImage}
                alt="Campus Map Preview"
                onClick={() => setShowMap(true)}
                className="w-28 h-20 object-cover rounded-lg border border-white/20 cursor-pointer hover:scale-[1.03] transition"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pb-22 w-full overflow-hidden">
          <div className="flex flex-nowrap items-end justify-between w-full opacity-90 pointer-events-none overflow-hidden translate-y-22">
            {monuments.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Monument ${idx + 1}`}
                className="h-28 sm:h-32 md:h-40 lg:h-48 object-contain shrink-0"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center pb-12 px-4 overflow-hidden">
          <h1
            className="text-[14vw] sm:text-[12vw] md:text-[9vw] font-extrabold tracking-widest text-white/30 select-none whitespace-nowrap"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            # UTKARSH 2026
          </h1>
        </div>
      </footer>

      {showMap && (
        <div className="fixed inset-0 z-999 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMap(false)}
          />

          <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
              <h3 className="text-white text-lg sm:text-xl font-semibold">
                Campus Map
              </h3>

              <button
                onClick={() => setShowMap(false)}
                className="text-white/80 hover:text-white transition text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-5">
              <img
                src={mapImage}
                alt="Campus Map"
                className="w-full max-h-[75vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterSection;
