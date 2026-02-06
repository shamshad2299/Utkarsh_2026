import React from "react";
import aboutImage from "../assets/about.png";
import {
  Sparkles,
  Trophy,
  Music,
  Users,
  CalendarDays,
  MapPin,
  Star,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";





const AboutSection = () => {
  const highlights = [
    {
      icon: <Sparkles size={22} />,
      title: "Virasat Se Vikas Tak",
      desc: "A celebration of culture, creativity and innovation — all in one grand fest.",
    },
    {
      icon: <Trophy size={22} />,
      title: "Competitions & Prizes",
      desc: "Technical + Cultural events with exciting prizes and recognition.",
    },
    {
      icon: <Music size={22} />,
      title: "EDM Night",
      desc: "High energy night with DJ vibes and unforgettable moments.",
    },
    {
      icon: <Users size={22} />,
      title: "Massive Participation",
      desc: "Students from multiple colleges participate across events & shows.",
    },
  ];

  const quickStats = [
    { label: "Fest Days", value: "3" },
    { label: "Events", value: "30+" },
    { label: "Participants", value: "5000+" },
    { label: "Teams", value: "200+" },
  ];

  const whyJoin = [
    {
      icon: <Star size={20} />,
      title: "Build your identity",
      desc: "Showcase your talent and get recognized in front of everyone.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Safe & managed",
      desc: "Well-organized events with proper coordination & security.",
    },
    {
      icon: <ArrowUpRight size={20} />,
      title: "Grow your network",
      desc: "Meet students, teams and communities from different domains.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#080131]" />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-purple-500/20 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-blue-500/20 blur-[140px] rounded-full" />

      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-16 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
            <div className="max-w-3xl">
              <p
                className="text-purple-200 tracking-widest uppercase text-sm sm:text-base"
                style={{ fontFamily: "Milonga" }}
              >
                About Utkarsh&apos;26
              </p>

              <h1
                className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05]"
                style={{ fontFamily: "Poppins" }}
              >
                BBD’s Grand Annual Cultural & Technical Fest
                <span className="block text-purple-300">
                  Virasat Se Vikas Tak
                </span>
              </h1>

              <p className="mt-5 text-gray-300 text-sm sm:text-base leading-relaxed">
                UTKARSH&apos;26 is BBD&apos;s flagship annual fest that brings
                together culture, innovation, and high-energy celebrations.
                From competitive technical events to cultural performances,
                UTKARSH is designed to deliver a complete festival vibe.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  <CalendarDays size={16} className="text-purple-200" />
                  <span className="text-sm text-gray-200">
                    26 – 28 February 2026
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  <MapPin size={16} className="text-purple-200" />
                  <span className="text-sm text-gray-200">
                    BBD University, Lucknow
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[520px]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(139,92,246,0.15)] overflow-hidden">
                <div className="w-full h-[260px] sm:h-[320px]">
                  <img
                    src={aboutImage}
                    alt="About Utkarsh"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Quick Overview
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {quickStats.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-2xl font-extrabold text-white">
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-300 mt-1 tracking-widest uppercase">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-gray-300 text-sm leading-relaxed">
                    Get ready for an unforgettable experience with competitions,
                    workshops, cultural performances and grand nights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2
              className="text-3xl sm:text-4xl font-semibold
              bg-linear-to-r from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
              bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins" }}
            >
              Highlights
            </h2>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6
                  shadow-[0_0_40px_rgba(139,92,246,0.10)]
                  hover:border-purple-500/40 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-purple-200">
                    {h.icon}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {h.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2
              className="text-3xl sm:text-4xl font-semibold
              bg-linear-to-r from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
              bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins" }}
            >
              Why You Should Join
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyJoin.map((w, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6
                  shadow-[0_0_40px_rgba(139,92,246,0.10)]
                  hover:border-purple-500/40 transition"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-purple-200">
                    {w.icon}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {w.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_0_70px_rgba(139,92,246,0.12)]">
              <h2
                className="text-3xl sm:text-4xl font-semibold"
                style={{ fontFamily: "Poppins" }}
              >
                Fest Journey (3 Days of Energy)
              </h2>

              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                UTKARSH is structured like a full festival journey — so every day
                feels unique and full of energy.
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs tracking-widest uppercase text-purple-200">
                    Day 1
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Openings + Competitions
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Registrations, inaugurations, and the first wave of events.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs tracking-widest uppercase text-purple-200">
                    Day 2
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Culture + Mega Performances
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Dance, music, stage shows, and full crowd energy.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs tracking-widest uppercase text-purple-200">
                    Day 3
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Finals + EDM Night
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Final rounds, prize distribution, and the grand closing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-300 text-sm sm:text-base">
              UTKARSH&apos;26 is not just a fest — it&apos;s a memory you will carry forever.
            </p>

            <p
              className="mt-2 text-purple-200 tracking-widest uppercase text-sm"
              style={{ fontFamily: "Milonga" }}
            >
              See you at UTKARSH&apos;26 ✨
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
