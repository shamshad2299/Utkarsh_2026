import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import rulebookPdf from "../assets/newrulebook.pdf";
import schedulePdf from "../assets/sch.pdf";  
import footGrid from "../assets/foot.svg";
import mapImage from "../assets/bbd_map.webp";
import MonumentBottom from "../component/MonumentBottom";
import bbd_logo from "../assets/bbd-logo.png";

const FooterSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMap, setShowMap] = useState(false);


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

        <div className="relative z-10 w-full px-4 sm:px-8 md:mb-60 lg:px-24 pt-24">
          {/* DESKTOP */}
          <div className="hidden md:grid grid-cols-5   ">
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

              <div className="flex flex-col items-center text-right">
                <img
                  src={bbd_logo}
                  alt="BBD Logo"
                  className="h-10 w-auto object-contain cursor-pointer"
                  onClick={() => navigate("/")}
                />

                <p className="text-sm mt-1">0522 619 6222</p>
                <p className="text-sm">info@bbdu.org</p>
              </div>
                  

            <div className="md:text-right">
              <p className="text-base sm:text-lg">Ayodhya Road, Lucknow,</p>
              <p className="text-base sm:text-lg">Uttar Pradesh – 226028</p>

              <p
                onClick={() => setShowMap(true)}
                className="mt-6 underline cursor-pointer text-base sm:text-lg hover:text-white transition"
              >
                Event Map
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
          <div className="md:hidden flex flex-col min-h-[calc(100vh-120px)] pb-50">
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

            <div className="mt-10 grid grid-cols-2 ">
              <div className="text-right flex ">
                <div className="flex items-center justify-center h-full w-full ">
                    <img
                      src={bbd_logo}
                      alt="BBD Logo"
                      className="object-cover h-10 w-auto cursor-pointer overflow-visible"
                      onClick={() => navigate("/")}
                    />
                </div>
                <div className="flex items-center justify-center mx-3">
                  <div className="text-center">
                    <p className="text-sm ">0522 619 6222</p>
                    <p className="text-sm">info@bbdu.org</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm">Ayodhya Road, Lucknow,</p>
                <p className="text-sm">Uttar Pradesh – 226028</p>

                <p
                  onClick={() => setShowMap(true)}
                  className="mt-3 underline cursor-pointer text-sm hover:text-white transition"
                >
                  Event Map
                </p>
              </div>
            </div>

            <div className="mt-8 w-full flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src={mapImage}
                alt=" Places of all events are mentioned"
                onClick={() => setShowMap(true)}
                className="w-full h-full object-cover cursor-pointer"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* MONUMENTS */}
         <div className="absolute left-0 right-0 bottom-0 z-10 w-full pointer-events-none md:mt-1000">
          <div className="w-full overflow-hidden  ">
            {/* Monument Bottom - Always bottom 0 */}
            <div className=" bottom-0 left-0 right-0 pointer-events-none z-20 ">
              <MonumentBottom />
            </div>
          </div> 

          <div className="text-center px-4 overflow-hidden">
            <h1
              className="text-[7vh] sm:text-[9vw] md:text-[9vw] lg:text-[9vw] font-extrabold tracking-wide sm:tracking-widest text-[#C8ABFE]/70 opacity-70 select-none whitespace-normal sm:whitespace-nowrap"
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
              <h3 className="text-white text-lg sm:text-xl font-semibold text-center">
             Places of all events are mentioned in Map (Zoom to See )
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
