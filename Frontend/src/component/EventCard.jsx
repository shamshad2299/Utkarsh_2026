import { ArrowUpRight } from "lucide-react";

const EventCard = ({ title, onClick, year = "2026" }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a051a] p-8 h-48 flex flex-col justify-end group cursor-pointer transition-all hover:border-purple-500/50"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0 20 H40 V60 H80 V40 H120 V80 H160 V20 H200" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
          <path d="M20 0 V40 H60 V10 H100 V50 H140 V0" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
          <circle cx="40" cy="60" r="1" fill="currentColor" className="text-purple-400" />
          <circle cx="120" cy="80" r="1" fill="currentColor" className="text-purple-400" />
          <circle cx="60" cy="40" r="1" fill="currentColor" className="text-blue-400" />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold tracking-wider text-white/90">
          <span className="text-purple-400">{title.split(" ")[0]}</span>{" "}
          {title.split(" ").slice(1).join(" ")}
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-mono">{year}</p>
      </div>

      <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default EventCard;
