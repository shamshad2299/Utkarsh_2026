import { ArrowUpRight } from "lucide-react";
import EventCard from "./EventCard";

import dividerImg from "../assets/div.png";

const EventsSection = () => {
  const events = Array(8).fill(null);

  return (
    <section className="relative bg-[#080131] text-white px-6 md:px-16 py-28 overflow-hidden">
      {/* BACKGROUND GRID */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* TOP HEADING */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-16 gap-6 relative">
          {/* LEFT TEXT */}
          <div className="max-w-2xl md:-ml-6">
            <h2
              className="
                text-5xl md:text-6xl font-semibold mb-6
                bg-linear-to-r
                from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
                bg-clip-text text-transparent
              "
              style={{ fontFamily: "Poppins" }}
            >
              Events List
            </h2>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Experience a thrilling array of events, from mind-bending coding
              competitions to electrifying dance performances, and showcase your
              talents on a stage that embraces innovation.
            </p>
          </div>

          {/* RIGHT BUTTON */}
          <div className="relative w-fit">
            <button className="flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors w-fit relative z-20">
              See all <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((_, index) => (
            <div key={index} className={index % 2 ? "lg:translate-y-2" : ""}>
              <EventCard />
            </div>
          ))}
        </div>
      </div>

      {/* DIVIDER IMAGE */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20 pointer-events-none select-none z-10">
        <img src={dividerImg} alt="divider" className="w-full object-cover" />
      </div>
    </section>
  );
};

export default EventsSection;
