// src/component/TeamSectionFolder/TeamCard.jsx
import { Github, Linkedin } from "lucide-react";

const roleLabelMap = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  designer: "UI/UX Designer",
};

const DottedRow = ({ label, value }) => (
  <div className="pb-0.5 border-b border-dashed border-purple-900 font-milonga text-[15px]">
    <span className="font-semibold">{label}:</span>{" "}
    {value || "—"}
  </div>
);

const TeamCard = ({ member }) => {
  const {
    name,
    role,
    imageUrl,
    college,
    course,
    linkedin,
    portfolio,
  } = member;

  return (
    <div
      className="
        team-card
        relative
        flex flex-col
        rounded-2xl
        text-[#2b1b4d]
        shadow-glow
        transition-transform duration-300
        hover:-translate-y-2
        w-[255px]
        h-[390px]
        overflow-hidden
        border border-dashed border-purple-900
      "
    >
      {/* ===== ROLE HEADER ===== */}
      <div className="px-6 pt-4 flex justify-center w-auto h-auto">
        <div className="inline-flex items-center overflow-hidden font-rampart text-xs tracking-wide">
          {/* GitHub square */}
          <div className="flex items-center rounded-sm justify-center w-9 h-9 text-black bg-white border">
            <Github size={25} />
          </div>

          {/* Role label */}
          <div className="px-2 py-0.5 bg-white rounded-r-sm border border-l-0 ">
            {roleLabelMap[role] || role}
          </div>
        </div>
      </div>

      {/* ===== IMAGE ===== */}
      <div className="px-6 pt-4 flex justify-center">
        <div className="image-wrapper">
          {/* Center image */}
          <div className="image-center">
            <img src={imageUrl} alt={name} />
          </div>
          {/* Corner decorations */}
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="px-6 mt-2 space-y-0.1 flex-1 items-center">
        <DottedRow label="Name" value={name} />
        <DottedRow label="College" value={college} />
        <DottedRow label="Course" value={course} />
      </div>

      {/* ===== FOOTER ===== */}
      <div className="absolute bottom-0 left-0 w-full h-[12%] flex items-center justify-center bg-white">
        <div className="inline-flex items-center overflow-hidden font-rampart text-xs tracking-wide">
          
          {/* LinkedIn square */}
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="flex items-center justify-center w-9 h-9 bg-black border rounded-sm hover:scale-105 transition"
            >
              <Linkedin size={22} className="text-white" />
            </a>
          ) : (
            <div className="flex items-center justify-center w-9 h-9 bg-black border rounded-sm text-white">
              <Linkedin size={22} />
            </div>
          )}

          {/* Portfolio label */}
          <div className="px-1 py-0.5 bg-white text-[11px]">
            {portfolio ? (
              <a
                href={portfolio}
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-600 transition"
              >
                Click here to see Portfolio
              </a>
            ) : (
              <span className="text-gray-400">
                Portfolio N/A
              </span>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default TeamCard;
