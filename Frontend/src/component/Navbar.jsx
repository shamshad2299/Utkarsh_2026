import React from "react";
import utkarshLogo from "../assets/utkarsh-logo.png";
import bbdLogo from "../assets/bbd-logo.png";
import rulebookPdf from "../assets/rulebook.pdf";

const Navbar = ({ onLogin, onFoodStall, onSponsership }) => {
  const navItems = [
    "Events",
    "About",
    "Schedule",
    "Rulebook",
    "Sponsorship form",
    "Food stall form",
  ];

  return (
    <nav className="flex items-center px-8 py-6 z-20">
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded-sm">
          <img
            src={utkarshLogo}
            alt="Utkarsh Logo"
            className="h-10 w-10 object-contain"
          />
        </div>

        <div className="bg-white px-2 py-1 rounded-sm flex items-center gap-2">
          <img
            src={bbdLogo}
            alt="BBD Logo"
            className="h-8 object-contain"
          />
          <div className="text-[#050214] leading-none">
            <div className="font-black text-lg">BBD</div>
            <div className="text-[10px] font-bold tracking-tighter">
              GROUP
            </div>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <span
              key={item}
              onClick={() => {
                if (item === "Food stall form") onFoodStall();
                if (item === "Sponsorship form") onSponsership();
                if (item === "Rulebook") window.open(rulebookPdf, "_blank");
              }}
              className="text-sm italic hover:text-purple-400 transition-colors cursor-pointer"
              style={{ fontFamily: "Milonga" }}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          onClick={onLogin}
          className="bg-white text-[#050214] px-8 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
