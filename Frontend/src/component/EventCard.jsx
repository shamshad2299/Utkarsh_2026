import bgpng from "../assets/Event_list_box.png";

const EventCard = ({ title, onClick, year = "2026" }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl  border-white/10 
                 p-8 h-48 flex flex-col justify-end group cursor-pointer
                 transition-all hover:border-purple-500/50"
    >
      {/* PNG Background */}
      <img
        src={bgpng}
        alt=""
        className="absolute inset-0 w-full h-full object-contain
                   pointer-events-none
                   scale-100 group-hover:scale-105 transition-transform duration-500
                   "
      />

      {/* Light overlay (not killing colors) */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold tracking-wider text-white/90">
          <span className="text-purple-400">{title.split(" ")[0]}</span>{" "}
          {title.split(" ").slice(1).join(" ")}
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-mono">{year}</p>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default EventCard;
