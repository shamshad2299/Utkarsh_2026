const StageCard = ({ children }) => {
  return (
    <div className="relative w-[320px] h-[520px]">
      {/* Glow */}
      <div className="absolute inset-0 bg-purple-600/40 blur-[22px] rounded-[28px]" />

      {/* Actual card */}
      <div
        className="
        ml-30
          inverted-radius
           w-[320px] h-[420px] 
          relative 
          bg-white
          border border-purple-400/40
          shadow-[0_0_40px_rgba(139,92,246,0.6)]
          text-white
        "
      >
        {children}
      </div>
    </div>
  );
};

export default StageCard;
