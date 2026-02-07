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
      name: "Deepanshu",
      role: "Backend Developer",
      img: ukr6,
      linkedin: "https://www.linkedin.com",
    },
    {
      name: "Divyanshu",
      role: "Backend Developer",
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
      name: "Nandini",
      role: "UI/UX Designer",
      img: ukr3,
      linkedin: "https://www.linkedin.com",
    },
    
    
    {
      name: "Nandini",
      role: "UI/UX Designer",
      img: ukr7,
      linkedin: "https://www.linkedin.com",
    },
  ];

  const topRow = team.slice(0, 4);
  const bottomRow = team.slice(4, 7);

  return (
    <section
      id="team"
      className="relative w-full py-12 sm:py-20 overflow-hidden text-white"
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

      <div className="absolute -top-32 -left-40 w-[420px] h-[420px] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-40 w-[420px] h-[420px] rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <h2
              className="text-4xl sm:text-5xl font-semibold bg-linear-to-r from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins" }}
            >
              Website Team
            </h2>

            <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
              The people behind UTKARSH&apos;26 website & management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {topRow.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-[0_0_80px_rgba(139,92,246,0.18)]"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-purple-400/60 to-transparent opacity-0 group-hover:opacity-100 transition" />

              <div className="relative w-full h-52 bg-white/10 border-b border-white/10 overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-90" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white tracking-wide">
                  {member.name}
                </h3>

                <p className="text-sm text-gray-300 mt-1">{member.role}</p>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition"
                >
                  <span className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-purple-400/30 transition">
                    <Linkedin size={16} />
                  </span>
                  View LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full max-w-[1100px]">
            {bottomRow.map((member, index) => (
              <div
                key={index}
                className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-[0_0_80px_rgba(139,92,246,0.18)]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-purple-400/60 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="relative w-full h-52 bg-white/10 border-b border-white/10 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-90" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white tracking-wide">
                    {member.name}
                  </h3>

                  <p className="text-sm text-gray-300 mt-1">{member.role}</p>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition"
                  >
                    <span className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-purple-400/30 transition">
                      <Linkedin size={16} />
                    </span>
                    View LinkedIn
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
