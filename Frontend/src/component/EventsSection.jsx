import { ArrowUpRight } from "lucide-react";
import EventCard from "./EventCard";

const EventsSection = () => {
  
  const events = Array(8).fill(null);

  return (
    <section className="relative bg-[#050214] text-white px-6 md:px-16 py-28 overflow-hidden">
      
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

     
      <div className="absolute top-40 left-0 w-full h-full pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path
            d="M0 150 H50 V450 H1100 V100 H1150 V800"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      
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
              Experience a thrilling array of events, from mind-bending coding competitions to
              electrifying dance performances, and showcase your talents on a stage that embraces
              innovation.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-200 transition-colors w-fit">
            See all <ArrowUpRight size={18} />
          </button>
        </div>

        {/* 🔧 CHANGE 2: gap thoda kam */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((_, index) => (
            <div
              key={index}
              className={index % 2 ? "lg:translate-y-2" : ""}
            >
              <EventCard />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
