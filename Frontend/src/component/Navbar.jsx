import React, { useState } from "react";
import utkarshLogo from "../assets/utkarsh_logo_new.png";
import bbdLogo from "../assets/bbd-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Events",
    "About",
    "Schedule",
    "Rulebook",
    "Sponsorship form",
    "Food stall form",
  ];

  return (
    <>
      <nav className="sticky top-0 w-full  px-4 sm:px-6 lg:px-8 py-6 z-50">
        <div className=" mx-auto">
          <div className="flex items-center justify-between">
            {/* Left logos container */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
              {/* Utkarsh Logo */}
              <div className="bg-white p-1 rounded-sm shrink-0">
                <img
                  src={utkarshLogo}
                  alt="Utkarsh Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                  loading="lazy"
                />
              </div>

              {/* BBD Logo */}
              <div className="bg-white px-2 py-1 rounded-sm flex items-center gap-2 shrink-0">
                <img
                  src={bbdLogo}
                  alt="BBD Logo"
                  className="h-10 sm:h-12 object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex ml-20 xl:w-4xl  items-center gap-8 xl:gap-12 absolute  xl:justify-between left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-base xl:text-lg italic hover:text-purple-400 transition-colors duration-200 whitespace-nowrap"
                  style={{ fontFamily: "Milonga" }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right section - Login and Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Desktop Login Button */}
              <button className="hidden sm:block bg-white text-[#050214] px-6 sm:px-8 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap">
                Login
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col items-center justify-center w-10 h-10"
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMenuOpen ? "max-h-100  mt-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className=" border-t border-purple-500/30 pt-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-base italic hover:text-purple-400 transition-colors duration-200 py-2"
                    style={{ fontFamily: "Milonga" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                
                {/* Mobile Login Button */}
                <button className="sm:hidden bg-white text-[#050214] px-8 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors duration-200 mt-2 w-full">
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;