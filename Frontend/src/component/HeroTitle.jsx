const HeroTitle = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8" style={{ fontFamily: "Poppins" }}>
      {/* Container for better control */}
      <div className="max-w-2xl mx-auto md:mx-0">
        {/* Subtitle */}
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 tracking-wide">
          Virasat se vikas tak
        </p>

      <h1 className="text-[80px] md:text-[100px] lg:text-[140px] font-black uppercase leading-[0.85] tracking-tighter mb-6">
        UTKARSH <br />
        <span className="lowercase">fest'26</span>
      </h1>

        {/* Date */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
          26-28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;