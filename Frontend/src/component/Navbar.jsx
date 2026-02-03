import React, { useState } from "react";
import utkarshLogo from "../assets/utkarsh_logo_new.png";
import bbdLogo from "../assets/bbd-logo.png";
import rulebookPdf from "../assets/rulebook.pdf";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    if (item === "Rulebook") {
      window.open(rulebookPdf, "_blank");
      setIsMenuOpen(false);
      return;
    }

    if (item === "Sponsorship_form") {
      navigate("/sponsorship_form");
      setIsMenuOpen(false);
      return;
    }

    if (item === "Food_stall_form") {
      navigate("/food_stall_form");
      setIsMenuOpen(false);
      return;
    }

    const sectionMap = {
      Events: "events",
      About: "about",
      Schedule: "schedule",
    };

    const sectionId = sectionMap[item];
    if (!sectionId) return;

    if (location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }

    setIsMenuOpen(false);
  };

  const navItems = [
    "Events",
    "About",
    "Schedule",
    "Rulebook",
    "Sponsorship_form",
    "Food_stall_form",
  ];

  return (
    <nav className="fixed top-0 w-full inset-x-0 px-4 sm:px-6 lg:px-8 py-6 z-50 bg-[#050214]">
      <div className="mx-auto">
        <div className="flex items-center justify-between">
          {/* LEFT LOGOS */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            <div
              className="bg-white p-1 rounded-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={utkarshLogo}
                alt="Utkarsh Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>

            <div className="bg-white px-2 py-1 rounded-sm flex items-center gap-2">
              <img
                src={bbdLogo}
                alt="BBD Logo"
                className="h-10 sm:h-12 object-contain"
              />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-10">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="italic text-lg hover:text-purple-400 transition"
                style={{ fontFamily: "Milonga" }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden sm:block bg-white text-[#050214] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition"
            >
              Login
            </Link>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex flex-col justify-center w-10 h-10"
            >
              <span
                className={`w-6 h-0.5 bg-white mb-1 transition ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white mb-1 transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-purple-500/30 pt-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="italic text-left hover:text-purple-400 transition"
                style={{ fontFamily: "Milonga" }}
              >
                {item}
              </button>
            ))}

            <Link
              to="/login"
              className="sm:hidden bg-white text-[#050214] px-8 py-2 rounded-full font-bold text-sm text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
