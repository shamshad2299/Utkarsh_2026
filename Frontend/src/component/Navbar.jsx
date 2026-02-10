import React, { useState, useEffect } from "react";
import utkarshLogo from "../assets/utkarsh_logo_new.png";
import bbdLogo from "../assets/bbd-logo.png";
import rulebookPdf from "../assets/newrulebook.pdf";
import schedulePdf from "../assets/sch.pdf";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (item) => {
    if (item === "Home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      setIsMenuOpen(false);
      return;
    }

    if (item === "Rulebook") {
      window.open(rulebookPdf, "_blank");
      setIsMenuOpen(false);
      return;
    }

    if (item === "Schedule") {
      window.open(schedulePdf, "_blank");
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

    if (item === "Profile") {
      navigate("/profile");
      setIsMenuOpen(false);
      return;
    }

    if (item === "About") {
      navigate("/about");
      setIsMenuOpen(false);
      return;
    }

    const sectionMap = {
      Events: "events",
    };

    const sectionId = sectionMap[item];
    if (!sectionId) return;

    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }

    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    "Home",
    "Events",
    "About",
    "Schedule",
    "Rulebook",
    "Sponsorship_form",
    "Food_stall_form",
    ...(isLoggedIn ? ["Profile"] : []),
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 w-full z-50 bg-[#080131]"
      style={{ fontFamily: "Milonga" }}
    >
      <div className="w-full px-3 sm:px-6 lg:px-10 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT LOGOS */}
          <div className="flex items-center gap-3 sm:gap-5 md:gap-8 shrink-0">
            <button
              className="bg-white p-1 rounded-sm cursor-pointer shrink-0"
              onClick={() => navigate("/")}
            >
              <img
                src={utkarshLogo}
                alt="Utkarsh Logo"
                className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain"
              />
            </button>

            <div className="bg-white px-2 py-1 rounded-sm flex items-center gap-2 shrink-0">
              <img
                src={bbdLogo}
                alt="BBD Logo"
                className="h-9 sm:h-11 md:h-12 object-contain"
              />
            </div>
          </div>

          {/* DESKTOP MENU (XL+) */}
          <div className="hidden xl:flex flex-1 justify-center min-w-0">
            <div className="flex items-center gap-7 xl:gap-8 flex-wrap justify-center">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-base xl:text-lg font-medium text-white hover:text-purple-400 transition whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Login / Logout (ONLY from md) */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-white/80 max-w-[170px] truncate">
                  Hello, {user.name || user.username || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 md:px-6 py-2 rounded-full font-bold text-sm transition active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex bg-white text-[#050214] px-5 md:px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition active:scale-95"
              >
                Login
              </Link>
            )}

            {/* HAMBURGER (Below XL) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md active:scale-95 transition"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU (Below XL) */}
        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[560px] mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-purple-500/30 pt-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-left text-base font-medium text-white hover:text-purple-400 transition"
              >
                {item}
              </button>
            ))}

            {/* Login/Logout inside mobile */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="text-sm text-white/80 border-b border-purple-500/30 pb-2">
                  Logged in as:{" "}
                  <span className="font-semibold">
                    {user.name || user.username || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-full font-bold text-sm text-center active:scale-95 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="md:hidden inline-flex justify-center bg-white text-[#050214] px-8 py-2 rounded-full font-bold text-sm text-center active:scale-95 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
