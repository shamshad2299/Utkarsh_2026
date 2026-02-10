import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import rulebookPdf from "../assets/newrulebook.pdf";
import schedulePdf from "../assets/sch.pdf"; // ✅ ADD THIS
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

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-24 pt-24">
          {/* DESKTOP */}
          <div className="hidden md:grid grid-cols-5 gap-12 md:gap-16">
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

                {/* ✅ Scheduler PDF */}
                <li
                  onClick={() => window.open(schedulePdf, "_blank")}
                  className="cursor-pointer hover:text-white transition"
                >
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
              <h4 className="text-white font-semibold text-2xl mb-6">Helpline</h4>
              <ul className="space-y-3 text-base sm:text-lg">
                <li className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Police</span>
                  <a
                    href="tel:100"
                    className="text-white font-semibold hover:text-purple-300 transition"
                  >
                    100
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Fire</span>
                  <a
                    href="tel:101"
                    className="text-white font-semibold hover:text-purple-300 transition"
                  >
                    101
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Ambulance</span>
                  <a
                    href="tel:102"
                    className="text-white font-semibold hover:text-purple-300 transition"
                  >
                    102
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Emergency</span>
                  <a
                    href="tel:112"
                    className="text-white font-semibold hover:text-purple-300 transition"
                  >
                    112
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                BBD <span className="text-blue-400">GROUP</span>
              </h3>
              <p className="text-base sm:text-lg mb-1">0522 619 6222</p>
              <p className="text-base sm:text-lg">info@bbdu.org</p>
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

          {/* MOBILE */}
          <div className="md:hidden flex flex-col min-h-[calc(100vh-120px)] pb-[300px]">
            <div className="grid grid-cols-3 gap-5">
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">Pages</h4>
                <ul className="space-y-2 text-sm">
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
                <h4 className="text-white font-semibold text-lg mb-4">
                  Catalog
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="cursor-pointer hover:text-white transition">
                    Brochure
                  </li>

                  {/* ✅ Scheduler PDF */}
                  <li
                    onClick={() => window.open(schedulePdf, "_blank")}
                    className="cursor-pointer hover:text-white transition"
                  >
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
                <h4 className="text-white font-semibold text-lg mb-4">
                  Helpline
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between gap-2">
                    <span className="text-gray-300">Police</span>
                    <a href="tel:100" className="text-white font-semibold">
                      100
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="text-gray-300">Fire</span>
                    <a href="tel:101" className="text-white font-semibold">
                      101
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="text-gray-300">Amb</span>
                    <a href="tel:102" className="text-white font-semibold">
                      102
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="text-gray-300">Emerg</span>
                    <a href="tel:112" className="text-white font-semibold">
                      112
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  BBD <span className="text-blue-400">GROUP</span>
                </h3>
                <p className="text-sm mb-1">0522 619 6222</p>
                <p className="text-sm">info@bbdu.org</p>
              </div>

              <div className="text-right">
                <p className="text-sm">Ayodhya Road, Lucknow,</p>
                <p className="text-sm">Uttar Pradesh – 226028</p>

                <p
                  onClick={() => setShowMap(true)}
                  className="mt-3 underline cursor-pointer text-sm hover:text-white transition"
                >
                  Campus Map
                  <br />
                  View Map
                </p>
              </div>
            </div>

            <div className="mt-8 w-full flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src={mapImage}
                alt="Campus Map"
                onClick={() => setShowMap(true)}
                className="w-full h-full object-cover cursor-pointer"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* MONUMENTS */}
        <div className="absolute left-0 right-0 bottom-0 z-10 w-full pointer-events-none">
          <div className="w-full overflow-hidden">
            <div className="flex flex-nowrap items-end justify-between w-full opacity-90 overflow-hidden translate-y-0">
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

          <div className="text-center pb-10 px-4 overflow-hidden">
            <h1
              className="text-[14vw] sm:text-[12vw] md:text-[9vw] font-extrabold tracking-widest text-white/30 select-none whitespace-nowrap"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              # UTKARSH 2026
            </h1>
          </div>
        </div>
      </footer>

      {/* MAP MODAL */}
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
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterSection;
