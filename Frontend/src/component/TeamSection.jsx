import { Linkedin } from "lucide-react";

import ukr1 from "../assets/aadi.jpeg";
import ukr2 from "../assets/ukr2.jpg";
import ukr3 from "../assets/ukr3.jpg";
import ukr4 from "../assets/ukr4.jpg";
import ukr5 from "../assets/ukr5.jpg";
import ukr6 from "../assets/ukr6.jpg";
import ukr7 from "../assets/ukr7.jpg";

const TeamSection = () => {
  const team = [
    {
      name: "Shamsad Ahmed",
      role: "Backend Developer",
      img: ukr2,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Aditya Singh",
      role: "Frontend Developer",
      img: ukr1,
      linkedin:
        "https://www.linkedin.com/in/aaditya212817?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Nandini",
      role: "UI/UX Designer",
      img: ukr3,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Divyanshu",
      role: "Backend developer",
      img: ukr4,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Aditya Singh",
      role: "Frontend Developer",
      img: ukr5,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Deepanshu",
      role: "Backend developer",
      img: ukr6,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Nandini",
      role: "UI/UX Designer",
      img: ukr7,
      linkedin: "https://www.linkedin.com",
    },
  ];

  return (
    <section
      id="team"
      className="relative w-full py-10 sm:py-16 overflow-hidden text-white"
    >
      <div className="absolute inset-0 bg-[#080131]" />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-4xl sm:text-5xl font-semibold
                         bg-linear-to-r from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
                         bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins" }}
            >
              Website Team
            </h2>

            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              The people behind UTKARSH&apos;26 website & management.
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max justify-start">
            {team.map((member, index) => (
              <div
                key={index}
                className="
                  w-70 sm:w-[320px]
                  shrink-0
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-2xl
                  shadow-[0_0_40px_rgba(139,92,246,0.08)]
                  overflow-hidden
                  hover:border-purple-500/40
                  transition
                "
              >
                <div className="w-full h-48 bg-white/10 border-b border-white/10 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>

                  <p className="text-sm text-gray-300 mt-1">{member.role}</p>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
