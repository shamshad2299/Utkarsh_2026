import desktopBg from "../assets/Group_1171274883.png";
import mobileBg from "../assets/Event_card_bg_mobile.png";

const EventCard = ({ title, onClick, year = "2026" }) => {
  return (
    <div
      onClick={onClick}
      className="
        relative overflow-hidden rounded-2xl
        h-full
        w-full
        pb-[10px]
        sm:pb-0
        sm:h-48
        sm:p-8
        flex flex-col justify-end
        cursor-pointer transition-all
        hover:border-purple-500/50
      "
    >
      {/* Background Images */}
      <img
        src={mobileBg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain sm:hidden"
      />
      <img
        src={desktopBg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain hidden sm:block"
      />

      {/* Content */}
      <div className="absolute z-10 md:pb-[30px] text-[#080131] ml-2 sm:ml-3 ">
        <h3 className="text-[12px] sm:text-[22px] font-bold tracking-wider truncate">
          {title}
        </h3>
        <p className="text-[8px] sm:text-[14px] mt-1 font-mono">
          {year}
        </p>
      </div>

      {/* Hover glow (desktop only) */}
      <div className="
        hidden sm:block
        absolute inset-0
        bg-gradient-to-br from-purple-600/10 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity
      " />
    </div>
  );
};

export default EventCard;
