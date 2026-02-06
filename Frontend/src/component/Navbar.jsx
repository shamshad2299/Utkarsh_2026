import React, { useState, useEffect } from "react";
import utkarshLogo from "../assets/utkarsh_logo_new.png";
import bbdLogo from "../assets/bbd-logo.png";
import rulebookPdf from "../assets/rulebook.pdf";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

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
      Schedule: "schedule",
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
    "Events",
    "About",
    "Schedule",
    "Rulebook",
    "Sponsorship_form",
    "Food_stall_form",
    ...(isLoggedIn ? ["Profile"] : []),
  ];

  return (
    <nav className="fixed top-0 w-full inset-x-0 px-4 sm:px-6 lg:px-8 py-6 z-50 bg-[#080131]">
      <div className="mx-auto">
        <div className="flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm text-white/80">
                  Hello, {user.name || user.username || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block bg-white text-[#050214] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition"
              >
                Login
              </Link>
            )}

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

            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="text-sm text-white/80 border-b border-purple-500/30 pb-2">
                  Logged in as: <span className="font-semibold">{user.name || user.username || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-full font-bold text-sm text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="sm:hidden bg-white text-[#050214] px-8 py-2 rounded-full font-bold text-sm text-center"
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